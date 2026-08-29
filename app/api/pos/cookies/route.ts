import { posController } from "@/engine/modules/pos/pos.controller";
import { fail, ok } from "@/engine/core/http/responses";
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from "next/headers";
  

export async function GET(request: NextRequest) {
   const searchParams = request.nextUrl.searchParams;
  const cookieName = searchParams.get('cookieName');   
  const cookie = (await cookies()).get(`${cookieName}`)?.value;

  return ok(cookie);
}
 

export async function POST(req: Request) {
  const cookieStore = await cookies() // Await cookies()  
  const form = await req.json();

  cookieStore.set("order_number", form.value||"", {
    httpOnly: true, // Prevents client-side JS scripts from accessing it
    secure: process.env.NODE_ENV === 'production', // Requires HTTPS in production
    sameSite: 'strict',
    path: '/', // Accessible across the whole site
  });

  return ok("OK");
}

