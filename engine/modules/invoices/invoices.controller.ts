import { requireAuth } from "@/engine/core/http/auth-guard";
import { valid } from "@/engine/core/http/validator";
import { ok, created, fail, blob } from "@/engine/core/http/responses"; 
import { invoicesRepository } from "./invoices.repository";
import { invoicesService } from "./invoices.service";

export const invoicesController = {
  async saveDraft(req: Request) {
    const auth = await requireAuth(req);
    const company_id = auth.user_company_id;
    const form = await req.json();
    const subtotal = Number(form.subtotal);

    if (!valid.string(form.invoiceNumber)) return fail(new Error("Invalid invoice number"));
    if (!valid.string(form.status)) return fail(new Error("Invalid status"));
    if (!valid.string(form.dueDate)) return fail(new Error("Invalid due date")); 
    //if (!isNaN( form.subtotal )) return fail(new Error("Invalid sub total" ));

    if (form.message != "") 
        if (!valid.string(form.message)) return fail(new Error("Invalid message"));

    const data = await invoicesService.saveDraft(
      {form,company_id, user_id:auth.id }
    );
    return created(data);
  },

  async fetchInvoices(req: Request, page=1, limit=10) { 
    const auth = await requireAuth(req);
    const company_id = auth.user_company_id;
    const data = await invoicesRepository.fetchInvoices( auth.user_company_id ??'', page, limit );

    return ok(data);

  },
  async fetchCustomers(req: Request, page=1, limit=10) { 
    const auth = await requireAuth(req);
    const company_id = auth.user_company_id;
    const data = await invoicesRepository.fetchCustomers( auth.user_company_id ??'', page, limit );

    return ok(data);

  },

  async saveCustomer(req: Request) {
     
    const auth = await requireAuth(req);
    const company_id = auth.user_company_id;
    const form = await req.json();
    const data = await invoicesRepository.saveCustomer( {form,  company_id, user_id: auth.id} );

    return ok(data);
  },
  async fetchSingleInvoice(req: Request, uid = '') {
    
    const auth = await requireAuth(req);
    const company_id = auth.user_company_id;
    const data = await invoicesRepository.fetchSingleInvoice({ company_id:auth.user_company_id ??'', uid:uid??''} );

    return blob(data);

  },
  async deleteCustomer(id:number) { 
    const deletex = await invoicesRepository.deleteCustomer(id);
    return ok(deletex);
  }
 


















};
