import { postRepository } from "@/engine/modules/posts/post.repository";
import { ok, fail } from "@/engine/core/http/responses"; 
 
export async function GET(
  _: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const param = await params;
    const post = await postRepository.findBySlug(param.id);

    if (!post) return fail(new Error("Post not found") );

    return ok(post);
  } catch (e) {
    return fail(e);
  }
}
