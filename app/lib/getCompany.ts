import { uuid } from "@/engine/utils/crypto";

export const dynamic = 'force-dynamic'
export async function getCompany() {
  const res = await fetch(`${process.env.APP_URL}/api/company?uid=${uuid()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  const json = await res.json();
  return json.data ?? null;
}

