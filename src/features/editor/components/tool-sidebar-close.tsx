import { ChevronsLeft } from "lucide-react";

interface ToolSidebarCloseProps {
  onClick: () => void;
};

export const ToolSidebarClose = ({
  onClick,
}: ToolSidebarCloseProps) => {
  return (
    <></>
    // <button
    //   onClick={onClick}
    //   className="z-50 -rotate-90 absolute lg:-right-[1.80rem] left-1/2  h-[70px] bg-white lg:top-1/2 -top-[100px] transform lg:-translate-y-1/2 -translate-x-1/2 flex items-center justify-center rounded-r-xl px-1 pr-2 lg:border-l-0 border-l border-r border-y group"
    // >
    //   <ChevronsLeft className="size-4 text-black group-hover:opacity-75 transition" />
    // </button>
  );
};
