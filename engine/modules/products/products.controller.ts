import { requireAuth } from "@/engine/core/http/auth-guard";
import { valid } from "@/engine/core/http/validator";
import { ok, created } from "@/engine/core/http/responses";
import { productsService } from "./products.service"; 
import { fail } from "assert";
import { parseId } from "@/engine/core/http/params";
import { productsRepository } from "./products.repository";
import { generateBarcode } from "@/engine/utils/helpers";

export const productsController = {
  async search(req: Request) {
    const auth = await requireAuth(req);
    const form = await req.json();
    const greater = Number(form?.greater ?? 0);
    if (!valid.string(form.search))
      return fail(new Error("Invalid search details.."));
    const data = await productsService.search(
      form.search,
      auth.user_company_id,
      greater===1?">=":">"
    );
    return ok(data);
  },

  async addReturnReason(req: Request) {
    const auth = await requireAuth(req);
    const form = await req.json();
    const name = String(form.name || "");
    if (!valid.string(name))
      return fail(new Error("Invalid name"));
    const category = await productsRepository.addReturnReason({
      name,
      company_id: auth.user_company_id,
    });
    return created(category);
  },
  async addCategory(req: Request) {
    const auth = await requireAuth(req);
    const form = await req.json();
    const name = String(form.name || "");
    if (!valid.string(name))
      return fail(new Error("Invalid name"));
    const category = await productsService.addCategory({
      name,
      company_id: auth.user_company_id,
    });
    return created(category);
  },
  async addUnit(req: Request) {
    const auth = await requireAuth(req);
    const form = await req.json();
    const name = String(form.name || "");
    if (!valid.string(name))
      return fail(new Error("Invalid unit name"));
    const category = await productsService.addUnit({
      name,
      company_id: auth.user_company_id,
    });
    return created(category);
  },

  async getCategories(req: Request) {
    const auth = await requireAuth(req);
    const categories = await productsService.getCategories(
      auth.user_company_id,
    );
    return ok(categories);
  },
  async getReturnReasons(req: Request) {
    const auth = await requireAuth(req);
    const units = await productsRepository.getReturnReasons(auth.user_company_id);
    return ok(units);
  },
  async getUnits(req: Request) {
    const auth = await requireAuth(req);
    const units = await productsService.getUnits(auth.user_company_id);
    return ok(units);
  },
  async addDefinition(req: Request) {
    const auth = await requireAuth(req);
    const form = await req.json();

    const name = String(form.name || "");
    const size = String(form.size || "");
    const barcode = String(form.barcode || "");
    const serial_no = String(form.serial_example || "");
    const is_serialized = form.is_serialized;
    if (is_serialized && !valid.string(serial_no)) {
      return fail(
        new Error(
          "Serial No is invalid or required when the checkbox is true!",
        ),
      );
    }

    const generatedBarcode = generateBarcode();// `200${Date.now().toString().slice(-10)}`;

    if (!valid.string(name))
      return fail(new Error("Invalid name"));
    if (!valid.string(size))
      return fail(new Error("Invalid size"));
    if (!valid.string(barcode)) {
      form.barcode = generatedBarcode;
      //return fail(new Error("Invalid barcode"));
    }
    if (!valid.isANumber(form.cost_price))
      return fail(new Error("Invalid cost price"));
    if (!valid.isANumber(form.selling_price))
      return fail(new Error("Invalid selling price"));

    
    const unitId = parseId(form.unit_id, "unit");
    const categoryId = parseId(form.category_id, "category");
    const cost_price = parseId(form.cost_price || "", "cost price");
    const selling_price = parseId(form.selling_price || "", "selling price");

    if (selling_price < cost_price)
      return fail(
        new Error("Typically selling price cannot be less than buying price."),
      );

    const category = await productsService.addDefinition({
      company_id: auth.user_company_id,
      user_id: Number(auth.id || 1),
      form: form,
    });
    return created(category);
  },

  async getDefinitions(req: Request, page:number, limit:number, q:string) {
    const auth = await requireAuth(req);
    const defs = await productsService.getDefinitions(auth.user_company_id, page, limit, q);
    return ok(defs);
  }, 
  async fetchReturnItems(req:Request, page:number, limit:number) { 
    const auth = await requireAuth(req);
    const data = await productsRepository.fetchReturnItems(auth.user_company_id, page, limit);
    return ok(data);
  },
  async fetchStockCount(req:Request, page:number, limit:number, order:string) {
    const auth = await requireAuth(req);
    const data = await productsRepository.stockCount(auth.user_company_id, page, limit, order);
    return ok(data);
  }, 

  async getDefinitionsData(req: Request) {
    const auth = await requireAuth(req);
    const { id } = await req.json();

    if (id.length == 0) {
      return ok({});
    }

    const data = await productsRepository.getDefinitionsData(Number(id));

    return ok({
      id: data.id,
      name: data.name,
      size: data.size,
      unit: data.unit_id, //unit_id
      barcode: data.barcode,
      category: data.category_id,
      cost_price: data.cost_price,
      selling_price: data.selling_price,
      is_serialized: data.is_serialized,
    });
  },

  async getSuppliers(req: Request) {
    const auth = await requireAuth(req);
    const suppliers = await productsService.getSuppliers(auth.user_company_id);
    return ok(suppliers);
  },
  async addSupplier(req:Request) {
    const auth = await requireAuth(req);
    const form = await req.json();
    const name = String(form.name || "");
    const email = String(form.email || "");
    const phone = String(form.phone || "");
    if (!valid.string(name))
      return fail(new Error("Invalid supplier name"));
    if (!valid.string(email))
      return fail(new Error("Invalid supplier email"));
    if (!valid.string(phone))
      return fail(new Error("Invalid supplier phone"));
    const supplier = await productsRepository.addSupplier({name, email, phone, company_id: auth.user_company_id});
    return created(supplier);
  },

  async addSupply(req:Request) {
    const auth = await requireAuth(req);
    const form = await req.json();
    const cart = form.cart;
     
    let total_cost = 0;
    let total_qty = 0;
    for(const item of cart) {
      const barcode = String(item.barcode || "");
      const buying_price = parseId(item.price || "", "cost price"); 
      const qty = parseId(item.qty || "", "quantity");
      const supplier_id = parseId(item.supplier_id || "", "supplier");
      const product_definition_id = parseId(item.product_definition_id || "", "Product ID");
      total_cost += buying_price * qty;
      total_qty += qty;
      if (!valid.string(barcode))
        return fail(new Error("Invalid product barcode"));
    } 
 
      const supply = await productsRepository.addSupply({cart, total_cost,total_qty,userid:Number(auth.id), companyid: auth?.user_company_id});
      return created(supply);
  },
  async getPurchases(req: Request) {
    const auth = await requireAuth(req);
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const purchases = await productsRepository.getPurchases(auth.user_company_id, page, limit);
    return ok(purchases);
  },

  async returnItems(req: Request) {
    const auth = await requireAuth(req);
    const form = await req.json(); 

    if (form.description.length > 0) { //optional description
      if (!valid.string(form.description))
        return fail(new Error("Invalid return description"));
    }
    if (!valid.isANumber(form.reason_id))
      return fail(new Error("Invalid return reason ID"));
    if (!valid.isANumber(form.productid))
      return fail(new Error("Invalid return product ID"));
    if (!valid.isANumber(form.quantity))
      return fail(new Error("Invalid return quantity"));

    const returned = await productsRepository.returnItems({
      product_definition_id: Number(form.productid),
      quantity: Number(form.quantity),
      reason_id: Number(form.reason_id),
      description: form.description,
      user_id: Number(auth.id),
      company_id: auth.user_company_id,
    });
    return created(returned);
  }




















};
