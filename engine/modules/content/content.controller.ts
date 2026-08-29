import { requireAuth } from "@/engine/core/http/auth-guard";
import { valid } from "@/engine/core/http/validator";
import { ok, created } from "@/engine/core/http/responses"; 
import { fail } from "assert";
import { parseId } from "@/engine/core/http/params"; 
import { contentRepository } from "./content.repository";
import path from "path";
import fs from 'fs';
import { getExtension, randomFileName } from "@/engine/utils/files";

export const contentController = {
  
    async save(req: Request) { 
        const auth = await requireAuth(req);
        const form = await req.json(); 
        form.company_id = auth.user_company_id??'';
        const resp = await contentRepository.save(form); 
        return ok(resp);
    },

    async saveYTS(req: Request) {
        const auth = await requireAuth(req);
        const form = await req.json(); 
        const save = await contentRepository.saveYTS(form, auth.user_company_id??'');
        return ok(save);
    },
    async saveAchievements(req: Request) {
        const auth = await requireAuth(req);
        const form = await req.json(); 
        const save = await contentRepository.saveAchievements(form, auth.user_company_id??'');
        return ok(save);
    },

    async saveFile(req: Request) { 
        const auth = await requireAuth(req);
        const form = await req.formData();
        const file = form.get('file') as File | null;
        if (!file) {
            return fail(new Error("Invalid image"));
        }

        
        const targetPath = path.join(process.cwd(), 'public/uploads');
        try {
            // Ensure uploads directory exists
            fs.mkdirSync(targetPath, { recursive: true });

            const fileExt = getExtension(file.name);
            const fileName = randomFileName(fileExt);

            const filePath = path.join(targetPath, fileName);

            // Read the file buffer directly instead of using FileReader
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            fs.writeFileSync(filePath, buffer);
            await contentRepository.saveFile(form, `/uploads/${fileName}`, auth.user_company_id??'');  

            return ok({
                message: "Succeeded. File uploaded successfully",
                url:`${filePath}`
            });
        } catch (error) {
            console.error('Error saving file:', error);
            return fail(new Error("An error occurred"))
        }
        
 
    },
    async adminFetch(req: Request, cont_id:string) {
        const auth = await requireAuth(req);
        //const form = await req.json(); 
        const resp = await contentRepository.adminFetch(cont_id, auth.user_company_id); 
        return ok(resp);
    },

    async fetchAll(req: Request, company_id:string) { 
        //const form = await req.json(); 
        let companyId = `${company_id}`;
        if (companyId.length === 0) {
            try {
            const auth = await requireAuth(req); 
            companyId = `${auth.user_company_id}`;
            } catch(e) {
                companyId = '';
            }
        }
        const resp = await contentRepository.fetchAll(companyId); 
        return ok(resp);
    }
     
















};
