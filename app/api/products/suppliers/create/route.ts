import { productsController } from "@/engine/modules/products/products.controller";
import { fail, ok } from "@/engine/core/http/responses";

export async function POST(req: Request) {
  try {
    const supplies = await productsController.addSupplier(req); 
    return (supplies); 
  } catch (e) {
    return fail(e);
  }
}
