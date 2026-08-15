import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { NextResponse } from "next/server";

export async function GET() {
  const env = getSupabaseEnv();

  if (!env) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local",
      },
      { status: 503 },
    );
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.getSession();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Supabase client connected",
      url: env.url,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
