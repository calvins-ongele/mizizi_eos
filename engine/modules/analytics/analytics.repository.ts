// engine/modules/analytics.repository.ts
import { BaseModel } from "@/engine/lib/db/BaseModel"; 
import { db } from "@/engine/lib/db"; 
import { UAParser } from "ua-parser-js";   

class AnalyticsRepository extends BaseModel<any> {
  protected table = "visits";
 
  
    async saveNewVisit(form:{path:string|null, referrer:string|null,ua:string|null,cid:string|null, session_id:string|null, ip:string|null, country:string|null }) {
        
        const parser = new UAParser(`${form.ua ?? ""}`); 
        const browser = parser.getBrowser().name ?? 'Chrome';
        const os = parser.getOS().name ?? '';
        const device = parser.getDevice().type || "desktop"; 
        
        const save = await db.insert(this.table, {
            session_id:form.session_id,	
            path:form.path,	
            method:'',	
            ip:form.ip,	
            country:form.country,	
            city:'',	
            browser:browser,	
            os:os,	
            device:device,	
            referrer:form.referrer,	
            user_agent:form.ua
        });

        return (save);
    }


}

export const analyticsRepository = new AnalyticsRepository();
