import { productsController } from "@/engine/modules/products/products.controller";
import { fail } from "@/engine/core/http/responses";

export async function GET(req: Request) {
  try {
    const units = await productsController.getUnits(req); 
    
    return units;
  } catch (e) {
    return fail(e);
  }
}
