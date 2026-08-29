import { cookies } from "next/headers";
export async function getSuspendedOrders() {

  try {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return null;
  }

  const res = await fetch(`${process.env.APP_URL}/api/pos/suspended`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });


  if (!res.ok) {
    return null;
  }

  const json = await res.json();  
  return json
} catch(e) {
   
  console.log(e);
}


}
