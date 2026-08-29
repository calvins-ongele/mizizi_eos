import { BaseModel } from "@/engine/lib/db/BaseModel";
import { db } from "@/engine/lib/db/mysql.client"; 
import { fail } from "assert"; 
import { uuid } from "../../utils/crypto";

class ExpensesRepository extends BaseModel<any> {
  protected table = "expenses";

  async insert(form:any, user_id:number, company_id:string) {
    const create = await db.insert(this.table, {
      category: form.category,
      description: form.description,
      amount: form.amount,
      status: form.status,
      created_by: user_id,
      company_id

    });

    return "Expense created successfully";
    
  }

  

async fetchExpenses(company_id?:string, page = 1, limit = 10) {
    
    const offset = ( (page - 1)==1?1: (page - 1) ) * limit;

  const rows = await db.query(
    `SELECT * 
     FROM expenses 
     where  company_id = '${company_id}'
     ORDER BY id ASC 
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  const [countRow] = await db.query(
    `SELECT COUNT(*) as total FROM expenses where company_id = '${company_id}'`
  );

  const [totalExpenseVal] = await db.query(`SELECT SUM(amount) as total FROM expenses WHERE company_id = '${company_id}'`);

  const top3 = await db.query(`
    SELECT 
    category,
    SUM(amount) AS total_spent
    FROM 
        expenses
    WHERE 
        created_at >= CURRENT_DATE - INTERVAL 1 MONTH
        AND company_id = '${company_id}'
    GROUP BY 
        category
    ORDER BY 
        total_spent DESC
    LIMIT 3;
`);

  const output  = {
    data: rows,
    total: countRow.total,
    page,
    limit,
    top3,
    totalExpenses: totalExpenseVal.total,
    totalPages: Math.ceil(countRow.total / limit),
  };
 

  return output;
}

 




}

export const expensesRepository = new ExpensesRepository();
