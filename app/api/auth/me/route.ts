// app/api/auth/me/route.ts
import { userController } from "@/engine/modules/users/user.controller";
import { fail } from "@/engine/core/http/responses";

export async function GET(req: Request) {
  try {
    return await userController.me(req);
  } catch (e) {
    return fail(e);
  }
}
