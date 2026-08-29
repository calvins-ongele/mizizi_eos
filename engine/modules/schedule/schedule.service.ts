import { scheduleRepository } from "./schedule.repository"; 

export const scheduleService = {

  async insert(data:{form:any, company_id?:string, user_id?:number|string}) { 
    return scheduleRepository.insert(data);
  },
  

   


};

