import { Role } from "@/engine/core/security/roles";

export const PostPermissions = {
  CREATE: "Cashier" as Role,
  EDIT_OWN: "Cashier" as Role,
  DELETE_OWN: "Admin" as Role,

  EDIT_ANY: "Cashier" as Role,
  DELETE_ANY: "Admin" as Role,
};
