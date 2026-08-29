import { requireAuth } from "@/engine/core/http/auth-guard";
import { valid } from "@/engine/core/http/validator";
import { ok, created, fail, blob, pdf } from "@/engine/core/http/responses";   
import { analyticsService } from "./analytics.service"; 
import { analyticsRepository } from "@/engine/modules/analytics/analytics.repository";

export const analyticsController = {
    

async saveNewVisit(req:Request) {

    const form = await req.json(); 

    const saved = await analyticsRepository.saveNewVisit(form);

    return ok(saved);

}













};
