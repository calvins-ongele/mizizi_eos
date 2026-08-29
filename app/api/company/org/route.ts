// app/api/auth/me/route.ts
import { coController } from "@/engine/modules/company/company.controller";
import { fail } from "@/engine/core/http/responses";

export async function GET(req: Request) {
  try {
    return await coController.getOrg(req);
  } catch (e) {
    return fail(e);
  }
}
