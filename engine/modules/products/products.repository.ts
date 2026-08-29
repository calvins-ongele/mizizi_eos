import { BaseModel } from "@/engine/lib/db/BaseModel";
import { db } from "@/engine/lib/db/mysql.client";
import { Products } from "./products.types";
import { fail } from "assert"; 
import { uuid } from "../../utils/crypto";

class ProductsRepository extends BaseModel<Products> {
  protected table = "product_definitions";

  async searchx(search: string, companyId?: string, minSign = ">") {
    return await db.query<Products[]>(
      `SELECT
            pd.barcode, pd.id as product_definition_id, 
            CONCAT(pd.name, IF(pd.size IS NOT NULL, CONCAT(' ', pd.size), '')) AS product_name,
            pd.selling_price AS price_per_unit, pd.cost_price as cost_price,
            COALESCE(SUM(sm.quantity), 0) AS quantity_available
        FROM product_definitions pd
        LEFT JOIN stock_movements sm
            ON sm.product_definition_id = pd.id
        WHERE
            sm.quantity ${minSign}  0 AND
            pd.is_active = TRUE and pd.product_company_id = '${companyId}'
            AND (
                pd.barcode = '${search}'
                OR pd.name LIKE CONCAT('%${search}%')
            )
        GROUP BY
            pd.id,
            pd.barcode,
            pd.name,
            pd.size,
            pd.selling_price
        ORDER BY
            pd.name ASC`,
      []
    );
  }
  
  async search(search: string, companyId?: string, minSign = ">") {
    const searchPattern = `%${search}%`; 

    return await db.query<Products[]>(
      `SELECT
          pd.barcode, 
          pd.id AS product_definition_id, 
          CONCAT(pd.name, IF(pd.size IS NOT NULL, CONCAT(' ', pd.size), '')) AS product_name,
          pd.selling_price AS price_per_unit, 
          pd.cost_price AS cost_price,
          COALESCE(SUM(sm.quantity), 0) AS quantity_available
      FROM product_definitions pd
      LEFT JOIN stock_movements sm
          ON sm.product_definition_id = pd.id
      WHERE
          pd.is_active = TRUE 
          AND pd.product_company_id = ?
          AND (
              pd.barcode = ?
              OR pd.name LIKE ?
          )
      GROUP BY
          pd.id,
          pd.barcode,
          pd.name,
          pd.size,
          pd.selling_price,
          pd.cost_price
      HAVING quantity_available ${minSign}  0
      ORDER BY
          pd.name ASC`,
      [companyId, search, searchPattern]
    );
  }

  async stockCount(companyId?: string, page = 1, limit = 20, orderDir = "DESC") { 
    const offset = (page - 1) * limit;

    const items = await db.query<Products[]>(
      `SELECT
          pd.barcode, pc.name as category_name,
          CONCAT(pd.name, IF(pd.size IS NOT NULL, CONCAT(' ', pd.size), '')) AS product_name,
          COALESCE(SUM(sm.quantity), 0) AS stock_count
      FROM product_definitions pd
      LEFT JOIN stock_movements sm
          ON sm.product_definition_id = pd.id
      LEFT JOIN product_categories pc ON  pc.id = pd.category_id
      WHERE
          pd.is_active = TRUE 
          AND pd.product_company_id = ?
          
      GROUP BY
          pd.id,
          pd.barcode,
          pd.name,
          pd.size
      ORDER BY
          stock_count ${orderDir}
      LIMIT ? OFFSET ?
      `,
      [companyId, limit, offset]
    );

    
  const [countRow] = await db.query(
    `SELECT COUNT(*) as total FROM return_items where company_id = '${companyId}'`
  );

    const output  = {
      data: items,
      total: countRow.total,
      page,
      limit,
      totalPages: Math.ceil(countRow.total / limit),
    };
  
    return output;
  }

  async addCategory(data: { name: string; company_id?: string }) {
    const categ = await db.query(
      `select * from product_categories where name = ? and company_id = ?
      `,
      [data.name, data.company_id]
    );
    if (categ.length > 0) {
      return fail(new Error("Units already exists."));
      //throw new Error("Category already exists");
    }

    const result = await db.query(
      `INSERT INTO product_categories (name, company_id) VALUES (?, ?)`,
      [data.name, data.company_id]
    );
    const insertId = (result as any).insertId;
    return this.find(insertId);
  }
  
  async addReturnReason(data: { name: string; company_id?: string }) {
    const categ = await db.query(
      `select * from return_reasons where name = ? and company_id = ?
      `,
      [data.name, data.company_id]
    );
    if (categ.length > 0) {
      return fail(new Error("Return reason already exists.")); 
    }

    const result = await db.query(
      `INSERT INTO return_reasons (name, company_id) VALUES (?, ?)`,
      [data.name, data.company_id]
    );
    const insertId = (result as any).insertId;
    return this.find(insertId);
  }
  async addUnit(data: { name: string; company_id?: string }) {
    const categ = await db.query(
      `select * from units where name = ? and units_company_id = ?
      `,
      [data.name, data.company_id]
    );
    if (categ.length > 0) {
      return fail(new Error("Category already exists.")); 
    }

    const result = await db.query(
      `INSERT INTO units (name, units_company_id) VALUES (?, ?)`,
      [data.name, data.company_id]
    );
    const insertId = (result as any).insertId;
    return this.find(insertId);
  }

  async getCategories(company_id?: string) {
    return db.query(
      `SELECT * FROM product_categories where company_id = '${company_id}' ORDER BY name ASC`
    );
  }
  async updateCategory(id: number, data: { name: string }) {
    const categ = await db.query(
      `select * from product_categories where name = ? AND id != ?`,
      [data.name, id]
    ); 
    if (categ.length > 0) {
      return fail(new Error("Category already exists."));
      //throw new Error("Category already exists");
    }
    await db.query(`UPDATE product_categories SET name = ? WHERE id = ?`, [
      data.name,
      id,
    ]);
    return this.find(id);
  }
  
  async updateReturnReason(id: number, data: { name: string }) {
    const categ = await db.query(
      `select * from return_reasons where name = ? AND id != ?`,
      [data.name, id]
    );
    if (categ.length > 0) {
      return fail(new Error("Return reason already exists."));
      //throw new Error("Category already exists");
    }
    await db.query(`UPDATE return_reasons SET name = ? WHERE id = ?`, [
      data.name,
      id,
    ]);
    return this.find(id);
  }
  async updateUnit(id: number, data: { name: string }) {
    const categ = await db.query(
      `select * from units where name = ? AND id != ?`,
      [data.name, id]
    );
    if (categ.length > 0) {
      return fail(new Error("Unit already exists."));
      //throw new Error("Category already exists");
    }
    await db.query(`UPDATE units SET name = ? WHERE id = ?`, [
      data.name,
      id,
    ]);
    return this.find(id);
  }
  
  async updateSupplier(id: number, data: { name: string, email:string, phone:string, company_id?: string }) {
    const categ = await db.query(
      `select * from suppliers where name = ? AND id != ?`,
      [data.name, id]
    );
    if (categ.length > 0) {
      return fail(new Error("Supplier already exists."));
      //throw new Error("Category already exists");
    }
    await db.query(`UPDATE suppliers SET name = ?, email = ?, phone = ? WHERE id = ?`, [
      data.name,
      data.email,
      data.phone,
      id,
    ]);
    return this.find(id);
  }

  async deleteCategory(id: number) {
    return await db.query(`DELETE FROM product_categories WHERE id = ?`, [id]);
  }
  async  deleteProduct(id:number) {
    return await db.query(`DELETE FROM product_definitions WHERE id = ?`, [id]);
  }
  async getDefinitionsData(id:number) {
    const [data] = await db.query(`SELECT *   
      FROM product_definitions  
      WHERE product_definitions.id = ?`, [id]);
    return data;
  }
  async deleteUnit(id: number) {
    return await db.query(`DELETE FROM units WHERE id = ?`, [id]);
  }

  async deleteReturnReason(id: number) {
    return await db.query(`DELETE FROM return_reasons WHERE id = ?`, [id]);
  }
  async getReturnReasons(company_id?: string) {
    return db.query(
      `SELECT * FROM return_reasons where company_id = '${company_id}' ORDER BY name ASC`
    );
  }
  async getUnits(company_id?: string) {
    return db.query(
      `SELECT * FROM units where units_company_id = '${company_id}' ORDER BY name ASC`
    );
  }

  async addDefinition(data: { company_id?: string; user_id:number, form: any }) {
    const formdata = data.form;

    //check if we are updating
    const productid = formdata.productid; 
    if (productid.length > 0) {
      //update 
      const rez = await db.update("product_definitions", {
        name:formdata.name, size:formdata.size, barcode:formdata.barcode,
        category_id:formdata.category_id, unit_id:formdata.unit_id, cost_price:formdata.cost_price,
        selling_price:formdata.selling_price,is_serialized:formdata.is_serialized
      }, "id=?", [productid]);
 
      return productid;
    }
    const categ = await db.query(
      `select * from product_definitions where barcode = ? and product_company_id = ?
      `,
      [data.form.barcode, data.company_id]
    );

    if (categ.length > 0) {
      return fail(new Error("Product already exists."));
    }

     
    const result = await db.query(
      `INSERT INTO product_definitions (uuid,name,size,barcode,category_id,unit_id,cost_price,
      selling_price,is_serialized,product_company_id  ) VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [uuid(), formdata.name, formdata.size, formdata.barcode, formdata.category_id, formdata.unit_id, formdata.cost_price,
        formdata.selling_price, formdata.is_serialized, data.company_id]
    );

    const insertId = (result as any).insertId;
    await db.insert("stock_movements", {
      uuid: uuid(),
      product_definition_id: insertId,
      quantity: 0,
      type: "purchase",
      reference_type: "purchase",
      user_id: data.user_id
    });
    // serialized products must have unique barcodes, so we return the existing product if barcode already exists
    //product_items
    return this.find(insertId);
  }

  async getDefinitionsx(company_id?: string) {
    return db.query(
      `SELECT * FROM product_definitions where product_company_id = '${company_id}' ORDER BY name ASC`
    );
  }

async fetchReturnItems(company_id?:string, page = 1, limit = 20){
  const offset = (page - 1) * limit;
  const items = await db.query(
    `SELECT return_items.*, users.name as user_name, product_definitions.name as product_name, return_reasons.name as reason
     FROM return_items 
     LEFT JOIN users ON users.id = return_items.returned_by  
     LEFT JOIN product_definitions ON product_definitions.id = return_items.product_definition_id
     LEFT JOIN return_reasons ON return_reasons.id = return_items.reason_id
     where  return_items.company_id = '${company_id}'
     ORDER BY return_items.id desc 
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  
  const [countRow] = await db.query(
    `SELECT COUNT(*) as total FROM return_items where company_id = '${company_id}'`
  );

    const output  = {
    data: items,
    total: countRow.total,
    page,
    limit,
    totalPages: Math.ceil(countRow.total / limit),
  };
 
  return output;
  
}
async getDefinitions(company_id?:string, page = 1, limit = 20, q = "") {
  const offset = (page - 1) * limit;

  let rows;
  if (q && q.length > 0) { 
    
  rows = await db.query(
    `SELECT * 
     FROM product_definitions 
     where  product_company_id = '${company_id}' AND (name LIKE ? OR barcode LIKE ?)
     ORDER BY name ASC 
     LIMIT ? OFFSET ?`,
    [ `%${q}%`, `%${q}%`, limit, offset ]
  );
  } else {
  rows = await db.query(
    `SELECT * 
     FROM product_definitions 
     where  product_company_id = '${company_id}'
     ORDER BY name ASC 
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  }

  const [countRow] = await db.query(
    `SELECT COUNT(*) as total FROM product_definitions where product_company_id = '${company_id}'`
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

async getSuppliers(company_id?: string) {
  const rows = await db.query(
    `SELECT * 
     FROM suppliers 
     where  company_id = ? ORDER BY id desc `,
    [company_id ]
  );

  return rows;
}

async addSupplier(data: { name: string, email:string, phone:string, company_id?: string }) {
  const supplier = await db.insert("suppliers", {name: data.name, email:data.email, phone:data.phone, company_id: data.company_id});
  return this.find(supplier.insertId);
}

async addSupply(data: { cart:any[], total_cost: number, total_qty:number, userid:number, companyid?: string }) {  
  // 1. stock_movements
  // 2.purchases
  // 3. purchase_items

  const purchase = await db.insert("purchases", {
    uuid: uuid(),
    supplier_name: data.cart[0].supplier_id,
    total_cost: data.total_cost,
    user_id: data.userid, 
    quantity: data.total_qty, 
    company_id: data.companyid
  });

  for(const item of data.cart) {
    const purchaseItems = await db.insert("purchase_items", { 
      purchase_id: purchase.id,
      product_definition_id: item.product_definition_id,
      quantity: item.qty,
      cost_price: item.price,
    });

    await db.insert("stock_movements", {
      uuid: uuid(),
      product_definition_id: item.product_definition_id,
      quantity: item.qty,
      type: "purchase",
      reference_type: "purchase",
      user_id: data.userid
    });
  }

  return purchase.id; 
}
async getPurchases(company_id?: string, page = 1, limit = 20) {
  const offset = (page - 1) * limit; 

  const rows = await db.query(
    `SELECT p.id as purchase_id, total_cost, quantity, p.created_at as created_at, s.name as supplier_name
     FROM purchases p
     JOIN suppliers s ON supplier_name = s.id AND s.company_id = p.company_id
     where  p.company_id = '${company_id}'
     ORDER BY p.id desc 
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  const [countRow] = await db.query(
    `SELECT COUNT(*) as total FROM purchases where company_id = '${company_id}'`
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

async returnItems(data: {
      product_definition_id: number, quantity: number, reason_id: number, 
      description: string, user_id: number, company_id?: string }) {

  const purchase = await db.insert("return_items", {
    uuid: uuid(),
    product_definition_id: data.product_definition_id,

    quantity: data.quantity,
    reason_id: data.reason_id,
    description: data.description,
    returned_by: data.user_id,
    company_id: data.company_id
  });

  
  await db.insert("stock_movements", { 
      uuid:uuid(),
      product_definition_id:data.product_definition_id,
      quantity:Number(`-${data.quantity || 0}`),
      type:'return',
      reference_type:"Return",
      reference_id:15,
      user_id:data.user_id||1,
  } ); 

  return purchase.id;


}





}

export const productsRepository = new ProductsRepository();
