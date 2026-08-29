// engine/core/db/BaseModel.ts
import { db } from "@/engine/lib/db/mysql.client";

export abstract class BaseModel<T> {
  protected abstract table: string;

  async find(id: number, pk = "id") {
    const r = await db.query<T[]>(
      `SELECT * FROM ${this.table} WHERE ${pk} = ? LIMIT 1`,
      [id]
    );
    return r[0] ?? null;
  }

  all() {
    return db.query<T[]>(`SELECT * FROM ${this.table}`);
  }

  where(col: string, op: string, value: any) {
    return db.query<T[]>(`SELECT * FROM ${this.table} WHERE ${col} ${op} ?`, [
      value,
    ]);
  }

  async firstWhere(col: string, value: []) {
    const where = col.split(",");
    for (let i = 0; i < where.length; i++) {
      where[i] = `${where[i]} = ? AND `;
    }
    // Remove the trailing " AND "
    where[where.length - 1] = where[where.length - 1].slice(0, -5);
    const r = await db.query<T[]>(
      `SELECT * FROM ${this.table} WHERE ${where.join(" ")} LIMIT 1`,
      value
    ); 
    console.log(`SELECT * FROM ${this.table} WHERE ${where.join(" ")} LIMIT 1`,
      value)
    return r[0] ?? null;
  }

  // alias — reads nicer in domain logic
  async findBy(col: string, value: any) {
    return await this.firstWhere(col, value);
  }

  async exists(col: string, value:any ) {
    const where = col.split(",");
    for (let i = 0; i < where.length; i++) {
      where[i] = `${where[i]} = ? AND `;
    }

    // Remove the trailing " AND "
    where[where.length - 1] = where[where.length - 1].slice(0, -5);
    const r = await db.query<any[]>(
      `SELECT 1 FROM ${this.table} WHERE ${where.join(" ")} LIMIT 1`,
      value
    );
    return Boolean(r.length);
  }

  async count() {
    const r = await db.query<{ count: number }[]>(
      `SELECT COUNT(*) AS count FROM ${this.table}`
    );
    return r[0].count;
  }

  create(values: Record<string, any>) {
    return db.insert(this.table, values);
  }

  update(values: Record<string, any>, where: string, params: any[]) {
    return db.update(this.table, values, where, params);
  }

  delete(where: string, params: any[]) {
    return db.delete(this.table, where, params);
  }
}
