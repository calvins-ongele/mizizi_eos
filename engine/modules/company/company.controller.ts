import { valid } from "@/engine/core/http/validator";
import { ok, created, fail } from "@/engine/core/http/responses";
import { companySchema, orgUpdateSchema } from "@/engine/core/validation/schemas/company.schema";
import { coService } from "./company.service";
import { noAuth, requireAdmin, requireAuth } from "@/engine/core/http/auth-guard";
import { coRepository } from "./company.repository";
import { posRepository } from "../pos/pos.repository";

export const coController = {
  async company(req:Request) {

    // const authy = noAuth(req);
    // if (!authy) { 
   
    // }

    
    //

    try {
      const auth = await requireAuth(req); 
      const company = await coRepository.getOrg(auth.user_company_id||"");
       return ok({
          id: company?.id,
          name: company?.institution_name,
          email: company?.email,
          logo: "",
          description: company?.address,
        });

    } catch(error) {
        const co = await coRepository.find(1);   
        return ok({
          id: co?.id,
          name: co?.name,
          email: co?.email,
          logo: co?.logo,
          description: co?.description,
        });
    }


  },

  async updateCompany(req: Request) {
    const auth = await requireAuth(req);
    const body = await valid.schema(companySchema, await req.json());

    const user = await coService.updateCompany(Number(auth.id), body);

    return ok({
      id: user?.id,
      name: user?.name,
      email: user?.email,
    });
  },

  async getOrg(req:Request) {
    const auth = await requireAuth(req); 
    const org = await coRepository.getOrg(`${auth.user_company_id}`); 
    return ok(org);
  },

  async updateOrg(req:Request) {
    const auth = await requireAuth(req);
    requireAdmin(auth.role||"");
    //const form = await req.json();
 
    //  
    const form = await valid.schema(orgUpdateSchema, await req.json());
    form.user_role = auth.role;

    await coRepository.updateOrg(form);
    return ok("Updated successfully.");
  },

  async changeLogo(req:Request) { 
    const auth = await requireAuth(req);
    const form = await req.formData(); 
    form.set("company_id", auth.user_company_id??'');

    try {
      requireAdmin(auth.role||"");  
      const saved = await coRepository.changeLogo(form);
      return saved;
    } catch(e) { 
      const saved = await coRepository.changeOrgLogo(form);
      return saved;
    }

  },






};
