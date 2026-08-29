import { userController } from "@/engine/modules/users/user.controller";
import { fail, ok } from "@/engine/core/http/responses";

export async function POST(req: Request) {
  try {
    const feedback = await userController.register(req); 
    return (feedback); 
  } catch (e) {
    return fail(e);
  }
}
