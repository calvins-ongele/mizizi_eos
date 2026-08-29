import { requireAuth } from "@/engine/core/http/auth-guard";
import { valid } from "@/engine/core/http/validator";
import { ok, created, fail } from "@/engine/core/http/responses"; 
import { scheduleService } from "./schedule.service";
import { scheduleRepository } from "./schedule.repository";

export const scheduleController = {
  async insert(req: Request) {
    const auth = await requireAuth(req);
    const company_id = auth.user_company_id;
    const form = await req.json();

    if (!valid.string(form.title))
      return fail(new Error("Invalid title"));
    if (!valid.string(form.start_time))
      return fail(new Error("Invalid beginning date"));
    if (!valid.string(form.end_time))
      return fail(new Error("Invalid ending date"));
    if (form.notes != "") 
        if (!valid.string(form.notes)) return fail(new Error("Invalid notes"));

    const data = await scheduleService.insert(
      {form,company_id, user_id:auth.id }
    );
    return created(data);
  },

  async getSchedules(req: Request) { 
    const auth = await requireAuth(req);
    const company_id = auth.user_company_id;
    const data = await scheduleRepository.getSchedules( auth.user_company_id ??'' );

    return ok(data);

  }
 


















};
