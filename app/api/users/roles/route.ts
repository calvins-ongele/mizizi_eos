import { userController } from "@/engine/modules/users/user.controller";
import { fail, ok } from "@/engine/core/http/responses";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) { 
  try {
    const feedback = await userController.fetchRoles(request); 
    return (feedback); 
  } catch (e) {
    return fail(e);
  }
}
