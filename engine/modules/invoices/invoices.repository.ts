import { BaseModel } from "@/engine/lib/db/BaseModel";
import { db } from "@/engine/lib/db/mysql.client"; 
import { fail } from "assert";  
import { formatDateShort, toIso } from "@/engine/utils/dates";
 
import { generateTempPassword, uuid } from "../../utils/crypto";
import { hashPassword } from "@/engine/core/security/hash";
import { ValidationError } from "@/engine/core/http/errors"; 
import { sendMail } from "@/engine/lib/mails/send";
import { EmailOptions } from "@/engine/lib/mails/email.types";
import { renderEmailTemplate } from "@/engine/lib/mails/render.template";
import { INVOICE_TEMP } from "@/engine/lib/mails/invoice.temp";
import { DynamicInvoicePdf } from "@/app/components/INVOICE.DOCUMENT";
import { renderToBuffer } from '@react-pdf/renderer';
import { createElement } from 'react';
//import puppeteer from "puppeteer";
import { pdfHtml } from "@/engine/lib/other-templates/invoice";
interface LineItem {
  product:string;
    quantity:number;
    unit:string;
    price:number;
    vat:number;
}

interface DynamicPdfProps {
  title: string;
  items: LineItem[]; // Unknown length coming from Server/DB
  details: {
    customerName: string;
    customerAddress: string;
    customerPhone: string;
    dueDate: string;
    paymentStatus: string;
    commentaryNotes: string; 
    invoice_no: string;
  }
}

class InvoicesRepository extends BaseModel<any> {
  protected table = "invoices";

 
  async generatePDFData(data:{uid:string}) {
    const [invoiceData] = await db.query("SELECT * FROM invoices WHERE uuid = ?", [data.uid]);
     
    const items = JSON.parse( invoiceData.invoice_data); 
 
    const newArray:LineItem[] = items.map((element:any, i:number) => {
      return {
        product:element.product,
        quantity:Number(element.quantity),
        unit:Number(element.unit),
        price:Number(element.price),
        vat:Number(element.vat),
      }
     
    });
 
    const props:DynamicPdfProps = {
      title: "Customer Invoice",
      items: newArray,
      details: { 
        customerName: invoiceData.customer_name,
        customerAddress: invoiceData.customer_address,
        customerPhone: invoiceData.customer_phone,
        dueDate: formatDateShort(new Date(invoiceData.invoice_due_date)),
        paymentStatus: invoiceData.payment_status,
        commentaryNotes: `${invoiceData.message}`,
        invoice_no: invoiceData.invoice_no
      }


    };
 
    const pdfBuffer = await renderToBuffer(
      createElement(DynamicInvoicePdf, {
        title:`Invoice #${props.details.invoice_no}`,
        items:props.items,
        details:props.details
      })
    );

        
  

    return pdfBuffer;
    
  }

  async insert(data:{form:any, company_id?:string, user_id?:number|string}) { 
    
    const result = await db.insert(
      `${this.table}  `, {
          uuid: data.form.uid,
          invoice_no: data.form.invoiceNumber,
          total: data.form.subtotal,
          invoice_date: data.form.dueDate,
          invoice_due_date: data.form.dueDate,
          message: data.form.message,
          invoice_data: JSON.stringify(data.form.items), 
          payment_status: 'pending',
          invoice_status: 'draft',
          created_by: data.user_id, 
          invoice_discount: data.form.discount,
         // customer_id, customer_name, customer_email, customer_phone
          company_id:data.company_id, 
      }
    );
    const insertId = (result as any).insertId;
    return data.form.uid;
  }

  async fetchInvoices(company_id?:string, page = 1, limit = 10) {
    
    const offset = ( (page - 1)==1?1: (page - 1) ) * limit;

  const rows = await db.query(
    `SELECT * 
     FROM invoices 
     where  company_id = '${company_id}'
     ORDER BY id DESC  
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  const [countRow] = await db.query(
    `SELECT COUNT(*) as total FROM invoices where company_id = '${company_id}'`
  );

  const output  = {
    data: rows,
    total: countRow.total,
    page,
    limit,
    totalPages: Math.ceil(countRow.total / limit),
  };
 

  return output;
}

async fetchCustomers(company_id?:string, page = 1, limit = 10) {
    
    const offset = ( (page - 1)==1?1: (page - 1) ) * limit;

  const rows = await db.query(
    `SELECT * 
     FROM customers 
     where  company_id = '${company_id}'
     ORDER BY id ASC 
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  const [countRow] = await db.query(
    `SELECT COUNT(*) as total FROM customers where company_id = '${company_id}'`
  );

  const output  = {
    data: rows,
    total: countRow.total,
    page,
    limit,
    totalPages: Math.ceil(countRow.total / limit),
  };
 

  return output;
}



  async fetchSingleInvoice(data:{company_id?:string, uid?:string}) {
    
    const pdfData = await this.generatePDFData({uid:data.uid ?? ''});
    const pdfBuffer = Buffer.from(pdfData);
    //send the admin an email
    return pdfBuffer;   

  }
  
  async saveCustomer(data:{form:any, company_id?:string, user_id?:number|string}) {
    const save = await db.update(this.table, {
      customer_name:data.form.name,
      customer_email: data.form.email,
      customer_phone: data.form.phone,
      invoice_status: 'sent',
      customer_address: data.form.address
    },
    "uuid = ? and company_id = ?", [data.form.uid, data.company_id]
    ); 
    //save the customer 
    await db.insert('customers', {
        name:data.form.name,
        email:data.form.email,
        phone:data.form.phone,
        address:data.form.address,
        company_id:data.company_id
    });

    //sender
    const [sender] = await db.query("SELECT * FROM users WHERE id = ?", [data.user_id]);
    
    const pdfData = await this.generatePDFData({uid:data.form.uid});
    const pdfBuffer = Buffer.from(pdfData);
    //send the admin an email
    const body = await INVOICE_TEMP(data.form.name.split(" ")[0], sender.name);
    const options: EmailOptions = { 
      to: data.form.email,
      subject: "Invoice Received",
      html: renderEmailTemplate(body, { title: "Invoice Created at Mizizi POS" }),
      attachments: [
        {
          filename:`invoice.pdf`, 
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };
    if (process.env.NODE_ENV == "production") {
      sendMail(options);
    }

    return {
      message: "Invoice successfully created.",
      pass: process.env.NODE_ENV == "production" ? null : sender,
    };
 
  }
  async deleteCustomer(id:number) {
    const del = await db.delete("customers", "id=?", [id]);
    if (del) return "Customer successfully deleted";
    throw new Error("Could not delete customer");
  }
  
  




}

export const invoicesRepository = new InvoicesRepository();
