import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { createClient } from "@/lib/supabase/server";

export default async function PanelPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, created_at")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main className="min-h-dvh bg-canvas px-6 py-14">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-ink">Panel de control (MVP)</h1>
          <SignOutButton />
        </div>

        <p className="mt-4 text-sm text-muted">Sesión autenticada con Supabase.</p>

        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 p-4">
            <dt className="text-xs uppercase text-slate-500">Usuario</dt>
            <dd className="mt-1 text-sm text-slate-800">{profile?.full_name ?? "Sin nombre"}</dd>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <dt className="text-xs uppercase text-slate-500">Email</dt>
            <dd className="mt-1 text-sm text-slate-800">{profile?.email ?? user.email}</dd>
          </div>
        </dl>

        <div className="mt-8">
          <Link href="/" className="text-sm text-accent hover:text-accent-soft">
            Ir a la landing
          </Link>
        </div>
      </div>
    </main>
  );
}
