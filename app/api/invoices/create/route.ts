import { invoicesController } from "@/engine/modules/invoices/invoices.controller";
import { fail, ok } from "@/engine/core/http/responses";

export async function POST(req: Request) {
  try {
    const newDef = await invoicesController.saveDraft(req); 
    return (newDef); 
  } catch (e) {
    return fail(e);
  }
}
