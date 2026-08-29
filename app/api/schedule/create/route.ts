// app/api/auth/me/route.ts
import { scheduleController } from "@/engine/modules/schedule/schedule.controller";
import { fail } from "@/engine/core/http/responses";

export async function POST(req: Request) {
  try {
    return await scheduleController.insert(req);
  } catch (e) {
    return fail(e);
  }
}
