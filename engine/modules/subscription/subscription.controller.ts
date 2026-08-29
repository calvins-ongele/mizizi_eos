import { requireAuth } from "@/engine/core/http/auth-guard";
import { valid } from "@/engine/core/http/validator";
import { ok, created, fail, blob } from "@/engine/core/http/responses"; 
import { subscriptionRepository } from "./subscription.repository";
import { subscriptionService } from "./subscription.services"; 

export const subscriptionController = {
   
   async fetchPlans(req:Request) {
    const auth = await requireAuth(req);
    const plans = await subscriptionRepository.findAllPlans();
    return ok(plans);
   },
   async fetchSubscriptionHistory(req:Request) {
    const auth = await requireAuth(req);
    const history = await subscriptionRepository.findAllhistory(auth.user_company_id || "");
    return ok(history);
   }
















};
