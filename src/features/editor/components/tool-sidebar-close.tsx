import { ChevronsLeft } from "lucide-react";

interface ToolSidebarCloseProps {
  onClick: () => void;
};

export const ToolSidebarClose = ({
  onClick,
}: ToolSidebarCloseProps) => {
  return (
    <button
      onClick={onClick}
      className="z-50 lg:-rotate-0 -rotate-90 absolute lg:-right-[1.80rem] lg:left-auto left-1/2  h-[70px] bg-white lg:top-1/2 -top-[48px] transform lg:-translate-y-1/2 lg:-translate-x-0 -translate-x-1/2 flex items-center justify-center rounded-r-xl px-1 pr-2  border-r border-y group"
    >
      <ChevronsLeft className="size-4 text-black group-hover:opacity-75 transition" />
    </button>
  );
};
