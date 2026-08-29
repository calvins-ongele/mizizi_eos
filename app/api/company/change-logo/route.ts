import { coController } from "@/engine/modules/company/company.controller";
import { fail, ok } from "@/engine/core/http/responses";

export async function POST(req: Request) {
  try {
    const feedback = await coController.changeLogo(req); 
    return (feedback); 
  } catch (e) {
    return fail(e);
  }
}
