import { coController } from "@/engine/modules/company/company.controller";
import { fail } from "@/engine/core/http/responses";

export async function POST(req: Request) {
  try {
    return await coController.updateCompany(req);
  } catch (e) {
    return fail(e);
  }
}
