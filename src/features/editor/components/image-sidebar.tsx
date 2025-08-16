import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ActiveTool, Editor } from "@/features/editor/types";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ImageSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

interface ImageData {
  id: string;
  urls: {
    regular: string;
    small: string;
  };
  alt_description: string;
  user: {
    name: string;
  };
}

export const ImageSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ImageSidebarProps) => {
  // const { isLoading, isError } = useGetImages();

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const [data, setData] = useState<ImageData[]>([
    {
      id: "1",
      urls: {
        regular: "/testimonials/1.jpg",
        small: "/testimonials/1.jpg",
      },
      alt_description: "Image",
      user: {
        name: "Unsplash",
      },
    },
    {
      id: "2",
      urls: {
        regular: "/testimonials/2.jpg",
        small: "/testimonials/2.jpg",
      },
      alt_description: "Image",
      user: {
        name: "Unsplash",
      },
    },
    {
      id: "3",
      urls: {
        regular: "/testimonials/3.jpg",
        small: "/testimonials/3.jpg",
      },
      alt_description: "Image",
      user: {
        name: "Unsplash",
      },
    },
    {
      id: "4",
      urls: {
        regular: "/testimonials/4.jpg",
        small: "/testimonials/4.jpg",
      },
      alt_description: "Image",
      user: {
        name: "Unsplash",
      },
    },
    {
      id: "5",
      urls: {
        regular: "/testimonials/5.jpg",
        small: "/testimonials/5.jpg",
      },
      alt_description: "Image",
      user: {
        name: "Unsplash",
      },
    },
  ]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const newImage: ImageData = {
          id: (data.length + 1).toString(),
          urls: {
            regular: dataUrl,
            small: dataUrl,
          },
          alt_description: "Uploaded Image",
          user: {
            name: "User",
          },
        };
        setData([...data, newImage]);
      };
      reader.readAsDataURL(file);
    }
  };

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
      <div className="p-4 border-b">
        {/* <UploadButton
          appearance={{
            button: "w-full text-sm font-medium",
            allowedContent: "hidden"
          }}
          content={{
            button: "Upload Image"
          }}
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            editor?.addImage(res[0].url);
          }}
        /> */}

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
      </div>
      {/* {isLoading && (
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
      )} */}
      <ScrollArea>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {data &&
              data.map((image) => {
                return (
                  <button
                    onClick={() => {
                      editor?.addImage(image.urls.regular);
                      onClose();
                    }}
                    key={image.id}
                    className="relative w-full h-[100px] group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden border"
                  >
                    <Image
                      fill
                      src={image.urls.small}
                      alt={image.alt_description || "Image"}
                      className="object-cover"
                    />
                    <Link
                      target="_blank"
                      href="#"
                      className="opacity-0 group-hover:opacity-100 absolute left-0 bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50 text-left"
                    >
                      {image.user.name}
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
