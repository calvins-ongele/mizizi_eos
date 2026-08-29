import { expensesController } from "@/engine/modules/expenses/expenses.controller";
import { fail, ok } from "@/engine/core/http/responses";

export async function POST(req: Request) {
  try {
    const feedback = await expensesController.createExpense(req); 
    return (feedback); 
  } catch (e) {
    return fail(e);
  }
}
