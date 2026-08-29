import { BaseModel } from "@/engine/lib/db/BaseModel";
import { db } from "@/engine/lib/db/mysql.client"; 
import { fail } from "assert"; 
import { uuid } from "../../utils/crypto";
import { toIso } from "@/engine/utils/dates";

class ScheduleRepository extends BaseModel<any> {
  protected table = "calendar";

 

  async insert(data:{form:any, company_id?:string, user_id?:number|string}) {
    
    const result = await db.insert(
      `${this.table}  `, {
          start_date: toIso(data.form.start_time),
          end_date: toIso(data.form.end_time),
          status: 'pending',
          title: data.form.title,
          notes: data.form.notes,
          created_by: data.user_id, 
         // customer_id, customer_name, customer_email, customer_phone
          company_id:data.company_id
      }
    );
    const insertId = (result as any).insertId;
    return this.find(insertId);
  }

  async getSchedules( company_id:string ) {
    const schedules = await db.query("SELECT * FROM calendar WHERE company_id = ? AND (status = ? OR status = ? OR end_date < NOW() ) ", [company_id, 'pending', 'in_session']);

    return schedules;
  }
  
  




}

export const scheduleRepository = new ScheduleRepository();
