// engine/lib/db/index.ts
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  database: process.env.DB_NAME!,
  connectionLimit: 10,
});
 
async function query<T = any>(sql: string, params: any[] = []) {
  const [rows] = await pool.query(sql, params);
  return rows as T;
}

async function run(sql: string, params: any[] = []) {
  await pool.query(sql, params);
  return true;
}

async function insert(table: string, values: Record<string, any>) {
  const cols = Object.keys(values);
  const placeholders = cols.map(() => "?").join(",");
  const sql = `INSERT INTO ${table} (${cols.join(",")}) VALUES (${placeholders})`;

  const [result]: any = await pool.query(sql, Object.values(values));
  return { id: result.insertId, ...values };
}

async function update(
  table: string,
  values: Record<string, any>,
  where: string,
  params: any[] = []
) {
  const sets = Object.keys(values).map(c => `${c} = ?`).join(",");
  const sql = `UPDATE ${table} SET ${sets} WHERE ${where}`;
  await pool.query(sql, [...Object.values(values), ...params]);
  return true;
}

async function remove(table: string, where: string, params: any[] = []) {
  const sql = `DELETE FROM ${table} WHERE ${where}`;
  await pool.query(sql, params);
  return true;
}

export const db = {
  query,
  run,
  insert,
  update,
  delete: remove,
};
