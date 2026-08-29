"use client";
import { useConfirmDialog } from "@/app/dashboard/components/ConfirmDialog";

export function DeletePostButton({ id }: { id: number }) { 
    const { confirm, Dialog } = useConfirmDialog();

  async function handleDelete() {
    const ok = await confirm("Delete this post permanently?");
    if (!ok) return; 

    const res = await fetch("/api/posts/delete", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      alert("Delete failed");
      return;
    }

    window.location.reload();
  }

  return (
    <>
      <button
        onClick={handleDelete}
        className="text-red-600 text-sm ml-3"
      >
        Delete
      </button>

      <Dialog />
    </>
  );
}
