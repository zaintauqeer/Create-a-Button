import { IoTriangle } from "react-icons/io5";
import { FaDiamond } from "react-icons/fa6";
import { FaCircle, FaSquare, FaSquareFull } from "react-icons/fa";

import { ActiveTool, Editor } from "@/features/editor/types";
import { ShapeTool } from "@/features/editor/components/shape-tool";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      <ScrollArea>
        <div className="grid grid-cols-3 gap-4 p-4">
          <ShapeTool
            onClick={() => {
              editor?.addCircle();
              onClose();
            }}
            icon={FaCircle}
          />
          <ShapeTool
            onClick={() => {
              editor?.addSoftRectangle();
              onClose();
            }}
            icon={FaSquare}
          />
          <ShapeTool
            onClick={() => {
              editor?.addRectangle();
              onClose();
            }}
            icon={FaSquareFull}
          />
          <ShapeTool
            onClick={() => {
              editor?.addTriangle();
              onClose();
            }}
            icon={IoTriangle}
          />
          <ShapeTool
            onClick={() => {
              editor?.addInverseTriangle();
              onClose();
            }}
            icon={IoTriangle}
            iconClassName="rotate-180"
          />
          <ShapeTool
            onClick={() => {
              editor?.addDiamond();
              onClose();
            }}
            icon={FaDiamond}
          />
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
