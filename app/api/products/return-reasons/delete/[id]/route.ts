import { productsRepository } from "@/engine/modules/products/products.repository";
import { requireAuth } from "@/engine/core/http/auth-guard";
import { ok, fail } from "@/engine/core/http/responses";
import { getParams } from "@/engine/core/http/route";
import { parseId } from "@/engine/core/http/params";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    //const { id } = await params; //
    const { id } = await getParams(params);

    const auth = await requireAuth(req);
    const categoryId = parseId(id);
 
    //TODO: check if user is admin

    const post = await productsRepository.deleteReturnReason(categoryId);

     

    return ok(post);
  } catch (e) {
    return fail(e);
  }
}
