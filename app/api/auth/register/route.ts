import { fail } from "@/engine/core/http/responses";
import { userController } from "@/engine/modules/users/user.controller";

export async function POST(req: Request) {
  try {
    return await userController.register(req);
  } catch (e) {
    return fail(e);
  }
}
