import { postController } from "@/engine/modules/posts/post.controller";
import { fail } from "@/engine/core/http/responses";

export async function GET(req: Request) {
  try { return await postController.index(req); }
  catch (e) { return fail(e); }
}

export async function POST(req: Request) {
  try { return await postController.store(req); }
  catch (e) { return fail(e); }
}
