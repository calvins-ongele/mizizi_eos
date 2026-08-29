import { posRepository } from "./pos.repository"; 

export const posService = {
 
   async suspendCart(data:{carts:any, company_id:string, user_id:number, cartValue:number, customer:Customer, printPaused:number}) {
    return await posRepository.suspendCart(data);
   },
   async SaveSale(data:{carts:any, company_id:string, user_id:number, cartValue:number, customer:Customer}) {
    return await posRepository.SaveSale(data);
   }




};

