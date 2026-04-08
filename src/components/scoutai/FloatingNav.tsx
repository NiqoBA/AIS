"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const links = [
  { href: "#inicio", label: "Inicio" },
  { href: "#caracteristicas", label: "Características" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#contacto", label: "Contacto" },
] as const;

export function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={[
        "fixed inset-x-0 top-0 z-50 w-full border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-out",
        scrolled
          ? "border-white/10 bg-[#060b24]/95 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          : "border-transparent bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6 sm:h-[4.25rem] sm:px-8 lg:px-10">
        <Link
          href="#inicio"
          className="shrink-0 text-lg font-semibold tracking-tight text-white transition-opacity hover:opacity-90"
        >
          ScoutAI
        </Link>
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/auth"
            className="hidden rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/50 hover:bg-white/10 sm:inline-flex"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/auth"
            className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_40px_-8px_rgba(59,130,246,0.55)] transition hover:bg-accent-soft hover:shadow-[0_16px_48px_-8px_rgba(96,165,250,0.45)]"
          >
            Solicitar acceso
          </Link>
        </div>
      </div>
    </motion.header>
  );
}


