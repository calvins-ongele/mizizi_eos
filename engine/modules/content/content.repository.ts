import { BaseModel } from "@/engine/lib/db/BaseModel";
import { db } from "@/engine/lib/db/mysql.client";  

class ContentRepository extends BaseModel<any> {
  protected table = "content";

 async saveFile(form:FormData, filePath:string, company_id?:string) { 
    
    const saved = await db.query(`SELECT * FROM ${this.table} WHERE cont_id = ? and company_id = ?`, [
        form.get('cont_id'), company_id??''
    ]);

    if (saved[0]) {
        //update
        await db.update(this.table, {
            section_image: filePath,  
        }, "cont_id = ? and company_id = ?", [form.get('cont_id'), company_id ??'' ]);
    } else { //save new        
        await db.insert(this.table, {
            section_image: filePath, 
            cont_id: form.get('cont_id'), 
            company_id: company_id ??''
        } );
    }

    return "Changes saved";
 }

 async saveYTS(form:any, company_id?:string ) {
    let joinedLinks = form.form.map((f:any) => f.value).join(',');    
    
    const saved = await db.query(`SELECT * FROM ${this.table} WHERE cont_id = ? and company_id = ?`, [
        form.cont_id, company_id??''
    ]);

    
    if (saved[0]) {
        //update
        await db.update(this.table, {
            section_text: joinedLinks,  
        }, "cont_id = ? and company_id = ?", [form.cont_id, company_id ??'' ]);
    } else { //save new        
        await db.insert(this.table, {
            section_text: joinedLinks, 
            cont_id: form.cont_id, 
            company_id: company_id ??''
        } );
    }

    return "Changes saved";
 }
 
 async saveAchievements(form:any, company_id?:string ) {
    let joinedValues = form.form.map((f:any) => f.value).join('{{sep}}');    
    let joinedTitles = form.form.map((f:any) => f.label).join('{{sep}}');  
    
    const saved = await db.query(`SELECT * FROM ${this.table} WHERE cont_id = ? and company_id = ?`, [
        form.cont_id, company_id??''
    ]);

    
    if (saved[0]) {
        //update
        await db.update(this.table, {
            section_title: joinedTitles,
            section_text: joinedValues,  
        }, "cont_id = ? and company_id = ?", [form.cont_id, company_id ??'' ]);
    } else { //save new        
        await db.insert(this.table, {
            section_title: joinedTitles,
            section_text: joinedValues, 
            cont_id: form.cont_id, 
            company_id: company_id ??''
        } );
    }

    return "Changes saved";
 }
 
 async save(form:{content:string, cont_id:string, title?:string, company_id?:string}) {
    
    
    const saved = await db.query(`SELECT * FROM ${this.table} WHERE cont_id = ? and company_id = ?`, [
        form.cont_id, form?.company_id??''
    ]);

    if (saved[0]) {
        //update
        await db.update(this.table, {
            section_text: form.content, 
            section_title: form?.title??'' 
        }, "cont_id = ? and company_id = ?", [form.cont_id, form?.company_id ??'' ]);
    } else { //save new        
        await db.insert(this.table, {
            section_text: form.content, 
            cont_id: form.cont_id,
            section_title: form?.title??'',
            company_id: form?.company_id ??''
        } );
    }

    return "Changes saved";
 }

 async adminFetch(contentId:string, company_id?:string) {
    const [saved] = await db.query(`SELECT * FROM ${this.table} WHERE cont_id = ? AND company_id = ? `, [
        contentId, company_id
    ]);

    return saved;
 }

 async fetchAll(company_id?:string) { 
    let companyId = `${company_id??''}`;   
     

    const saves = await db.query(`SELECT * FROM ${this.table} WHERE company_id = ? `, [
        companyId
    ]);
     

   // let output = new Map();
    const sectionLookup:any = {};
    saves.forEach((row:any) => {
        const { section_id, ...data } = row; // Keeps only title, body, img
        sectionLookup[row.cont_id] = data;
    });
    
 
    const [org] = await db.query("SELECT * FROM organizations WHERE uuid = ?", [companyId]);
    sectionLookup['org'] = org; 
    return sectionLookup;

 }


}

export const contentRepository = new ContentRepository();
