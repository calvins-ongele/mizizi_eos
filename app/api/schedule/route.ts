import { scheduleController } from "@/engine/modules/schedule/schedule.controller";
import { fail } from "@/engine/core/http/responses";

export async function GET(req: Request) {
  try {
    return await scheduleController.getSchedules(req);
  } catch (e) {
    return fail(e);
  }
}
