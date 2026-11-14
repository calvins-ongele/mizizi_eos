// engine/modules/users/user.repository.ts
import { BaseModel } from "@/engine/lib/db/BaseModel";
import { User } from "./user.types"; 
import { db } from "@/engine/lib/db/mysql.client";
import { hashPassword, verifyPassword } from "@/engine/core/security/hash";

class UserRepository extends BaseModel<User> {
  protected table = "users";

  async findUser(user_id:string|null, company_id:string|null) {
    const [user] = await db.query(`SELECT u.id as id, u.name as name, u.email as email,dp, u.phone as phone
      , assigned_data, pos, org.uuid as uuid, role_id
      FROM ${this.table} u
      LEFT JOIN organizations org ON org.uuid = user_company_id
      WHERE u.id = ? AND org.uuid = ?
      `, [ user_id, company_id ]);

      return user ?? [];
  }

  async findByParams(email: string, company_id?:string) {
    return await this.findBy("email,user_company_id", [email, company_id]);
  }
  async findById(id:number) {
    return await this.findBy("id", [id]);
  }
  async findByEmail(email:string) {
    return await this.findBy("email", [email]);
  }

  async findRole(id:number) {
    const q = await db.query(
      `SELECT * FROM roles WHERE id = ?  `,
      [id]
    );
    return q[0] ?? null;
  }

  async emailExists(email: string, company_id?:string) {
    return await this.exists("email,user_company_id", [email, company_id]);
  }

  async requestDeletion(id:number, company_id?:any) {
    const deleted = await db.insert("requests", {
      requested_by: id,
      action: 'delete_profile',
      company_id
    });

    return deleted;
  }

  async confirmPassword(pass:string, id:number) {
    const [user] = await db.query("SELECT password from users where id = ?", [id]); 
    const ok = await verifyPassword(pass, user.password); 
    return ok;
  }

  async changePasswordSelf(form:any, id:number) {
    const hashed = await hashPassword(form.pass_2);
    
    const update  = db.update("users", {
      password: hashed
    }, "id", [id]);
  }

  async updateLastLogin(userId:number) {
    db.update("users", {
      last_login_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }, "id", [userId]);
  }
  
  async findAll(table:string, company_id?:string) {
    const roles = await db.query(`SELECT * FROM ${table} WHERE id > ?`, [1]);
    return roles;
  }

  
  async fetchUsers(company_id?:string, page = 1, limit = 10) {
    
    const offset = ( (page - 1)==1?1: (page - 1) ) * limit;

    const rows = await db.query(
      `SELECT 
      users.*, roles.name as role 
      FROM users
      LEFT JOIN roles ON users.role_id = roles.id
      where  user_company_id = '${company_id}'
      ORDER BY id ASC 
      LIMIT ? OFFSET ? `,
      [limit, offset]
    );

    const [countRow] = await db.query(
      `SELECT COUNT(*) as total FROM users where user_company_id = '${company_id}'`
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

  async deleteUser(id:number) {
    const deleted = await db.delete("users", "id = ? ", [id]);
    return deleted; 
  }


}

export const userRepository = new UserRepository();
