import { userController } from "@/engine/modules/users/user.controller";
import { fail } from "@/engine/core/http/responses";

export async function DELETE(req: Request) {
  try {
    return await userController.requestDeletion(req);
  } catch (e) {
    return fail(e);
  }
}
