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
import { CurveTextInput } from "@/features/editor/components/curve-input";

interface CurveTextSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

export const CurveTextSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: CurveTextSidebarProps) => {
  const initialCurveText = editor?.getActiveCurveText() || 0

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const [properties, setProperties] = useState({
    CurveText: initialCurveText,
  });

  const selectedObject = editor?.selectedObjects[0];

  const onChangeCurveText = (value: number) => {
    if (!selectedObject) {
      return;
    }

    editor?.changeCurveText(value);
    setProperties((current) => ({
      ...current,
      CurveText: value,
    }));
  };

  return (
    <aside
      className={cn(
        "bg-white lg:left-[100px] absolute lg:bottom-auto bottom-20 border-r z-[80] lg:w-[360px] w-full lg:h-full h-80 flex flex-col",
        activeTool === "curveText" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader
        title="Curve Text"
        description="Maximum value should be 360"
      />
      <ScrollArea>
        <div className="p-4 space-y-1 border-b">
          <CurveTextInput
            value={properties.CurveText}
            onChange={onChangeCurveText}
         />
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
