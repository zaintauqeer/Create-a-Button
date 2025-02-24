import { 
  ActiveTool, 
  Editor,
  fonts,
  FONT_SIZE,
} from "@/features/editor/types";
import { useState } from "react";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FontSizeInput } from "@/features/editor/components/font-size-input";

interface FontSizeSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

export const FontSizeSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: FontSizeSidebarProps) => {
  const initialFontSize = editor?.getActiveFontSize() || FONT_SIZE

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const [properties, setProperties] = useState({
    fontSize: initialFontSize,
  });

  const selectedObject = editor?.selectedObjects[0];

  const onChangeFontSize = (value: number) => {
    if (!selectedObject) {
      return;
    }

    editor?.changeFontSize(value);
    setProperties((current) => ({
      ...current,
      fontSize: value,
    }));
  };

  return (
    <aside
      className={cn(
        "bg-white lg:left-[100px] absolute lg:bottom-auto bottom-20 border-r z-[80] lg:w-[360px] w-full lg:h-full h-80 flex flex-col",
        activeTool === "fontSize" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader
        title="Font Size"
        description="Change the text font Size"
      />
      <ScrollArea>
        <div className="p-4 space-y-1 border-b">
          <FontSizeInput
            value={properties.fontSize}
            onChange={onChangeFontSize}
         />
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
