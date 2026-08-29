// engine/lib/db/db.ts
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  database: process.env.DB_NAME!,
  connectionLimit: 10,
});

/** Low-level query executor */
async function query<T = any>(sql: string, params: any[] = []) {
  const [rows] = await pool.query(sql, params);
  return rows as T;
}

/** 
 * INSERT helper   
 * @returns object.id --insert ID
 * */
async function insert<T = any>(table: string, values: Record<string, any>) {
  const cols = Object.keys(values);
  const placeholders = cols.map(() => "?").join(",");

  const sql = `INSERT INTO ${table} (${cols.join(
    ","
  )}) VALUES (${placeholders})`;

  const [result]: any = await pool.query(sql, Object.values(values));

  return { id: result.insertId, ...values } as T & { id: number };
}

/** 
 * UPDATE helper 
 * @returns bool
 * */
async function update(
  table: string,
  values: Record<string, any>,
  where: string,
  params: any[] = []
) {
  const sets = Object.keys(values)
    .map((c) => `${c} = ?`)
    .join(", ");
  const sql = `UPDATE ${table} SET ${sets} WHERE ${where}`;

  await pool.query(sql, [...Object.values(values), ...params]); 
  return true;
}

/** 
 * DELETE helper 
 * @returns bool
 * */
async function remove(table: string, where: string, params: any[] = []) {
  const sql = `DELETE FROM ${table} WHERE ${where}`;
  await pool.query(sql, params);
  return true;
}


async function organizationData({id = 0, uuid = ''}):Promise<OrganizationType>  {
    const [orgData] = await db.query(`SELECT * FROM organizations where uuid = ? OR id = ?`, [uuid, id] );
    if(!orgData) throw new Error("Invalid data. Please try logging in again.")
    return {
      id:orgData.id,
      uuid: orgData.uuid, 
      customer_name:orgData.customer_name, 
      phone:orgData.phone,
      email:orgData.email,   
      institution_name:orgData.institution_name, 
      address:orgData.address, 
      website:orgData.website,
      created_at:orgData.created_at,
      capacity_allowed:orgData.capacity_allowed,
      status:orgData.status, 
      license_key:orgData.license_key,
      license_id:orgData.license_id,
      license_expiry:orgData.license_expiry,
      pin:orgData.pin,
      assigned_data:orgData.assigned_data,
      mizizi_user_id:orgData.mizizi_user_id,
      pos: orgData.pos,
      logo:orgData.logo??''

    }
}

async function adminId(uid:string):(Promise<number>) {
  const [user] = await db.query("SELECT * FROM users WHERE user_company_id = ? LIMIT 1", [uid]);
  return user.id ?? 0;
}

/** Expose high-level API only */
export const db = {
  query,
  insert,
  update,
  delete: remove,
  organizationData,
  adminId
};
