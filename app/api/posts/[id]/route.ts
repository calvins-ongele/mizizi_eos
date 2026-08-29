import { postRepository } from "@/engine/modules/posts/post.repository";
import { requireAuth } from "@/engine/core/http/auth-guard";
import { ok, fail } from "@/engine/core/http/responses";
import { getParams } from "@/engine/core/http/route";
import { parseId } from "@/engine/core/http/params";



export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    //const { id } = await params; //
    const { id } = await getParams(params);

    const auth = await requireAuth(req);
    const postId = parseId(id);

    const post = await postRepository.find(postId);

    if (!post || post.user_id !== auth.id) {
      return fail(new Error("Post not found or access denied"));
    }

    return ok(post);
  } catch (e) {
    return fail(e);
  }
}
