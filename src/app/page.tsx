import { redirect } from "next/navigation";
import { pickLocaleFromHeader } from "@/i18n/config";
import { headers } from "next/headers";

export default async function RootPage() {
  const h = await headers();
  const locale = pickLocaleFromHeader(h.get("accept-language"));
  redirect(`/${locale}`);
}
