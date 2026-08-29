import { posController } from "@/engine/modules/pos/pos.controller";
import { fail, ok } from "@/engine/core/http/responses";

export async function POST(req: Request) {
  try {
    const feedback = await posController.completeSale(req); 
    return (feedback); 
  } catch (e) {
    return fail(e);
  }
}
