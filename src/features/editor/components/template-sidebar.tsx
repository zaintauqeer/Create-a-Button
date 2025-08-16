import Image from "next/image";
import { AlertTriangle, Loader, Crown, Search } from "lucide-react";
import { useEffect, useState } from "react";

import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";

import { ActiveTool, Editor } from "@/features/editor/types";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";

import {
  ResponseType,
  useGetTemplates,
} from "@/features/projects/api/use-get-templates";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConfirm } from "@/hooks/use-confirm";
import { Input } from "@/components/ui/input";

interface TemplateSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const TemplateSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: TemplateSidebarProps) => {
  const { shouldBlock, triggerPaywall } = usePaywall();
  const [searchQuery, setSearchQuery] = useState("");

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to replace the current project with this template."
  );

  const { data, isLoading, isError } = useGetTemplates();

  const filteredTemplates = data?.filter(
    (template: { templateName: string; templateTags: string[] }) => {
      console.log(data);

      const searchLower = searchQuery.toLowerCase();
      return (
        template.templateName?.toLowerCase().includes(searchLower) ||
        template.templateTags?.some((tag: string) =>
          tag.toLowerCase().includes(searchLower)
        )
      );
    }
  );

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onClick = async (template: ResponseType["data"][0]) => {
    const ok = await confirm();
    if (ok) {
      try {
        console.log(template);
        const response = await fetch(`${template.templateJson}`);
        if (!response.ok) {
          throw new Error("Failed to fetch template content");
        }
        const templateContent = await response.text();
        editor?.loadJson(templateContent);
      } catch (error) {
        console.error("Error loading template:", error);
      }
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const templateId = searchParams.get("templateId");

    if (templateId && data) {
      const template = data.find((t: { _id: string }) => t._id === templateId);
      if (template) {
        console.log("templates", data);
        fetch(template.templateJson)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to fetch template content");
            }
            return response.text();
          })
          .then((templateContent) => {
            console.log("templateContent", templateContent);
            editor?.loadJson(templateContent);
          })
          .catch((error) => {
            console.error("Error loading template:", error);
          });
      }
    }
  }, [data]);

  return (
    <aside
      className={cn(
        "bg-white lg:left-[100px] absolute transition-transform duration-500 ease-in-out lg:bottom-auto bottom-20 border-r z-[80] lg:w-[360px] w-full lg:h-full h-80 flex flex-col",
        activeTool === "templates"
          ? "translate-x-0 translate-y-0"
          : "translate-y-[135%] lg:translate-y-0 lg:-translate-x-[135%]"
      )}
    >
      <ConfirmDialog />
      <ToolSidebarHeader
        title="Templates"
        description="Choose from a variety of templates to get started"
      />
      <div className="px-4 py-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates by name or tags..."
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
            Failed to fetch templates
          </p>
        </div>
      )}
      <ScrollArea>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {filteredTemplates?.map(
              (template: ResponseType["data"][0], index: number) => {
                return (
                  <button
                    onClick={() => onClick(template)}
                    key={index}
                    className="aspect-square relative w-full group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden border"
                  >
                    <Image
                      fill
                      src={template.templateThumbnail || ""}
                      alt={template.templateName || "Template"}
                      className="object-cover p-4"
                    />
                    <div className="opacity-0 group-hover:opacity-100 absolute left-0 bottom-0 w-full text-[10px] truncate text-white p-1 bg-black/50 text-left">
                      {template.templateName}
                    </div>
                    {template.tags && template.tags.length > 0 && (
                      <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                        {template.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-black/50 text-white text-[8px] px-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                );
              }
            )}
          </div>
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
