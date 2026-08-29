import { postController } from "@/engine/modules/posts/post.controller";
import { fail } from "@/engine/core/http/responses";

export async function POST(req: Request) {
  try {
    return await postController.update(req);
  } catch (e) {
    return fail(e);
  }
}
