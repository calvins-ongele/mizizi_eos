import { contentController } from "@/engine/modules/content/content.controller";
import { fail, ok } from "@/engine/core/http/responses";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
   const searchParams = request.nextUrl.searchParams;
  const cont_id = searchParams.get('cont_id'); 
  try {
    const feedback = await contentController.adminFetch(request, cont_id??'' ); 
    return (feedback); 
  } catch (e) {
    return fail(e);
  }
}
