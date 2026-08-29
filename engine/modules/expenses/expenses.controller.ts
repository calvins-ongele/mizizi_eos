import { requireAuth } from "@/engine/core/http/auth-guard";
import { valid } from "@/engine/core/http/validator";
import { ok, created } from "@/engine/core/http/responses";
import { expensesService } from "./expenses.service"; 
import { fail } from "assert";
import { parseId } from "@/engine/core/http/params";
import { expensesRepository } from "./expenses.repository";
import { allowed } from "./expenses.allowed";

export const expensesController = {
  
    async createExpense(req: Request) {
        const auth = await requireAuth(req);
        const form = await req.json();
        const alloweds = allowed();

        if (!alloweds.includes(form.category)) {
            return fail(new Error("Please select a valid category"));
        }

        if (!valid.isANumber(form.amount)) {
            return fail(new Error("Please enter a valid amount"));
        }
        if (!['paid', 'overdue', 'pending'].includes(form.status)) {
            return fail(new Error("Please select a valid payment status"));
        }
        if (!valid.string(form.description)) {
            return fail(new Error("Please enter a valid string"));
        }

        const feedback = await expensesRepository.insert(form, Number(auth.id||0), auth.user_company_id||'');
        return created(feedback);

    },

    async fetchExpenses(req:Request, page=1, limit=10) {
        const auth = await requireAuth(req);
        const company_id = auth.user_company_id; 
        const expenses = await expensesRepository.fetchExpenses( auth.user_company_id ??'', page, limit );

        return ok(expenses);

    }
















};
