import { userController } from "@/engine/modules/users/user.controller";
import { fail } from "@/engine/core/http/responses";
import { cookies } from "next/headers";
import { redirect } from "next/dist/server/api-utils";

export async function POST(req: Request) { 
  try {
    const result = await userController.login(req);

    // result = { user, token } 
    (await cookies()).set("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return Response.json({ success: true, user: result.user });
  } catch (e) {
    return fail(e);
  }
}
