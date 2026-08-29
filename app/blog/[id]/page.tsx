import { notFound } from "next/navigation";
import Image from "next/image";
import { getCompany } from "@/app/lib/getCompany";


export async function getPost(id: string) {
  const res = await fetch(
    `${process.env.APP_URL}/api/posts/public/singlepost`,
    {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    }
  );

  if (!res.ok) return null;

  const { data } = await res.json();
  return data;
}


export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [company, post] = await Promise.all([
    getCompany(),
    getPost(id),
  ]);

  if (!post) return {};

  return {
    title: `${post.title} | ${company?.name ?? "Company"}`,
    description: post.excerpt ?? company?.description,
    openGraph: {
      title: post.title,
      images: post.image ? [post.image] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; 
  const post = await getPost(id);
  if (!post) notFound();

  const data = post;

  return (
    <article className="max-w-3xl mx-auto py-10 space-y-4">
      <h1 className="text-3xl font-bold">{data.title}</h1>

      <p className="text-sm text-gray-500">
        {new Date(data.created_at).toDateString()}
      </p>
      
      {post.image && (
          <Image
            src={post.image}
            alt={post.title}
            width={800}
            height={400}
            className="rounded-lg"
          />
        )}

      {/* Rich text body */}
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: data.content }}
      />
    </article>
  );
}
