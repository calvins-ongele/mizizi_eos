import { postRepository } from "@/engine/modules/posts/post.repository";
import { ok, fail } from "@/engine/core/http/responses";

export async function GET() {
  try {
    const posts = await postRepository.publicList();
    return ok(posts);
  } catch (e) {
    return fail(e);
  }
}
