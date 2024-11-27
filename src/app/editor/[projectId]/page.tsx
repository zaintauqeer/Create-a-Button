"use client";

import Link from "next/link";
import { Loader, TriangleAlert } from "lucide-react";

import { useGetProject } from "@/features/projects/api/use-get-project";

import { Editor } from "@/features/editor/components/editor";
import { Button } from "@/components/ui/button";

interface EditorProjectIdPageProps {
  params: {
    projectId: string;
  };
};

const EditorProjectIdPage = ({
  params,
}: EditorProjectIdPageProps) => {
  const {
    data,
    isLoading,
    isError
  } = useGetProject(params.projectId);

  const data2 = {
    "id": "91f8bf4f-847e-4a1e-a918-ec3518512ca9",
    "name": "Untitled project",
    "userId": "ef2cde80-df97-4b0c-b9c4-91efae72af53",
    "json":"",
    "height": 1200,
    "width": 900,
    "thumbnailUrl": null,
    "isTemplate": null,
    "isPro": null,
    "createdAt": "2024-11-26T04:58:53.031Z",
    "updatedAt": "2024-11-27T05:25:05.526Z"
}

  if (isLoading || !data) {
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

  return <Editor initialData={data2} />
};

export default EditorProjectIdPage;
