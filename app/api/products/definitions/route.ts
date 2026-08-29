import { productsController } from "@/engine/modules/products/products.controller";
import { fail } from "@/engine/core/http/responses";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
   const searchParams = request.nextUrl.searchParams;
   const q = searchParams.get('q');
   const page = searchParams.get('page');
   const limit = searchParams.get('limit'); 
    const defs = await productsController.getDefinitions(request,  Number(page??1), Number(limit??10), q??""); 
    return defs;
  } catch (e) {
    return fail(e);
  }
}
