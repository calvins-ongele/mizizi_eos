"use client";

import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";
import Code from "@tiptap/extension-code";
import HardBreak from "@tiptap/extension-hard-break";

function capitalizeFirstLetter(str: string): string {
  if (!str) {
    return ""; // Handle empty or null strings
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function CreatePostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
   const editor = useEditor({
    extensions: [
      StarterKit ,
      Bold,
      Italic,
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      Code,
      HardBreak,
    ],
    content: "",
    immediatelyRender: false,
  });
   if (!mounted || !editor) {
    return <div className="border rounded p-2 text-sm text-gray-500">
      Loading editor…
    </div>;
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setStatus("saving...");
    const form = new FormData(e.target);
    form.set('title', title);
    //form.set('content', content);
    form.set("content", editor?.getHTML() || "");

    const res = await fetch(`/api/posts`, {
      credentials: "include", 
      method: "POST",
      body: form, //  JSON.stringify({ title, content }),
    });

    const msg = await res.json();

    if (!res.ok) {
      let title = '';
      let body = '';
      if (msg.details) {
        title = msg.details[0].field && capitalizeFirstLetter(msg.details[0].field ?? "");
        body = msg.details[0].message && (msg.details[0].message ?? "");
      }
      setStatus(`${msg.message} ${title} ${body} `);
      return;
    }

    setTitle("");
    setContent("");
    setStatus("saved");
    window.location.reload();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {status && <p className="text-sm text-red-600">{status}</p>}

      <input
        className="border rounded w-full px-3 py-2"
        placeholder="Post title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      
      <div className="border rounded p-2">
        <h6>Write Something...</h6>
        <div className="flex gap-2 border-b pb-1 text-sm">
  <button onClick={() => editor.chain().focus().toggleBold().run()}>
    Bold
  </button>

  <button onClick={() => editor.chain().focus().toggleItalic().run()}>
    Italic
  </button>

  <button onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}>
    H1
  </button>

  <button onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}>
    H2
  </button>

  <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
    • List
  </button>

  <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
    1. List
  </button>

  <button onClick={() => editor.chain().focus().toggleBlockquote().run()}>
    “ Quote
  </button>

  <button onClick={() => editor.chain().focus().toggleCode().run()}>
    Code
  </button>
</div>

        <EditorContent editor={editor} />
      </div>

      <input
        type="file"
        className="border rounded w-full px-3 py-2"
        name="image"
        accept="image/*"
      />

      <button className="bg-black text-white px-4 py-2 rounded">
        Create Post
      </button>
    </form>
  );
}
