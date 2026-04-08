"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export function AuthForm() {
  const router = useRouter();
  const supabase = createClient();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage(
          "Cuenta creada. Si tu proyecto exige confirmaci\u00f3n por email, revisa tu bandeja para completar el acceso.",
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/panel");
        router.refresh();
        return;
      }
    } catch (err) {
      const text = err instanceof Error ? err.message : "Error inesperado";
      setMessage(text);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex gap-2 rounded-xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setMode("signin")}
          className={`w-1/2 rounded-lg px-3 py-2 text-sm font-medium transition ${
            mode === "signin" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
          }`}
        >
          {"Iniciar sesi\u00f3n"}
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`w-1/2 rounded-lg px-3 py-2 text-sm font-medium transition ${
            mode === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
          }`}
        >
          Registrarse
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block text-sm">
          <span className="mb-1 block text-slate-700">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-accent/40 focus:ring"
            placeholder="club@ejemplo.com"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-slate-700">{"Contrase\u00f1a"}</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-accent/40 focus:ring"
            placeholder="Min. 6 caracteres"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-soft disabled:opacity-60"
        >
          {loading
            ? "Procesando..."
            : mode === "signup"
              ? "Crear cuenta"
              : "Entrar"}
        </button>
      </form>

      {message ? <p className="mt-4 text-sm text-slate-600">{message}</p> : null}
    </div>
  );
}
