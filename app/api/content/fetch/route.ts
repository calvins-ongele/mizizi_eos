import { contentController } from "@/engine/modules/content/content.controller"
import { fail, ok } from "@/engine/core/http/responses";
import { NextRequest, NextResponse } from 'next/server'; 
import { getCookies, saveCookie } from "@/engine/utils/companycookies";

export async function GET(request: NextRequest) { 
   
  try {
    const searchParams = request.nextUrl.searchParams;
    let company_id = searchParams.get('id') ?? ''; 
    if (process.env.ALONY === 'Y') {
      if (company_id.length <= 0) {
        company_id = `${process.env.DEFAULT_UID}`;
      }
    }
    
    const cookie = await getCookies();
    if (cookie.length > 0) {
      saveCookie(company_id??'');
    }


    const feedback = await contentController.fetchAll(request, company_id??'');   
    return (feedback); 
  } catch (e) {
    console.log("API/CONTENT/FETCH", e);
    return fail(e);
  }
}

 

