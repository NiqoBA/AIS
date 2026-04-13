"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type SignOutButtonProps = {
  redirectTo?: string;
  className?: string;
};

export function SignOutButton({
  redirectTo = "/",
  className = "rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50",
}: SignOutButtonProps) {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <button onClick={signOut} type="button" className={className}>
      Cerrar sesión
    </button>
  );
}
