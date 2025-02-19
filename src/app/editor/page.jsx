import React from 'react'
import Link from "next/link";
import { Loader, TriangleAlert } from "lucide-react";

import { useGetProject } from "@/features/projects/api/use-get-project";

import { Editor } from "@/features/editor/components/editor";
import { Button } from "@/components/ui/button";

export default function EditorPage() {
  const {
    data2,
    isLoading,
    isError
  } = useGetProject(params.projectId);
    const data = {
        "id": "",
        "name": "Test",
        "json":"",
        "height": 1200,
        "width": 900,
        "thumbnailUrl": null,
        "isTemplate": null,
        "isPro": null,
        "createdAt": "2024-11-26T04:58:53.031Z",
        "updatedAt": "2024-11-27T05:25:05.526Z"
    }

    if (isLoading || !data2) {
      return (
        <div className="h-full flex flex-col items-center justify-center">
          <Loader className="size-6 animate-spin text-muted-foreground" />
        </div>
      );
    }
  
    if (isError) {
      return (
        <div className="h-full flex flex-col gap-y-5 items-center justify-center">
          <TriangleAlert className="size-6 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            Failed to fetch project
          </p>
          <Button asChild variant="secondary">
            <Link href="/">
              Back to Home
            </Link>
          </Button>
        </div>
      );
    }
  return (
    <Editor initialData={data}/>
  )
}
