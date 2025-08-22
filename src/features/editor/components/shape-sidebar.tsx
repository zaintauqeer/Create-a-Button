import { ActiveTool, Editor } from "@/features/editor/types";
import { ShapeTool } from "@/features/editor/components/shape-tool";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { useGetShapes } from "@/features/images/api/use-get-shapes";
import { AlertTriangle, Icon, Loader, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ShapeSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const ShapeSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ShapeSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: shapes, isLoading, isError } = useGetShapes();

  const filteredShapes = shapes?.filter(
    (shape: { shape_name: string; shape_tags: string[] }) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        shape.shape_name?.toLowerCase().includes(searchLower) ||
        shape.shape_tags?.some((tag: string) =>
          tag.toLowerCase().includes(searchLower)
        )
      );
    }
  );

  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "bg-white lg:left-[100px] absolute transition-transform duration-500 ease-in-out lg:bottom-auto bottom-20 border-r z-[80] lg:w-[360px] w-full lg:h-full h-80 flex flex-col",
        activeTool === "shapes"
          ? "translate-x-0 translate-y-0"
          : "translate-y-[135%] lg:translate-y-0 lg:-translate-x-[135%]"
      )}
    >
      <ToolSidebarHeader
        title="Shapes"
        description="Add shapes to your canvas"
      />

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
          <p className="text-muted-foreground text-xs">
            Failed to fetch shapes
          </p>
        </div>
      )}
      <ScrollArea>
        <div className="grid grid-cols-3 gap-4 p-4">
          {filteredShapes?.map((shape) => (
            <button
              className="aspect-square border rounded-md p-5"
              onClick={() => {
                editor?.addCircle();
                onClose();
              }}
            >
              <img
                src={shape.shape}
                alt={shape.shape_name}
                className={"h-full w-full"}
              />
            </button>
          ))}
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
