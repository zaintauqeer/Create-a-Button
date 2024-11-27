import React from 'react'
import { Editor } from "@/features/editor/components/editor";

export default function EditorPage() {
    const data = {
        "id": "",
        "name": "",
        "json":"",
        "height": 1200,
        "width": 900,
        "thumbnailUrl": null,
        "isTemplate": null,
        "isPro": null,
        "createdAt": "2024-11-26T04:58:53.031Z",
        "updatedAt": "2024-11-27T05:25:05.526Z"
    }
  return (
    <Editor initialData={data}/>
  )
}
