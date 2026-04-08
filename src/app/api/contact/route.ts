import { NextResponse } from "next/server";

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

    // En producción podés conectar esto a email, Supabase, etc.
    console.info("[contact]", { name, email, message: message.slice(0, 500) });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }
}
