"use client";

import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export function EditPostForm({ post }: { post: any }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const editor = useEditor({
    extensions: [StarterKit],
    content: post.content,
    immediatelyRender: false,
  });

  async function handleSubmit(e: any) {
    e.preventDefault();

    const form = new FormData(e.target); 
    form.set("id", post.id);
    form.set("content", editor?.getHTML() || "");

    await fetch("/api/posts/update", {
      method: "POST",
      credentials: "include",
      body: form,
    });

    window.location.href = "/dashboard/posts";
  }

  if (!mounted || !editor) return <>Loading editor…</>;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        name="title"
        defaultValue={post.title}
        className="border rounded w-full px-3 py-2"
      />

      <div className="border rounded p-2">
        <EditorContent editor={editor} />
      </div>

      <input type="file" name="image" />

      <button className="bg-black text-white px-4 py-2 rounded">
        Save Changes
      </button>
    </form>
  );
}
