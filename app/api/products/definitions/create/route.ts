import { productsController } from "@/engine/modules/products/products.controller";
import { fail, ok } from "@/engine/core/http/responses";

export async function POST(req: Request) {
  try {
    const newDef = await productsController.addDefinition(req); 
    return (newDef); 
  } catch (e) {
    return fail(e);
  }
}
