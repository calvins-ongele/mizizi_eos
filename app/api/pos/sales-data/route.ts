import { posController } from "@/engine/modules/pos/pos.controller";
import { fail, ok } from "@/engine/core/http/responses";
import { NextRequest, NextResponse } from 'next/server';
import { DateFilterType } from "@/engine/types/sales";

export async function GET(request: NextRequest) { 
  const searchParams = request.nextUrl.searchParams;
  const filter:string = searchParams?.get('filter') ??'';
  if (filter == 'today' || filter == '7days' || filter == '30days' || filter == '90days' || filter == 'custom'  ){
     //{'today' | '7days' | '30days' | '90days' | 'custom'}
  } else return fail(new Error("Invalid data"));

  const customFrom = searchParams.get('customFrom'); 
  const customTo = searchParams.get('customTo'); 


  try {
    const feedback = await posController.fetchSalesData(request, filter ?? 'today', customFrom??'', customTo??'' ); 
    return (feedback); 
  } catch (e) {
    return fail(e);
  }
}
