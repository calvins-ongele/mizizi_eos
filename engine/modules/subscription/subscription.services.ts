import { subscriptionRepository } from "./subscription.repository"; 

export const subscriptionService = {
 
   async suspendCart(data:{carts:any, company_id:string, user_id:number, cartValue:number, customer:Customer}) {
    //return await subscriptionRepository.suspendCart(data);
   }


};

