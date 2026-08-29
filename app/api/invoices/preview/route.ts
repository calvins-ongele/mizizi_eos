import { invoicesController } from "@/engine/modules/invoices/invoices.controller";
import { fail, ok } from "@/engine/core/http/responses";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
   const searchParams = request.nextUrl.searchParams;
  const uid = searchParams.get('uid'); 
  try {
    const feedback = await invoicesController.fetchSingleInvoice(request, uid??'' ); 
   
    return (feedback); 
  } catch (e) {
    return fail(e);
  }
}
