import { productsController } from "@/engine/modules/products/products.controller";
import { fail } from "@/engine/core/http/responses";

export async function POST(req: Request) {
  try {
    const units = await productsController.getDefinitionsData(req); 
    
    return units;
  } catch (e) {
    return fail(e);
  }
}
