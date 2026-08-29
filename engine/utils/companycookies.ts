import { cookies } from "next/headers";

export async function saveCookie(company_id:string) {
   const cookieStore = await cookies() // Await cookies()  

  const expirationDate = new Date()
  expirationDate.setDate(expirationDate.getDate() + 365);

  cookieStore.set("company_id", company_id||"", {
    httpOnly: true, // Prevents client-side JS scripts from accessing it
    secure: process.env.NODE_ENV === 'production', // Requires HTTPS in production
    sameSite: 'strict',
    path: '/', // Accessible across the whole site
    expires: expirationDate
  });
}

export async function getCookies() {   
  const cookie = (await cookies()).get(`company_id`)?.value;
  return `${cookie}`;
}