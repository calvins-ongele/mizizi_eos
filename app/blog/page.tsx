import Link from "next/link";

export type Post = {
  id: number;
  title: string;
  image?: string;
  slug: string;
  excerpt?: string;
  body: string;
  created_at: string;
};

export const metadata = {
  title: "Blog",
};

export default async function BlogPage() {
  const res = await fetch(`${process.env.APP_URL}/api/posts/public`, {
    cache: "no-store",
  });

  const { data } = await res.json();
  

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold">Blog Posts</h1>

      {data?.length === 0 && <p>No posts yet.</p>}

      {data?.map((post: Post) => (
        <article key={post.id} className="border-b pb-4">
          <h2 className="text-xl font-semibold">
            <Link
              href={`/blog/${post.slug}`}
              className="hover:underline text-blue-600" >
              {post.title}
            </Link>
          </h2>

          {post.excerpt && <p className="text-gray-600 mt-1">{post.excerpt}</p>}

          <p className="text-sm text-gray-400 mt-1">
            {new Date(post.created_at).toDateString()}
          </p>
        </article>
      ))}
























































    </div>
  );
}
