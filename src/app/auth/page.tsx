import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { createClient } from "@/lib/supabase/server";

export default async function AuthPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/panel");

  return (
    <main className="min-h-dvh bg-canvas px-6 py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <section className="max-w-xl">
          <Link href="/" className="text-sm text-muted hover:text-ink">
            ← Volver al inicio
          </Link>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Acceso a Aurora Football
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted">
            Inicio de sesión y registro básico con Supabase Auth, integrado al proyecto fútbol.
          </p>
        </section>

        <AuthForm />
      </div>
    </main>
  );
}
