"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

type AuthFormProps = {
  /** Ruta post login exitoso (sign-in). */
  redirectAfterLogin?: string;
  /** Estilo del formulario (p. ej. pantalla /login oscura). */
  variant?: "light" | "dark";
};

export function AuthForm({
  redirectAfterLogin = "/panel",
  variant = "light",
}: AuthFormProps) {
  const isDark = variant === "dark";
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
        router.push(redirectAfterLogin);
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
    <div
      className={
        isDark
          ? "w-full max-w-md rounded-2xl border border-zinc-800 bg-[#111827] p-6 shadow-xl sm:p-8"
          : "w-full max-w-md rounded-[28px] border border-black/[0.08] bg-white p-6 shadow-[0_18px_65px_-35px_rgba(0,0,0,0.22)] sm:p-8"
      }
    >
      <div
        className={
          isDark
            ? "mb-6 flex gap-2 rounded-xl bg-zinc-900/80 p-1"
            : "mb-6 flex gap-2 rounded-xl bg-black/[0.05] p-1"
        }
      >
        <button
          type="button"
          onClick={() => setMode("signin")}
          className={`w-1/2 rounded-lg px-3 py-2 text-sm font-medium transition ${
            mode === "signin"
              ? isDark
                ? "bg-zinc-800 text-zinc-50 shadow-sm"
                : "bg-white text-[#111111] shadow-sm"
              : isDark
                ? "text-zinc-400"
                : "text-black/55"
          }`}
        >
          {"Iniciar sesi\u00f3n"}
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`w-1/2 rounded-lg px-3 py-2 text-sm font-medium transition ${
            mode === "signup"
              ? isDark
                ? "bg-zinc-800 text-zinc-50 shadow-sm"
                : "bg-white text-[#111111] shadow-sm"
              : isDark
                ? "text-zinc-400"
                : "text-black/55"
          }`}
        >
          Registrarse
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block text-sm">
          <span
            className={`mb-1 block ${isDark ? "text-zinc-300" : "text-black/55"}`}
          >
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={
              isDark
                ? "w-full rounded-lg border border-zinc-700 bg-zinc-950/60 px-3 py-2 text-zinc-100 outline-none ring-emerald-500/30 focus:ring"
                : "w-full rounded-lg border border-black/[0.12] bg-white px-3 py-2 text-[#111111] outline-none ring-black/10 focus:ring-2"
            }
            placeholder="club@ejemplo.com"
          />
        </label>

        <label className="block text-sm">
          <span
            className={`mb-1 block ${isDark ? "text-zinc-300" : "text-black/55"}`}
          >
            {"Contrase\u00f1a"}
          </span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={
              isDark
                ? "w-full rounded-lg border border-zinc-700 bg-zinc-950/60 px-3 py-2 text-zinc-100 outline-none ring-emerald-500/30 focus:ring"
                : "w-full rounded-lg border border-black/[0.12] bg-white px-3 py-2 text-[#111111] outline-none ring-black/10 focus:ring-2"
            }
            placeholder="Min. 6 caracteres"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className={
            isDark
              ? "w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:opacity-60"
              : "w-full rounded-full bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-black/90 disabled:opacity-60"
          }
        >
          {loading
            ? "Procesando..."
            : mode === "signup"
              ? "Crear cuenta"
              : "Entrar"}
        </button>
      </form>

      {message ? (
        <p className={`mt-4 text-sm ${isDark ? "text-zinc-400" : "text-black/55"}`}>
          {message}
        </p>
      ) : null}
    </div>
  );
}
