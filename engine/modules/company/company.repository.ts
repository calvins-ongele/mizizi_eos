// engine/modules/users/user.repository.ts
import { BaseModel } from "@/engine/lib/db/BaseModel";
import { Company } from "./company.types";
import { db } from "@/engine/lib/db";  
import { deleteLocalFile, saveUpload } from "@/engine/utils/files";
import { ok } from "@/engine/core/http/responses";

class CoRepository extends BaseModel<Company> {
  protected table = "company";

  findById(id: Number) {
    return this.findBy("id", id);
  }


  async getOrg(company_id:string|null) {
    const [co] = await db.query(`SELECT * FROM organizations WHERE uuid = ?`, [company_id]);
    return co;

  }
/*
{
  id: 1,  
  created_at: 2026-07-02T10:15:56.000Z,
  capacity_allowed: 30,
  status: null,
  license_key: 's',
  license_type: 'paid',
  license_id: 1,
  license_expiry: 2026-07-02T09:14:41.000Z,
  pin: 'PIN001234'
} */
  async updateOrg(form:{uuid:string, customer_name:string,phone:string|number, email:string, institution_name:string, address:string, website:string|null, pin:string|null, user_role?:string }) {
    const upd = await db.update("organizations", {
      customer_name: form.customer_name, phone:form.phone,email:form.email,
      institution_name:form.institution_name, address:form.address, website:form.website,
      pin:form.pin

    }, "uuid = ?", [form.uuid]); 

    if (form.user_role === 'SuperAdmin') {
      db.update("company", {name:form.institution_name}, "id=?", [1]);
    }


  }

  async changeLogo(form:FormData) {
    
      const file = form.get("file") as File | null;

      let image: string | null = null;

      if (file && file.size > 0) {
        image = await saveUpload(file);
      }
      const [fileName] = await db.query('SELECT * FROM company WHERE id = ?', [1]);
      
      await db.update('company', {logo:image}, 'id=?', [1]);

      deleteLocalFile(fileName.logo);
      return ok("Logo Successfully uploaded");
  }
  async changeOrgLogo(form:FormData) {
    
      const file = form.get("file") as File | null;

      let image: string | null = null;

      if (file && file.size > 0) {
        image = await saveUpload(file);
      }

      const [fileName] = await db.query('SELECT * FROM organizations WHERE uuid = ?', [
         form.get("company_id")
      ]);
      await db.update('organizations', {logo:image}, 'uuid=?', [form.get("company_id")]);
      deleteLocalFile(fileName.logo);
      return ok("Logo Successfully uploaded");
  }


}

export const coRepository = new CoRepository();
