import { posController } from "@/engine/modules/pos/pos.controller";
import { fail, ok } from "@/engine/core/http/responses";
import { requireAuth, requireAdmin } from "@/engine/core/http/auth-guard";

export async function GET(req: Request) {
  try {
    const auth = requireAuth(req);
    requireAdmin('Admin');
    const feedback = await posController.AccountBalance(req); 
    return (feedback); 
  } catch (e) {
    return fail(e);
  }
}
