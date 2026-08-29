import { invoicesController } from "@/engine/modules/invoices/invoices.controller";
import { fail, ok } from "@/engine/core/http/responses";

export async function POST(req: Request) {
  try {
    const feedback = await invoicesController.saveCustomer(req); 
    return (feedback); 
  } catch (e) {
    return fail(e);
  }
}
