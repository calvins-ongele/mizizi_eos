import { productsController } from "@/engine/modules/products/products.controller";
import { fail } from "@/engine/core/http/responses";

export async function GET(req: Request) {
  try {
    const data = await productsController.getReturnReasons(req); 
    
    return data;
  } catch (e) {
    return fail(e);
  }
}
