import React from 'react'
import { Editor } from "@/features/editor/components/editor";

export default function EditorPage() {
    const data = {
        "id": "",
        "name": "Test",
        "json":"",
        "userId": "ef2cde80-df97-4b0c-b9c4-91efae72af53",
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
