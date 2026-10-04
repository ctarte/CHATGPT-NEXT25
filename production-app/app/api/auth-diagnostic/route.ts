import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  let projectRef = "not-configured";
  try {
    const host = new URL(raw).hostname;
    projectRef = host.endsWith(".supabase.co") ? host.split(".")[0] : "configured-nonstandard-host";
  } catch {
    projectRef = raw ? "configured-invalid-url" : "not-configured";
  }
  return NextResponse.json({ projectRef });
}
