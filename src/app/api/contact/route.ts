import { NextResponse } from "next/server";

import { createRouteHandlerSupabase } from "@/lib/supabase/route-handler";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      message?: string;
    };

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || name.length > 120) {
      return NextResponse.json({ error: "Nombre inválido" }, { status: 400 });
    }
    if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }
    if (!message || message.length > 4000) {
      return NextResponse.json({ error: "Mensaje inválido" }, { status: 400 });
    }

    const supabase = createRouteHandlerSupabase();
    if (!supabase) {
      console.error("[contact] Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
      return NextResponse.json({ error: "Configuración del servidor incompleta" }, { status: 503 });
    }

    const { error } = await supabase.from("contact_submissions").insert({
      name,
      email,
      message,
    });

    if (error) {
      console.error("[contact] Supabase insert:", error.message);
      return NextResponse.json({ error: "No se pudo guardar el mensaje" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }
}
