import { userController } from "@/engine/modules/users/user.controller";
import { fail, ok } from "@/engine/core/http/responses";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page');
  const limit = searchParams.get('limit'); 
  try {
    const feedback = await userController.fetchUsers(request, Number(page??1), Number(limit??10)); 
    return (feedback); 
  } catch (e) {
    return fail(e);
  }
}
