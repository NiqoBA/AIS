import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  const sp = await searchParams;
  const nextPath = sp?.next && sp.next.startsWith("/") ? sp.next : "/dashboard";

  return (
    <main className="min-h-dvh bg-[#f4f7fa] px-6 py-16 text-[#111111]">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <section className="max-w-xl">
          <Link
            href="/"
            className="text-sm font-medium text-black/55 underline decoration-black/15 underline-offset-4 hover:text-[#111111]"
          >
            ← Volver al inicio
          </Link>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#141414] sm:text-4xl">
            AIS — Acceso veedores
          </h1>
          <p className="mt-3 text-base leading-relaxed text-black/55">
            Iniciá sesión con tu cuenta de Supabase para acceder al panel de
            scouting.
          </p>
        </section>

        <AuthForm redirectAfterLogin={nextPath} />
      </div>
    </main>
  );
}
