import { productsController } from "@/engine/modules/products/products.controller";
import { fail } from "@/engine/core/http/responses";

export async function POST(req: Request) {
  try {
    const searchData = await productsController.search(req);
 
    return searchData;
  } catch (e) {
    return fail(e);
  }
}
