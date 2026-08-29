import { getCurrentUser } from "@/app/lib/getCurrentUser";
import { CreatePostForm } from "../posts/CreatePostForm"; 
import { getCompany } from "@/app/lib/getCompany"; 
import { DeletePostButton } from "../components/DeletePostButton";
const comp = await getCompany();

export const metadata = { title: `Posts | ${comp.name} ` };

export default async function PostsPage() {
  const user = await getCurrentUser();
  if (!user) return <p>Unauthorized</p>;

  const res = await fetch(`${process.env.APP_URL}/api/posts`, {
    cache: "no-store",
    headers: { authorization: `Bearer ${user.token}` },
  });

  const posts = (await res.json())?.data ?? []; 

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">My Posts</h1>

      <div className="border rounded p-4">
        <CreatePostForm />
      </div>

      <div className="space-y-3">
        {posts.length === 0 && <p>No posts yet.</p>}

        {posts.map((p: any) => (
          <div key={p.id} className="border rounded p-3 space-y-2">
            {p.image && (
              <img src={p.image} className="rounded max-h-64 object-cover" />
            )}
            <h3 className="font-semibold">{p.title}</h3>
            <div
              className="prose text-gray-700"
              dangerouslySetInnerHTML={{ __html: p.content }}
            /> 
            <a href={`/dashboard/posts/${p.id}/edit`}
              className="text-blue-600 text-sm"
            >
              Edit
            </a>
            <DeletePostButton id={p.id} />

          </div>
        ))}
      </div>
    </div>
  );
}
