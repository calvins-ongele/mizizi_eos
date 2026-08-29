import { posController } from "@/engine/modules/pos/pos.controller";
import { fail, ok } from "@/engine/core/http/responses";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
   const searchParams = request.nextUrl.searchParams;
  const uid = searchParams.get('uid'); 

    const feedback = await posController.getSuspendCart(request, true, `${uid}`); 
    return (feedback); 
  } catch (e) {
    return fail(e);
  }
}
