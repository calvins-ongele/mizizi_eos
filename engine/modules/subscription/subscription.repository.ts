import { BaseModel } from "@/engine/lib/db/BaseModel";
import { db } from "@/engine/lib/db/mysql.client";  

class SubscriptionRepository extends BaseModel<any> {
  protected table: string = '';
  protected plans = "plans";
  protected history = "subscriptions_history";
  protected org = "organizations";


  async findAllPlans() {
    const plans = await db.query(`SELECT * FROM ${this.plans} `, []);
    return plans;
  }
  async findAllhistory(companyId: string) {
    const history = await db.query(`SELECT * FROM ${this.history} WHERE company_id = ? ORDER BY id DESC LIMIT 20 `, [companyId]);
    return history;
  }

 
}

export const subscriptionRepository = new SubscriptionRepository();
