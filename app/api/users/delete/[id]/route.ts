import { requireAdmin, requireAuth } from "@/engine/core/http/auth-guard";
import { ok, fail } from "@/engine/core/http/responses";
import { getParams } from "@/engine/core/http/route";
import { parseId } from "@/engine/core/http/params";
import { userController } from "@/engine/modules/users/user.controller";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    //const { id } = await params; //
    const { id } = await getParams(params);

    const auth = await requireAuth(req);
    const userId = parseId(id); 
    //TODO:  
    requireAdmin(auth.role || '');

    const feedback = await userController.deleteUser(userId, auth.user_company_id || '');
    return feedback;
  } catch (e) {
    return fail(e);
  }
}
