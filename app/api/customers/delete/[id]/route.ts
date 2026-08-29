import { requireAdmin, requireAuth } from "@/engine/core/http/auth-guard";
import { ok, fail } from "@/engine/core/http/responses";
import { getParams } from "@/engine/core/http/route";
import { parseId } from "@/engine/core/http/params";
import { invoicesController } from "@/engine/modules/invoices/invoices.controller";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    //const { id } = await params; //
    const { id } = await getParams(params);

    const auth = await requireAuth(req);
    const customerId = parseId(id); 
    //TODO: check if user is admin
    requireAdmin(auth.role || '');

    const post = await invoicesController.deleteCustomer(customerId);

     

    return ok(post);
  } catch (e) {
    return fail(e);
  }
}
