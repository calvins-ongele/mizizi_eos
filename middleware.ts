import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const cid = req.cookies.get("cid")?.value ?? '';
  let session_id = req.cookies.get("session_id")?.value ?? '';
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
  const country = req.headers.get("cf-ipcountry") ?? '';

  const reqHeaders = new Headers(req.headers);
  reqHeaders.set("x-pathname", req.nextUrl.pathname);
 

  if (session_id.length === 0) { 
    session_id = crypto.randomUUID();
      const cookieStore = await cookies();
      cookieStore.set("session_id", session_id, {
        httpOnly: true, // Prevents client-side JS scripts from accessing it
        secure: process.env.NODE_ENV === 'production', // Requires HTTPS in production
        sameSite: 'strict',
        path: '/', // Accessible across the whole site
      });
    
  }

  // Protect dashboard routes
  const { pathname } = req.nextUrl; 
 

  // NEVER touch API routes 
  if (pathname.startsWith("/api")) return NextResponse.next();
  if (pathname.startsWith("/_next")) return NextResponse.next();
  if (pathname.startsWith("/favicon")) return NextResponse.next();

  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  } else {
    // save analytics
    fetch(`${process.env.APP_URL}/api/analytics/save`, {
          method: "POST",
          keepalive: true,
          body: JSON.stringify({
              path: pathname,
              referrer: req.headers.get("referer"),
              ua: req.headers.get("user-agent"),
              cid,
              session_id,
              ip,
              country
          })
    });
  }

  return NextResponse.next({
    request: {
      headers: reqHeaders,
    }
  });
}
