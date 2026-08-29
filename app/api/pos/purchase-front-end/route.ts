import { posController } from "@/engine/modules/pos/pos.controller";
import { fail, ok } from "@/engine/core/http/responses";
import { NextRequest, NextResponse } from 'next/server'; 
import { getCookies, saveCookie } from "@/engine/utils/companycookies";

export async function POST(request: NextRequest) {
  try {
     const searchParams = request.nextUrl.searchParams;
      const company_id = searchParams.get('id'); 
      
      const cookie = await getCookies();
      if (cookie.length > 0) {
        saveCookie(company_id??'');
      }

    const feedback = await posController.SaveSaleFrontEnd(request, company_id??''); 
    return (feedback); 
  } catch (e) {
    return fail(e);
  }
}
