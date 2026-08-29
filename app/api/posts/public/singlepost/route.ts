import { postController } from "@/engine/modules/posts/post.controller";
import { ok, fail } from "@/engine/core/http/responses";
import { postRepository } from "@/engine/modules/posts/post.repository";
 
export async function POST(req: Request) {
  try { 
    const form = await req.json();   
    const post = await postRepository.findBySlug(form.id);

    if (!post) return fail(new Error("Post not found") );

    return ok(post);

  } catch (e) {
    return fail(e);
  }
}

 