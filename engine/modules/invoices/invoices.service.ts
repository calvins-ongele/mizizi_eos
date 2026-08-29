import { invoicesRepository } from "./invoices.repository"; 

export const invoicesService = {

  async saveDraft(data:{form:any, company_id?:string, user_id?:number|string}) { 
    return invoicesRepository.insert(data);
  },
  

   


};

