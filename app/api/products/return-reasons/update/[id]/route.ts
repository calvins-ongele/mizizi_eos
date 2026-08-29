import { productsRepository } from "@/engine/modules/products/products.repository";
import { requireAuth, requireRole } from "@/engine/core/http/auth-guard";
import { ok, fail } from "@/engine/core/http/responses";
import { getParams } from "@/engine/core/http/route";
import { parseId } from "@/engine/core/http/params";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    //const { id } = await params; //
    const { id } = await getParams(params);

    const auth = await requireAuth(req);
    const unitId = parseId(id);
    const reqData = await req.json(); 
 
    //TODO: check if user is admin 
    //requireRole(auth, ["Admin, Manager"]);

    const post = await productsRepository.updateReturnReason(unitId, { name: reqData.name });
    return ok(post);
  } catch (e) {
    return fail(e);
  }
}
