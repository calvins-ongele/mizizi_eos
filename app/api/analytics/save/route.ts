import { analyticsController } from "@/engine/modules/analytics/analytics.controller";
import { fail, ok } from "@/engine/core/http/responses";

export async function POST(req: Request) {
  try {
    const newDef = await analyticsController.saveNewVisit(req); 
    return (newDef); 
  } catch (e) {
    return fail(e);
  }
}
