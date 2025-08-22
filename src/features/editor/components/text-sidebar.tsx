import { ActiveTool, Editor } from "@/features/editor/types";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useGetFonts } from "@/features/images/api/use-get-fonts";
import { AlertTriangle, Loader, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TextSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const TextSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: TextSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: fonts, isLoading, isError } = useGetFonts();

  const filteredFonts = fonts?.filter(
    (font: { font_name: string; font_tags: string[] }) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        font.font_name?.toLowerCase().includes(searchLower) ||
        font.font_tags?.some((tag: string) =>
          tag.toLowerCase().includes(searchLower)
        )
      );
    }
  );

  const loadFontFromCloudinary = async (fontName: string, fontUrl: string) => {
    const isAlreadyLoaded = [...document.fonts].some(
      (fontFace) => fontFace.family === fontName
    );
    if (isAlreadyLoaded) return;

    const fontFace = new FontFace(fontName, `url(${fontUrl})`);
    const loadedFont = await fontFace.load();
    document.fonts.add(loadedFont);
  };

  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "bg-white lg:left-[100px] absolute transition-transform duration-500 ease-in-out lg:bottom-auto bottom-20 border-r z-[80] lg:w-[360px] w-full lg:h-full h-80 flex flex-col",
        activeTool === "text"
          ? "translate-x-0 translate-y-0"
          : "translate-y-[135%] lg:translate-y-0 lg:-translate-x-[135%]"
      )}
    >
      <ToolSidebarHeader title="Text" description="Add text to your canvas" />
      <div className="px-4 py-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search images by name or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      {isLoading && (
        <div className="flex items-center justify-center flex-1">
          <Loader className="size-4 text-muted-foreground animate-spin" />
        </div>
      )}
      {isError && (
        <div className="flex flex-col gap-y-4 items-center justify-center flex-1">
          <AlertTriangle className="size-4 text-muted-foreground" />
          <p className="text-muted-foreground text-xs">Failed to fetch fonts</p>
        </div>
      )}
      <ScrollArea>
        <div className="p-4 space-y-4 border-b">
          {filteredFonts?.map((font) => (
            <Button
              key={font.font_name}
              variant="secondary"
              size="lg"
              className="w-full h-16 justify-start text-left"
              onClick={async () => {
                await loadFontFromCloudinary(font.font_name, font.font);
                editor?.addText(font.font_name, {
                  fontSize: 48,
                  fontFamily: font.font_name,
                });
                onClose();
              }}
            >
              <span className="text-4xl font-bold">{font.font_name}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
