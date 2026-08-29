import { productsController } from "@/engine/modules/products/products.controller";
import { fail, ok } from "@/engine/core/http/responses";

export async function POST(req: Request) {
  try {
    const addcateg = await productsController.addReturnReason(req); 
    return (addcateg); 
  } catch (e) {
    return fail(e);
  }
}
