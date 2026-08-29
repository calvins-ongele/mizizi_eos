import { productsController } from "@/engine/modules/products/products.controller";
import { fail } from "@/engine/core/http/responses";

export async function GET(req: Request) {
  try {
    const defs = await productsController.getPurchases(req); 
    return defs;
  } catch (e) {
    return fail(e);
  }
}
