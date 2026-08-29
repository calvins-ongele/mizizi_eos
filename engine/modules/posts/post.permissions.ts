import { Role } from "@/engine/core/security/roles";

export const PostPermissions = {
  CREATE: "user" as Role,
  EDIT_OWN: "user" as Role,
  DELETE_OWN: "user" as Role,

  EDIT_ANY: "moderator" as Role,
  DELETE_ANY: "admin" as Role,
};
