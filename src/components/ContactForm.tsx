"use client";

import { useState } from "react";

export function ContactForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok) {
        setError(data.error ?? "No se pudo enviar. Probá de nuevo.");
        return;
      }

      setSent(true);
      form.reset();
    } catch {
      setError("Error de red. Probá de nuevo.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-md space-y-5 rounded-2xl border border-black/10 bg-white/90 p-8 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.12)]"
    >
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-[#111111]">Contacto</h2>
        <p className="mt-1 text-sm text-black/55">Dejanos un mensaje y te respondemos.</p>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-black/50">
          Nombre
        </span>
        <input
          name="name"
          type="text"
          required
          autoComplete="name"
          maxLength={120}
          className="w-full border border-black/15 bg-white px-3 py-2.5 text-sm text-[#111111] outline-none transition focus:border-black/35"
          placeholder="Tu nombre"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-black/50">
          Email
        </span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          maxLength={254}
          className="w-full border border-black/15 bg-white px-3 py-2.5 text-sm text-[#111111] outline-none transition focus:border-black/35"
          placeholder="vos@ejemplo.com"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-black/50">
          Mensaje
        </span>
        <textarea
          name="message"
          required
          rows={4}
          maxLength={4000}
          className="w-full resize-y border border-black/15 bg-white px-3 py-2.5 text-sm text-[#111111] outline-none transition focus:border-black/35"
          placeholder="¿En qué podemos ayudarte?"
        />
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {sent ? (
        <p className="text-sm font-medium text-black/70">Mensaje enviado. Gracias.</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-black py-3 text-sm font-semibold text-white transition enabled:hover:bg-black/90 disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Enviar"}
      </button>
    </form>
  );
}
