import { fail, ok, pdf } from "@/engine/core/http/responses";
import { BaseModel } from "@/engine/lib/db/BaseModel";
import { db } from "@/engine/lib/db/mysql.client";  
import { receiptPdfHtml } from "@/engine/lib/other-templates/receipt";
import { uuid, rand } from "@/engine/utils/crypto";
import { formatDateShort, nowUtc, receiptDate } from "@/engine/utils/dates";
import puppeteer from "puppeteer"; 
//import test from "node:test";

import { DateFilterType, SalesFilterParams, SalesChartData } from '@/engine/types/sales';
import { Products } from "../products/products.types";
import { contentRepository } from "../content/content.repository";
import { ReceiptPrinter } from "@/engine/lib/receipt-printer"; 
 

class PosRepository extends BaseModel<any> {
  protected table = "pos";

  
  async suspendCart(data:{ carts:any, company_id:string, user_id:number, cartValue:number, customer:Customer, printPaused:number }) {
    const uid = uuid();
    const saving = await db.insert(this.table, {
      uid,
      cart_value: data.cartValue,	
      customer_name: data.customer.customerName || '',
      customer_phone:data.customer.customerPhone || '',	
      customer_email: data.customer.customerEmail || '' ,	
      cart_data: JSON.stringify(data.carts),
      company_id: data.company_id,
      created_by: data.user_id
    });

    if (data.printPaused === 1) {

    const randNumber = rand(10_000, 99_000);
    const rctNo = `SAL-${randNumber}`;
    const sale = await db.insert("sales", {
      uuid: uid,	
      receipt_no: rctNo,
      user_id:data.user_id,	
      subtotal:data.cartValue,	
      discount: 0,	
      total: data.cartValue 	,
      company_id:data.company_id,
      status: "pending"
    });

       const company = await db.organizationData({uuid: data.company_id});
       const [user] = await db.query("SELECT * FROM users WHERE id = ?", [data.user_id]);
    
        const sendToPrinter = {
          company_name:company.institution_name||"",
          company_address: company.address||"",
          company_pin: company.pin||"",
          company_tel:company.phone||"",
          receipt_no:rctNo,
          date: receiptDate(),
          customer_name: data.customer.customerName || 'Walk-in',
          customer_phone: data.customer.customerPhone,
          subtotal:(data.cartValue||0) - 0,
          tax: 0,
          total: data.cartValue || 0,
          served_by: `${user?.name||''}`,
          amount_received: 0,
          payment_method: 'pending',
          items:data.carts,
          how_to_pay:JSON.parse(company?.assigned_data || "{}") 

          
        };
        try {
        const receiptPrinter = new ReceiptPrinter();
        receiptPrinter.print(sendToPrinter);

        return "OK";
        } catch(e) {
          return "Error";
        }


    }

    return saving; 
  }

  async SaveSale(data:{carts:any, company_id:string, user_id:number, cartValue:number, customer:Customer, discount?:number}) {
    // save cart 
 
    const uid = uuid();
    const saving = await db.insert(this.table, {
      uid,
      cart_value: data.cartValue,	
      customer_name: data.customer.customerName || '',
      customer_phone:data.customer.customerPhone || '',	
      customer_email: data.customer.customerEmail || '' ,	
      cart_data: JSON.stringify(data.carts),
      company_id: data.company_id,
      created_by: data.user_id
    });

    const randNumber = rand(10_000, 99_000);
    const sale = await db.insert("sales", {
      uuid: uid,	
      receipt_no: `SAL-${randNumber}`,
      user_id:data.user_id,	
      subtotal:data.cartValue,	
      discount:data?.discount || 0,	
      total: data.cartValue - (data?.discount || 0)	,
      company_id:data.company_id,
      status: "pending"
    });

    const [company] = await db.query("SELECT * FROM organizations WHERE uuid=?", [data.company_id]);
    const compdata:OrganizationType = company;
    const paydata = JSON.parse(company.assigned_data);

    // reduce qty
    return {
      receipt_no: `SAL-${randNumber}`,
      uid,
      sale_id:sale.id,
      amount:data.cartValue - (data?.discount || 0),
      paybill: paydata?.paybill,
      account_no: paydata.account_no

    } 
  }

  async Accountbalance(companyId:string) {
    const org:OrganizationType = await db.organizationData({uuid: companyId});  
    const assigned_data:AssignedData = JSON.parse( String(org?.assigned_data || "[]") );
    
    const send = await fetch(`${process.env.POS_MIZIZI_API}/request-balance`, {
      method:"POST",
      body:JSON.stringify({
        account_uid:org.uuid,
        account: assigned_data.account_no,
        user:org.mizizi_user_id
      })
    });
    const result = await send.json();
  

    if (result.error) {
        return fail (new Error(result?.msg??"An error occurred"));
    }

    return ok({message:result.msg ?? 0, login_id:result.login_id});

  }
  async sendSTK(data:{uid:string, mode_of_payment:'Mpesa_STK'|'Cash'|'Mpesa_Paybill'|'Card', cartValue:number, sale_id:number, receipt_no:string ,
    customer_phone?:string, customer_name?:string, customer_email?:string, cash_amount?:string|number, phone:string|number   }) {

    try {

    const [cart] = await db.query(`SELECT ${this.table}.*, sales.id as sale_id,
    users.name as user_name, institution_name, mizizi_user_id, assigned_data
      FROM ${this.table} 
    LEFT JOIN sales ON sales.uuid = ${this.table}.uid 
    LEFT JOIN users ON sales.user_id = users.id
    LEFT JOIN organizations ON sales.company_id = organizations.uuid
    WHERE uid = ?`,[data.uid]);
 
    
    const items = JSON.parse(cart.cart_data);
    const company_id = cart.company_id;
    const total = Number(cart.total || data.cartValue);
    const institution_name = cart.institution_name||"";
    const user = Number(cart.mizizi_user_id || 0);
    const assigned_data = JSON.parse(cart.assigned_data || "[]");

    
    
    const send = await fetch(`${process.env.POS_MIZIZI_API}/request-deposit`, {
      method:"POST",
      body:JSON.stringify({
        amount: Math.ceil(total),
        phone: data.phone,
        account: assigned_data?.account_no || data?.sale_id,
        org_name: institution_name,
        user
      })
    });
  
    const result = await send.json();
    console.log("RESULT::::::::", result);
    

    if (result.error == 'true') {
      return fail(new Error(result.msg));
    }
    return ok({msg:result.msg, ordernumber: result.ordernumber||""});
    } catch(e) {
      return fail(new Error("Something went while sending STK push."));
    }
  }

  async completeSale(data:{uid:string, mode_of_payment:'Mpesa_STK'|'Cash'|'Mpesa_Paybill'|'Card', cartValue:number, sale_id:number, receipt_no:string ,
    customer_phone?:string, customer_name?:string, customer_email?:string, cash_amount?:string|number   }) {
    const [cart] = await db.query(`SELECT ${this.table}.*, sales.id as sale_id,
      users.name as user_name
       FROM ${this.table} 
      LEFT JOIN sales ON sales.uuid = ${this.table}.uid 
      LEFT JOIN users ON sales.user_id = users.id
      WHERE uid = ?`,[data.uid]);
    // [{"barcode":"BC-BLC-50","product_name":"Fanta Blackcurrent 500ml","price":80,"available":67,"qty":1}]
    const items = JSON.parse(cart.cart_data);
    const company_id = cart.company_id;
    let [company] = await db.query("SELECT * FROM organizations WHERE uuid = ?", [company_id]);
    if (!company) {
      company = {
          institution_name: "Mizizi Classifieds"
      }
    }
    let receiptBody = ""; 
 

    //items.forEach(async(item:any, i:number) => { 
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const [product] = await db.query("SELECT * FROM product_definitions WHERE barcode = ? AND product_company_id = ?", [item.barcode, company_id]); 

      if (product) { 
 
      await db.insert("stock_movements", { 
          uuid:uuid(),
          product_definition_id:product.id,
          quantity:Number(`-${item.qty || 0}`),
          type:'sale',
          reference_type:"Sale",
          reference_id:15,
          user_id:cart.created_by||1,
      } ); 

      await db.insert("sale_items", {
        sale_id:cart.sale_id,	
        product_definition_id	:product.id,
        quantity:	Number(`${item.qty || 0}`),
        selling_price:item.price||0,	
        total:	(Number(`${item.qty || 1}`) * Number(item.price||1) )

      });  
    }

 
      
   // });
  }

    //payments
    await db.insert("payments", {
      uuid: uuid(),	
      sale_id:data.sale_id,	
      method:data.mode_of_payment,	
      amount:data.cartValue,	
      reference:"Sale"	,
      status:'confirmed',
      amount_received: data.cash_amount
    });
    db.update("sales", {status:'paid'}, "uuid = ?", [data.uid]);

    const tax = (data.cartValue||1) * 16 / 116; // 0.16 * (data.cartValue||0);
    let html = receiptPdfHtml().replace("{{body}}", receiptBody).replaceAll("{{invoice_no}}", data.receipt_no )
    .replaceAll("{{customer_name}}", data.customer_name||'Customer')
    .replace("{{customer_address}}", '')
    .replace("{{customer_phone}}", data.customer_phone||'')
    .replace("{{due_date}}", formatDateShort(nowUtc()))
    .replace("{{payment_status}}", "Paid")
    .replace("{{comentary_notes}}", ``)
    .replace("{{subtotal}}", String(data.cartValue||0) )
    .replace("{{grandtotal}}",  String(data.cartValue||0) )
    .replace("{{company_name}}", company.institution_name||"")
    .replace("{{tax}}", tax.toFixed(2) )
    .replace("{{served_by}}", `${cart?.user_name||''}` ); 
    

    
    const sendToPrinter = {
      company_name:company.institution_name||"",
      company_address: company.address||"",
      company_pin: company.pin||"",
      company_tel:company.phone||"",
      receipt_no:data.receipt_no,
      date: receiptDate(),
      customer_name: data.customer_name || 'Walk-in',
      customer_phone: data.customer_phone,
      subtotal:(data.cartValue||0) - 0,
      tax: tax || 0,
      total: data.cartValue || 0,
      served_by: `${cart?.user_name||''}`,
      amount_received: Number(data.cash_amount || 0),
      payment_method: data.mode_of_payment,
      items,

      
    };
    try {
      const receiptPrinter = new ReceiptPrinter();  
      const printerResult = await receiptPrinter.print(sendToPrinter);
      return ok(printerResult);
    } catch(e) {
      try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage(); 
        await page.setContent(html); 
        const pdfBuffer = await page.pdf({
          format: 'A4',
          printBackground: true
        }); 
        await browser.close(); 
        return pdf(pdfBuffer, "Receipt");
      } catch(error) {
        return fail(error);
      } 
      return fail(e);
    }


    


  }

  async lastSlip(data:{user_id:number|string, company_id?:string, uid?:""}) {

    const muid = `${data.uid || ''}`;
    let cart;
    if (muid.length > 0) {
      const [cart1] = await db.query(`SELECT ${this.table}.*, sales.id as sale_id,
      users.name as user_name, receipt_no
      FROM ${this.table} 
      LEFT JOIN sales ON sales.uuid = ${this.table}.uid 
      LEFT JOIN users ON sales.user_id = users.id
      WHERE sales.uuid = ? AND sales.status = 'paid'
      order by pos.id desc limit 1`,[muid]);
      console.log("CART1::::::", cart1);
      cart = cart1;
    } else {
      const [cart1] = await db.query(`SELECT ${this.table}.*, sales.id as sale_id,
      users.name as user_name, receipt_no
      FROM ${this.table} 
      LEFT JOIN sales ON sales.uuid = ${this.table}.uid 
      LEFT JOIN users ON sales.user_id = users.id
      WHERE sales.status = 'paid'
      order by pos.id desc limit 1`,[]);
      console.log("CART1 else::::::", cart1);
      cart  = cart1;
    }
 

    const [payment] = await db.query('SELECT * FROM payments WHERE sale_id = ? limit 1', [cart.sale_id]);
    
    

      if (!cart) {
        return fail(new Error("There's no slip to print"));
      }
    // [{"barcode":"BC-BLC-50","product_name":"Fanta Blackcurrent 500ml","price":80,"available":67,"qty":1}]
    const items = JSON.parse(cart.cart_data);
    const company_id = cart.company_id;
    let [company] = await db.query("SELECT * FROM organizations WHERE uuid = ?", [company_id]);
    if (!company) {
      company = {
          institution_name: "Mizizi Classifieds"
      }
    }
    let receiptBody = ""; 
 

    //items.forEach(async(item:any, i:number) => { 
    let cartValue = 0;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      cartValue += Number(item.price || 1) * Number(item.qty || 1);

      const [product] = await db.query("SELECT * FROM product_definitions WHERE barcode = ? AND product_company_id = ?", [item.barcode, company_id]); 

      if (product) { 
 
      await db.insert("stock_movements", { 
          uuid:uuid(),
          product_definition_id:product.id,
          quantity:Number(`-${item.qty || 0}`),
          type:'Sale',
          reference_type:"Sale",
          reference_id:15,
          user_id:cart.created_by||1,
      } ); 

      await db.insert("sale_items", {
        sale_id:cart.sale_id,	
        product_definition_id	:product.id,
        quantity:	Number(`${item.qty || 0}`),
        selling_price:item.price||0,	
        total:	(Number(`${item.qty || 1}`) * Number(item.price||1) )

      }); 
      const rowVal = Number(item.price||1) * Number(item.qty||1);

      // const j = i + 1; 
      // receiptBody +=` 
      //     <div class="row mb-2 mb-sm-0 py-25 bgc-default-l4">
      //         <div class="d-none d-sm-block col-md-1">${j}</div>
      //         <div class="col-md-3">${item.product_name}</div>
      //         <div class="d-none d-sm-block col-md-2">${item.qty}  </div>
      //         <div class="d-none d-sm-block col-md-2">${product.size} </div>
      //         <div class="d-none d-sm-block col-md-2 text-95">KES ${item.price} </div>
      //         <div class="col-md-2 text-secondary-d2">KES ${rowVal.toFixed(2)}</div>
      //     </div>
      // `; 
    }
      
   // });
  }

   

    const tax = 0.16 * (cartValue||0);
    // let html = receiptPdfHtml().replace("{{body}}", receiptBody).replaceAll("{{invoice_no}}", cart.receipt_no||'' )
    // .replaceAll("{{customer_name}}", cart.customer_name||'Customer')
    // .replace("{{customer_address}}", '')
    // .replace("{{customer_phone}}", cart.customer_phone||'')
    // .replace("{{due_date}}", formatDateShort(nowUtc()))
    // .replace("{{payment_status}}", "Paid")
    // .replace("{{comentary_notes}}", ``)
    // .replace("{{subtotal}}", String(cartValue||0) )
    // .replace("{{grandtotal}}",  String(cartValue||0) )
    // .replace("{{company_name}}", company.institution_name||"")
    // .replace("{{tax}}", tax.toFixed(2) )
    // .replace("{{served_by}}", `${cart?.user_name||''}` );

    // const browser = await puppeteer.launch();
    // const page = await browser.newPage(); 
    // await page.setContent(html); 
    // const pdfBuffer = await page.pdf({
    //   format: 'A4',
    //   printBackground: true
    // });

    // await browser.close(); 

    // return pdf(pdfBuffer);\

    
    const sendToPrinter = {
      company_name:company.institution_name||"",
      company_address: company.address||"",
      company_pin: company.pin||"",
      company_tel:company.phone||"",
      receipt_no:cart.receipt_no,
      date: receiptDate(),
      customer_name: cart.customer_name || 'Walk-in',
      customer_phone: cart.customer_phone,
      subtotal:(cartValue||0) - 0,
      tax: tax || 0,
      total: cartValue || 0,
      served_by: `${cart?.user_name||''}`,
      amount_received: Number(payment.amount_received || 0),
      payment_method: payment.method,
      items,

      
    };
    try {
    const receiptPrinter = new ReceiptPrinter();
    receiptPrinter.print(sendToPrinter);

    return "OK";
    } catch(e) {
      return "Error";
    }

  }

  async getSuspended(company_id:string, single = false, uid = '') {
    let suspended;
    if (single) {
      suspended = await db.query(`SELECT * FROM ${this.table}
      WHERE 
        created_at >= CURRENT_DATE - INTERVAL 1 WEEK
        AND company_id = '${company_id}' AND uid = ?
        `, [uid]); 
    } else {
    suspended = await db.query(`SELECT 
      ${this.table}.*,
      users.name as created_by_name
      FROM ${this.table}
      LEFT JOIN users ON ${this.table}.created_by = users.id
      WHERE 
        ${this.table}.created_at >= CURRENT_DATE - INTERVAL 1 WEEK
        AND ${this.table}.company_id = '${company_id}' limit 100
        `); 
    }
    return suspended;
  }

  
  async fetchSales(company_id?:string, page = 1, limit = 10) {
    
    const offset = ( (page - 1)==1?1: (page - 1) ) * limit;

    const rows = await db.query(
      `SELECT * 
      FROM sales 
      where  company_id = '${company_id}'
      ORDER BY id DESC  
      LIMIT ? OFFSET ? `,
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

  voidSale(data:{user_id:string|number, company_id:string, uid?:string}) {
    db.delete('pos', "uid = ?", [data.uid]);
    db.update('sales', {status:'cancelled'}, "uuid = ?", [data.uid]);
  }

  async printBarcode(form:any) {
    
    const receiptPrinter = new ReceiptPrinter();
    receiptPrinter.printBarcode(form);
  }

  async printLabel(form:any) {
    const printer = new ReceiptPrinter();
    printer.printLabel(form);
  }


 async fetchSalesData(params: SalesFilterParams, company_id:string): Promise<any> {
  const { filter, customFrom, customTo } = params;
  /**expected */
  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX pos controller
  //filter today/7days/30days/90days/custom customFrom 2026-08-08 customTo 2026-08-15

  const now = new Date();
  let startDate = new Date();
  let endDate = new Date();

  // 1. Calculate Date Range
  switch (filter) {
    case 'today':
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case '7days':
      startDate.setDate(now.getDate() - 7);
      break;
    case '30days':
      startDate.setDate(now.getDate() - 30);
      break;
    case '90days':
      startDate.setDate(now.getDate() - 90);
      break;
    case 'custom':
      if (!customFrom || !customTo) {
        throw new Error("Custom date filter requires both 'customFrom' and 'customTo'.");
      }
      startDate = new Date(customFrom);
      endDate = new Date(customTo);
      endDate.setHours(23, 59, 59, 999);
      break;
  }

  // 2. Fetch raw sales from your DB
  // EXAMPLE ORM QUERY (e.g. Prisma/Drizzle):
  /* 
  const rawSales = await db.sales.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: { amount: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });
  */

  //console.log("startdate enddate ", startDate, endDate, company_id); //2026-07-15T00:00:00.000Z 2026-08-30T20:59:59.999Z
  const sales = await db.query(`SELECT *, p.method as method FROM sales 
    LEFT JOIN payments p ON p.sale_id = sales.id
    WHERE ( sales.created_at >= ? AND sales.created_at <= ?) AND company_id = ? AND p.status = 'confirmed' `, [
    startDate, endDate, company_id
  ]);
 
  //return sales;

  // Mock raw data return for demo
  const rawSales = [
    { total: 150, created_at: new Date(startDate.getTime() + 3600000 * 2) },
    { total: 300, created_at: new Date(startDate.getTime() + 3600000 * 10) },
  ];

  // Aggregate & Format Data for Recharts
  const aggregatedMap = new Map<string, { totalSales: number; orderCount: number, avg:number }>();

  const paymentMethodMap = new Map<string, { count: number; totalAmount: number }>();
  sales.forEach((sale:any) => {
    // Format label based on scope (Hourly for 'today', Daily for date ranges)
    const dateLabel = filter === 'today'
      ? sale.created_at.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : sale.created_at.toLocaleDateString([], { month: 'short', day: 'numeric' });

    // Update payment method distribution
    let paymentMethod = sale.method || 'Unknown';
    if (paymentMethod === 'Mpesa_STK') paymentMethod = 'Mpesa';
    if (paymentMethod === 'Mpesa_Paybill') paymentMethod = 'Mpesa';

    const existingPaymentMethod = paymentMethodMap.get(paymentMethod) || { count: 0, totalAmount: 0 };
    paymentMethodMap.set(paymentMethod, {
      count: existingPaymentMethod.count + 1,
      totalAmount: existingPaymentMethod.totalAmount + Number(sale.total || 0),
    });

    const existing = aggregatedMap.get(dateLabel) || { totalSales: 0, orderCount: 0  };
    aggregatedMap.set(dateLabel, {
      totalSales: existing.totalSales + Number(sale.total || 0),
      orderCount: existing.orderCount + 1,
      avg: (existing.totalSales + Number(sale.total || 0)) / (existing.orderCount + 1),
    });
  });

  const salesTrends = Array.from(aggregatedMap.entries()).map(([date, metrics]) => ({
    date,
    totalSales: metrics.totalSales,
    orderCount: metrics.orderCount,
    avg: metrics.avg,
  }));

  return {
    salesTrends,
    paymentMethodData: Array.from(paymentMethodMap.entries()).map(([method, { count, totalAmount }]) => ({
      method,
      count,
      totalAmount
    }))
  };
}
 

  async fetchProducts( company_id?: string, minSign = ">") {
    
    let companyId = `${company_id??''}`;
    if (companyId.length < 1)  companyId = '2e682df5-2de9-445e-937d-34f8db3260fb';

    const products =  await db.query<Products[]>(
      `SELECT
            pd.barcode, pd.id as product_definition_id, 
            CONCAT(pd.name, IF(pd.size IS NOT NULL, CONCAT(' ', pd.size), '')) AS product_name,
            pd.selling_price AS price_per_unit, pd.cost_price as cost_price,
            COALESCE(SUM(sm.quantity), 0) AS quantity_available
        FROM product_definitions pd
        LEFT JOIN stock_movements sm
            ON sm.product_definition_id = pd.id
        WHERE
            sm.quantity ${minSign} 0 AND
            pd.is_active = TRUE and pd.product_company_id = '${companyId}'
            
        GROUP BY
            pd.id,
            pd.barcode,
            pd.name,
            pd.size,
            pd.selling_price
        ORDER BY
            pd.name ASC
            
        LIMIT 20
            `,
      []
    );

    const content = await contentRepository.fetchAll(companyId);

    return {
      products,
      content
    }
  }






}

export const posRepository = new PosRepository();

