import Image from "next/image";
import { AlertTriangle, Loader, Crown } from "lucide-react";

import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";

import { 
  ActiveTool, 
  Editor,
} from "@/features/editor/types";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";

import { ResponseType, useGetTemplates } from "@/features/projects/api/use-get-templates";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConfirm } from "@/hooks/use-confirm";

interface TemplateSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

export const TemplateSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: TemplateSidebarProps) => {
  const { shouldBlock, triggerPaywall } = usePaywall();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to replace the current project with this template."
  )

  const { data, isLoading, isError } = useGetTemplates();

  

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onClick = async (template: ResponseType["data"][0]) => {
    const ok = await confirm();
    // console.log(`${process.env.NEXT_PUBLIC_API_URL}${template.templateJson}`)
    // return
    if (ok) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${template.templateJson}`);
        if (!response.ok) {
          throw new Error('Failed to fetch template content');
        }
        const templateContent = await response.text();
        editor?.loadJson(templateContent);
      } catch (error) {
        console.error('Error loading template:', error);
      }
    }
  };

  return (
    <aside
      className={cn(
        "bg-white lg:left-[100px] absolute lg:bottom-auto bottom-20 border-r z-[80] lg:w-[360px] w-full lg:h-full h-80 flex flex-col",
        activeTool === "templates" ? "visible" : "hidden",
      )}
    >
      <ConfirmDialog />
      <ToolSidebarHeader
        title="Templates"
        description="Choose from a variety of templates to get started"
      />
      {isLoading && (
        <div className="flex items-center justify-center flex-1">
          <Loader className="size-4 text-muted-foreground animate-spin" />
        </div>
      )}
      {isError && (
        <div className="flex flex-col gap-y-4 items-center justify-center flex-1">
          <AlertTriangle className="size-4 text-muted-foreground" />
          <p className="text-muted-foreground text-xs">
            Failed to fetch templates
          </p>
        </div>
      )}
      <ScrollArea>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {data && data.map((template: ResponseType["data"][0]) => {
              return (
                <button
                  onClick={() => onClick(template)}
                  key={template.id}
                  className="aspect-square relative w-full group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden border"
                >
                  <Image
                    fill
                    src={template.templateThumbnail || ""}
                    alt={template.templateName || "Template"}
                    className="object-cover p-4"
                  />
                  {/* {template.isPro && (
                    <div className="absolute top-2 right-2 size-8 items-center flex justify-center bg-black/50 rounded-full">
                      <Crown className="size-4 fill-yellow-500 text-yellow-500" />
                    </div>
                  )} */}
                  <div
                    className="opacity-0 group-hover:opacity-100 absolute left-0 bottom-0 w-full text-[10px] truncate text-white p-1 bg-black/50 text-left"
                  >
                    {template.templateName}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
