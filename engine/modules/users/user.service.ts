import { userRepository } from "./user.repository";
import { hashPassword, verifyPassword } from "@/engine/core/security/hash";
import { signToken } from "@/engine/core/security/jwt";
import { AuthError, ValidationError } from "@/engine/core/http/errors";
import { User } from "./user.types";
import { uuid } from "../../utils/crypto";

export const userService = {
  
  async register(data: { name: string; email: string; password: string, phone:string, role:string, company_id:string, status:string }) {
    const existing = await userRepository.emailExists(data.email, data.company_id);
    if (existing) throw new ValidationError("Email already in use");

    const hashed = await hashPassword(data.password);

    const user = await userRepository.create({
      uuid: uuid(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashed, 
      role_id: data.role,
      is_active:data.status,
      user_company_id:data.company_id
    });

    const token = signToken({ id: user.id, email: user.email, role: "user", user_company_id: user.user_company_id });

    return { user: { id: user.id, name: user.name, email: user.email }, token };
  },

  async login(data: { email: string; password: string }) { 
    
    const user = await userRepository.findByEmail(data.email); 
   
    if (!user) throw new AuthError("Invalid credentials");

    const ok = await verifyPassword(data.password, user.password);
    if (!ok) throw new AuthError("Invalid credentials");

    const role = await userRepository.findRole(user.role_id);
    
    const token = signToken({
      id: user.id,
      email: user.email,
      role: role.name,
      user_company_id: user.user_company_id
    });

    userRepository.updateLastLogin(user.id);

    return { user: { id: user.id, name: user.name, email: user.email }, token };
  },

  async updateProfile(userId: number, data: { name: string; email: string, phone:string }) {
    const existing = await userRepository.findByParams(data.email);

    if (existing && existing.id !== userId) {
      throw new ValidationError("Email already belongs to another account");
    }

    await userRepository.update(
      { name: data.name, email: data.email, phone:data.phone },
      "id = ?",
      [userId]
    );

    return await userRepository.find(userId);
  },

  async requestDeletion(id:number, company_id?:any) {
    return await userRepository.requestDeletion(id, company_id);
  },
  async changePasswordSelf(form:any, id:number) {
    return await userRepository.changePasswordSelf(form, id);
  }

  
};
