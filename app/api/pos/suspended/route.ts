import { posController } from "@/engine/modules/pos/pos.controller";
import { fail, ok } from "@/engine/core/http/responses";

export async function GET(req: Request) {
  try {
    const feedback = await posController.getSuspendCart(req); 
    return (feedback); 
  } catch (e) {
    return fail(e);
  }
}
