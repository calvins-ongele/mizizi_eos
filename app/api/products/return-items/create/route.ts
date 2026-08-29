import { productsController } from "@/engine/modules/products/products.controller";
import { fail, ok } from "@/engine/core/http/responses";

export async function POST(req: Request) {
  try {
    const data = await productsController.returnItems(req); 
    return (data); 
  } catch (e) {
    return fail(e);
  }
}
