import { productsController } from "@/engine/modules/products/products.controller";
import { fail } from "@/engine/core/http/responses";

export async function GET(req: Request) {
  try {
    const categs = await productsController.getCategories(req);
     
    return categs;
  } catch (e) {
    return fail(e);
  }
}
