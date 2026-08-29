import { contentController } from "@/engine/modules/content/content.controller";
import { fail, ok } from "@/engine/core/http/responses";

export async function POST(req: Request) {
  try {
    const feedback = await contentController.saveYTS(req); 
    return (feedback); 
  } catch (e) {
    return fail(e);
  }
}
