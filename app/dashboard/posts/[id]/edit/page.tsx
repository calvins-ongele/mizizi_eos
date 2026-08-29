import { getCurrentUser } from "@/app/lib/getCurrentUser";
import { EditPostForm } from "./EditPostForm";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return <p>Unauthorized</p>;
  let newparams = await params; 

  const res = await fetch(`${process.env.APP_URL}/api/posts/${newparams.id}`, {
    cache: "no-store",
    headers: { cookie: `token=${user.token ?? ""}` },
  });

  const post = (await res.json())?.data;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Edit Post</h1>
      <EditPostForm post={post} />
    </div>
  );
}
