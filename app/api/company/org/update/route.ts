import { coController } from "@/engine/modules/company/company.controller";
import { fail } from "@/engine/core/http/responses";

export async function PUT(req: Request) {
  try {
    return await coController.updateOrg(req);
  } catch (e) {
    return fail(e);
  }
}
