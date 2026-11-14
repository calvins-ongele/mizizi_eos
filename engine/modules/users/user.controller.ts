import { valid } from "@/engine/core/http/validator";
import { ok, created, fail } from "@/engine/core/http/responses";
import {
  RegisterSchema,
  LoginSchema,
  UpdateProfileSchema,
} from "@/engine/core/validation/schemas/user.schema";
import { userService } from "./user.service";
import { requireAuth, requireAdmin } from "@/engine/core/http/auth-guard";
import { userRepository } from "./user.repository"; 

export const userController = { 
  async register(req: Request) {
    const auth = await requireAuth(req);
    requireAdmin(auth.role || "");
    const form = await req.json();
    form.role = Number(form.role || 2);
    form.status = Number(form.status || 0);
    const body = await valid.schema(RegisterSchema, form);   

    if (form.password !== form.cpassword) {
      return fail(new Error("Password and confirmed password must match."));
    }
    body.company_id = auth.user_company_id || "";
    const result = await userService.register(body);
    return created(result);
  },

  async login<T = any>(req: Request) { 
    const body = await valid.schema(LoginSchema, await req.json());
    return userService.login(body) as T;
    const result = await userService.login(body);
    return ok(result);
  },

  async me(req: Request) {
    const auth = await requireAuth(req);
    const user = await userRepository.findUser(`${auth.id ?? ''}`, auth.user_company_id??''); 
    const role = await userRepository.findRole(Number(user!.role_id)); 

    return ok({ 
      id: user?.id,
      name: user?.name,
      email: user?.email,
      role: role.name,  
      dp: user?.dp,
      phone: user?.phone,
      assigned_data:user?.assigned_data, 
      pos:user?.pos, 
      uuid:user?.uuid
    });
  },

  async updateProfile(req: Request) {
    const auth = await requireAuth(req);
    const body = await valid.schema(UpdateProfileSchema, await req.json());

    const user = await userService.updateProfile(Number(auth.id), body);

    return ok({
      id: user?.id,
      name: user?.name,
      email: user?.email,
      role: user?.role,
    });
  },

  async requestDeletion(req: Request) {
    
    const auth = await requireAuth(req); 

    const user = await userService.requestDeletion(Number(auth.id), auth.user_company_id );

    return ok({
      message: "Request successfully handled"
    });
  },

  async changePasswordSelf(req:Request) {
    const auth = await requireAuth(req);
    const form = await req.json();
    if (form.pass_1 !== form.pass_2) {
      return fail(new Error("New Password and confirmed new password must match."));
    }
    if (form.currentPass) { 
      const correct = await userRepository.confirmPassword(form.currentPass, Number(auth.id));
      if (!correct) return fail(new Error("Current password is incorrect."));
    }

    const change = await userService.changePasswordSelf(form, Number(auth.id));
    return ok({message:"Password successfully changed"});
  },

  async fetchRoles(req:Request) { 
    const auth = await requireAuth(req);
    const roles = await userRepository.findAll("roles", auth.user_company_id || "");
    return ok(roles);
  },

  async fetchUsers(req:Request, page = 1, limit = 10) { 
    const auth = await requireAuth(req);
    const users = await userRepository.fetchUsers(auth.user_company_id || "", page, limit);
    return ok(users);
  },

  async deleteUser(id:number, company_id?:string) {
    const user = await userRepository.findById(id );
    console.log("user to delete:", user);
    if (!user) {
      return fail(new Error("User not found"));
    }
    if ( user.role_id === 1 || user.role_id === 2 ) {
      return fail(new Error("Cannot delete Admin or Super Admin user"));
    }
    const deleted = await userRepository.deleteUser(id);

    if (deleted) return ok("User successfully deleted");
    return fail(new Error("Could not delete user"));
  }


};
