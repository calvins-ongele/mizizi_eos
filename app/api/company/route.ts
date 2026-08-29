// app/api/auth/me/route.ts
export const dynamic = 'force-dynamic';
export const revalidate = 0

import { coController } from "@/engine/modules/company/company.controller";
import { fail } from "@/engine/core/http/responses";

export async function GET(req: Request) {
  try {
    return await coController.company(req);
  } catch (e) {
    return fail(e);
  }
}
