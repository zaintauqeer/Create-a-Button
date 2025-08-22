import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ActiveTool, Editor } from "@/features/editor/types";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useGetImages } from "@/features/images/api/use-get-images";
import { AlertTriangle, Loader, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ImageSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

interface ImageData {
  image: string;
  image_name: string;
  image_tags: string[];
}

export const ImageSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ImageSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError } = useGetImages();

  const filteredImages = data?.filter(
    (image: { image_name: string; image_tags: string[] }) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        image.image_name?.toLowerCase().includes(searchLower) ||
        image.image_tags?.some((tag: string) =>
          tag.toLowerCase().includes(searchLower)
        )
      );
    }
  );

  const onClose = () => {
    onChangeActiveTool("select");
  };

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const dataUrl = e.target?.result as string;
  //       const newImage: ImageData = {
  //         image: "",
  //         image_name: "",
  //         image_tags: [],
  //       };
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  return (
    <aside
      className={cn(
        "bg-white lg:left-[100px] absolute transition-transform duration-500 ease-in-out lg:bottom-auto bottom-20 border-r z-[80] lg:w-[360px] w-full lg:h-full h-80 flex flex-col",
        activeTool === "images"
          ? "translate-x-0 translate-y-0"
          : "translate-y-[135%] lg:translate-y-0 lg:-translate-x-[135%]"
      )}
    >
      <ToolSidebarHeader
        title="Images"
        description="Add images to your canvas"
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

      {/* <div className="p-4 border-b">
        <label
          htmlFor="upload"
          className={buttonVariants({
            size: "sm",
            className: "w-full flex items-center gap-1 cursor-pointer",
          })}
        >
          Upload Image
          <input
            id="upload"
            name="upload-img"
            type="file"
            hidden
            onChange={handleFileChange}
          />
        </label>
      </div> */}
      {isLoading && (
        <div className="flex items-center justify-center flex-1">
          <Loader className="size-4 text-muted-foreground animate-spin" />
        </div>
      )}
      {isError && (
        <div className="flex flex-col gap-y-4 items-center justify-center flex-1">
          <AlertTriangle className="size-4 text-muted-foreground" />
          <p className="text-muted-foreground text-xs">
            Failed to fetch images
          </p>
        </div>
      )}
      <ScrollArea>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {filteredImages?.map((image) => {
              return (
                <button
                  onClick={() => {
                    editor?.addImage(image.image);
                    onClose();
                  }}
                  key={image.id}
                  className="relative w-full h-[100px] group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden border"
                >
                  <Image
                    fill
                    src={image.image}
                    alt={image.image_name || "Image"}
                    className="object-cover"
                  />
                  <Link
                    target="_blank"
                    href="#"
                    className="opacity-0 group-hover:opacity-100 absolute left-0 bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50 text-left"
                  >
                    {image.image_name}
                  </Link>
                </button>
              );
            })}
          </div>
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
