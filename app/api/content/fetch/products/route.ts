import { posController } from "@/engine/modules/pos/pos.controller"
import { fail, ok } from "@/engine/core/http/responses";
import { NextRequest, NextResponse } from 'next/server'; 
import { getCookies, saveCookie } from "@/engine/utils/companycookies";

export async function GET(request: NextRequest) { 
  
    const searchParams = request.nextUrl.searchParams;
     const company_id = searchParams.get('id'); 
     
     const cookie = await getCookies();
     if (cookie.length > 0) {
       saveCookie(company_id??'');
     }
 
  try {
    const feedback = await posController.fetchProducts(request, company_id ?? '');  
    return (feedback); 
  } catch (e) {
    return fail(e);
  }
}

 