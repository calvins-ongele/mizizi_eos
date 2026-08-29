import { productsController } from "@/engine/modules/products/products.controller";
import { fail, ok } from "@/engine/core/http/responses";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
   const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page');
  const limit = searchParams.get('limit'); 
  const order = searchParams.get('order') || 'desc';
  try {
    const feedback = await productsController.fetchStockCount(request, Number(page??1), Number(limit??10), order); 
    return (feedback); 
  } catch (e) {
    return fail(e);
  }
}
