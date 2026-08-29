import { userController } from "@/engine/modules/users/user.controller";
import { fail } from "@/engine/core/http/responses";

export async function POST(req: Request) {
  try {
    return await userController.changePasswordSelf(req);
  } catch (e) {
    return fail(e);
  }
}
