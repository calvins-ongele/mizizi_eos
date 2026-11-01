import { requireAdmin, requireAuth } from "@/engine/core/http/auth-guard";
import { valid } from "@/engine/core/http/validator";
import { ok, created, fail, blob, pdf } from "@/engine/core/http/responses"; 
import { posRepository } from "./pos.repository"; 
import { posService } from "./pos.services"; 
import { DateFilterType } from "@/engine/types/sales"; 
import { db } from "@/engine/lib/db/mysql.client";  

export const posController = {
   
    async suspendCart(req:Request) {
        const auth = await requireAuth(req);
        const company_id = auth.user_company_id;
        const user_id = auth.id;
        const form = await req.json();
        const carts = form.cart;
        const customerName = form.name || "";
        const customerEmail = form.email || "";
        const customerPhone = form.phone || "";
        const printPaused = form.printPaused || 0;
        const customer:Customer = {customerName, customerEmail, customerPhone };

        if (!Number(printPaused)) return fail(new Error("Something went wrong"));

        if (customerName != "") {
            if (!valid.string(customerName))  return fail(new Error("Incorrect customer name"));
        }
        if (customerEmail != "") {
            if (!valid.email(customerEmail))  return fail(new Error("Incorrect customer email"));
        }
        if (customerPhone != "") {
            if (!valid.email(customerPhone))  return fail(new Error("Incorrect customer phone"));
        }
        
        let cartValue = 0;
        for(const cart of carts) {
            cartValue += Number(cart.price);
            if (!valid.string(cart.barcode)) return fail(new Error("Incorrect barcode"));
            if (!valid.string(cart.product_name)) return fail(new Error("Incorrect product name"));
            if (!valid.isANumber(cart.price)) return fail(new Error("Incorrect price"));
            if (!valid.isANumber(cart.qty)) return fail(new Error("Incorrect quantity"));
        }

        const saved = await posService.suspendCart({carts, company_id:String(company_id||""), user_id:Number(user_id||0), cartValue, customer, printPaused:Number(printPaused||0) });

        return created(saved);
    },

    async SaveSaleFrontEnd(req:Request, company_id = '') {  
 
        let companyId = company_id;
        try {
            const auth = await requireAuth(req);
            companyId = auth.user_company_id ?? ''; 
        } catch(e) {}

        if (companyId.length < 1)  companyId = '2e682df5-2de9-445e-937d-34f8db3260fb';
        //const org = await db.organizationData({uuid:companyId});
        const user = await db.adminId(companyId);

        const user_id = user;
        const form = await req.json();
        const carts = form.cart;
        const customerName = form.name || "";
        const customerEmail = form.email || "";
        const customerPhone = form.phone || "";
        const customer:Customer = {customerName, customerEmail, customerPhone };

        if (customerName != "") {
            if (!valid.string(customerName))  return fail(new Error("Incorrect customer name"));
        }
        if (customerEmail != "") {
            if (!valid.email(customerEmail))  return fail(new Error("Incorrect customer email"));
        }
        if (customerPhone != "") {
            if (!valid.string(customerPhone))  return fail(new Error("Incorrect customer phone"));
        }
        
        let cartValue = 0;
        for(const cart of carts) {
            try {
            if (!valid.string(cart.barcode)) return fail(new Error("Incorrect barcode"));
            } catch(e) {
                return fail(new Error("Please select an order plan to proceed."));
            }
            if (!valid.string(cart.product_name)) return fail(new Error("Incorrect product name"));
            if (!valid.isANumber(cart.price)) return fail(new Error("Incorrect price"));
            if (!valid.isANumber(cart.qty)) return fail(new Error("Incorrect quantity"));
            cartValue += Number(cart.price || 1) * Number(cart.qty || 1);
        } 

        const saved = await posService.SaveSale({carts, company_id:String(companyId||""), user_id:Number(user_id||0), cartValue, customer});
 
        return created(saved);
    },
    
    async SaveSale(req:Request) {
        const auth = await requireAuth(req);
        const company_id = auth.user_company_id;
        const user_id = auth.id;
        const form = await req.json();
        const carts = form.cart;
        const customerName = form.name || "";
        const customerEmail = form.email || "";
        const customerPhone = form.phone || "";
        const customer:Customer = {customerName, customerEmail, customerPhone };

        if (customerName != "") {
            if (!valid.string(customerName))  return fail(new Error("Incorrect customer name"));
        }
        if (customerEmail != "") {
            if (!valid.email(customerEmail))  return fail(new Error("Incorrect customer email"));
        }
        if (customerPhone != "") {
            if (!valid.string(customerPhone))  return fail(new Error("Incorrect customer phone"));
        }
        
        let cartValue = 0;
        for(const cart of carts) {
            if (!valid.string(cart.barcode)) return fail(new Error("Incorrect barcode"));
            if (!valid.string(cart.product_name)) return fail(new Error("Incorrect product name"));
            if (!valid.isANumber(cart.price)) return fail(new Error("Incorrect price"));
            if (!valid.isANumber(cart.qty)) return fail(new Error("Incorrect quantity"));
            cartValue += Number(cart.price || 1) * Number(cart.qty || 1);
        }

        const saved = await posService.SaveSale({carts, company_id:String(company_id||""), user_id:Number(user_id||0), cartValue, customer});
 
        return created(saved);
    }, //SaveSale

    async getSuspendCart(req:Request, single = false, uid = '') { 
        const auth = await requireAuth(req);
        const company_id = auth.user_company_id;
        const user_id = auth.id;

        const suspended = await posRepository.getSuspended(String(company_id), single, uid);
        return ok(suspended);
    },

    async sendSTK(req:Request) {

        const form = await req.json(); 
        try {
            const auth = await requireAuth(req);
        } catch(e) {
            const dashboard = form?.dashboard ?? '';
            if (dashboard === 'yes') { const auth = await requireAuth(req); }
        }

        if (!valid.string(form.uid)){ return fail(new Error("Something went wrong")) }
        if (!valid.string(form.mode_of_payment)){ return fail(new Error("Something went wrong")) }
        if (!valid.isANumber(form.cartValue)){ return fail(new Error("Something went wrong")) }
        if (!valid.isANumber(form.sale_id)){ return fail(new Error("Something went wrong")) }
        if (!valid.string(form.receipt_no)){ return fail(new Error("Something went wrong")) }
        if (!valid.isANumber(form.cash_amount)){ return fail(new Error("Something went wrong")) }
        if (!valid.string(form.phone)) {return fail(new Error("Phone number is required."))}

        
        const feedback = await posRepository.sendSTK({
            uid: form.uid||'',
            mode_of_payment:form.mode_of_payment||"Cash",
            cartValue: Number(form.cartValue||0), 
            sale_id:Number(form.sale_id||0),
            receipt_no: form.receipt_no || "",
            customer_phone:form.customer_phone||'',
            customer_email:form.customer_email||'',
            customer_name:form.customer_name||'',
            cash_amount: form.cash_amount || '',
            phone: form.phone,
        });
     
       return feedback;
    },

    async completeSale(req:Request, companyid = '') {
 
        
        const form = await req.json(); 
        let company_id = companyid;
        let user_id = 0;
        try {
            const auth = await requireAuth(req);
            company_id = auth.user_company_id ?? '';
            user_id = Number(auth.id ?? 0);
        } catch(e) {
            const dashboard = form?.dashboard ?? '';
            if (dashboard === 'yes') { const auth = await requireAuth(req); }
            
            if (company_id.length < 1)  company_id = '2e682df5-2de9-445e-937d-34f8db3260fb';
            user_id = await db.adminId(company_id);

        }
 

        if (!valid.string(form.uid)){ return fail(new Error("Something went wrong")) }
        if (!valid.string(form.mode_of_payment)){ return fail(new Error("Something went wrong")) }
        if (!valid.isANumber(form.cartValue)){ return fail(new Error("Something went wrong")) }
        if (!valid.isANumber(form.sale_id)){ return fail(new Error("Something went wrong")) }
        if (!valid.string(form.receipt_no)){ return fail(new Error("Something went wrong")) }
        if (!valid.isANumber(form.cash_amount)){ return fail(new Error("Something went wrong")) }

        if (Number(form.cash_amount) < Number(form.cartValue) ) {
            return fail(new Error("Insufficient cash amount"));
        }

        const feedback = await posRepository.completeSale({
            uid: form.uid||'',
            mode_of_payment:form.mode_of_payment||"Cash",
            cartValue: Number(form.cartValue||0), 
            sale_id:Number(form.sale_id||0),
            receipt_no: form.receipt_no || "",
            customer_phone:form.customer_phone||'',
            customer_email:form.customer_email||'',
            customer_name:form.customer_name||'',
            cash_amount: form.cash_amount || '',
        });
        console.log("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF", feedback);
       return feedback ;
       return ok("succuess");
    },

    async lastSlip(req:Request) {
        try {
        const auth = await requireAuth(req);
        const company_id = auth.user_company_id;
        const user_id = auth.id;
        const form = await req.json();
        const uid = form.uid || "";
        const feedback = await posRepository.lastSlip({user_id, company_id, uid });
        return ok(feedback);
        } catch(e) {
            console.error("POS Controller", e);
            return fail(new Error("Something went wrong"));
        }
    },

    async voidSale(req:Request) {
        const auth = await requireAuth(req);
        const company_id = auth?.user_company_id || "";
        const user_id = auth.id;
        const {uid} = await req.json();
        posRepository.voidSale({user_id, company_id, uid});
        return ok("Success");
    },
    async fetchSales(req: Request, page=1, limit=10) { 
    const auth = await requireAuth(req);
    const company_id = auth.user_company_id;
    const data = await posRepository.fetchSales( auth.user_company_id ??'', page, limit );

    return ok(data);

    },

    async printBarcode(req:Request) {
    const auth = await requireAuth(req);
    const company_id = auth.user_company_id;
    const form = await req.json();
    posRepository.printBarcode(form);
        return ok("");
    },
    
    async printLabel(req:Request) {
        const auth = await requireAuth(req);
        const company_id = auth.user_company_id;
        const form = await req.json();
        posRepository.printLabel(form);
        return ok("");
    },

    async fetchSalesData(req: Request, filter:DateFilterType, customFrom?:string, customTo?:string ) {
         
        const auth = await requireAuth(req);
        const company_id = auth.user_company_id;
        //const form = await req.json();
        const params = { filter, customFrom, customTo };
        const sales = await posRepository.fetchSalesData(params, auth.user_company_id??'');
 
        return ok(sales);
    },
    
    async fetchProducts(req: Request, company_id?:string) {
        let companyId = company_id;
        try { 
            const auth = await requireAuth(req);
            companyId = auth.user_company_id ??'';
        } catch(e) {}
        
        //const form = await req.json(); 
        const data = await posRepository.fetchProducts(companyId );
        return ok(data);
    },


  async AccountBalance(req:Request) { 
    const auth = await requireAuth(req);
    try {
    requireAdmin(auth.role||"");
    } catch(e:any){
        return fail(new Error(e?.message || "Admin view only.."))
    }

    const data = await posRepository.Accountbalance(auth.user_company_id??'');
    return (data);

  },















};
