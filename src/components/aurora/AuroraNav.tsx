"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/soon", label: "Producto" },
  { href: "/soon", label: "Características" },
  { href: "/soon", label: "Cómo funciona" },
  { href: "/soon", label: "Precios" },
] as const;

export function AuroraNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled((typeof window !== "undefined" ? window.scrollY : 0) > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[60] border-b transition-[background-color,box-shadow,backdrop-filter] duration-200 ${
        scrolled
          ? "border-black/[0.08] bg-white/95 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] backdrop-blur-md"
          : "border-black/[0.06] bg-[#f4f7fa]/92 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto grid h-[4.25rem] w-full max-w-[1920px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-5 sm:px-8 lg:gap-6 lg:px-12 xl:px-16">
        <Link
          href="/"
          className="justify-self-start text-base font-bold tracking-[0.12em] text-[#111111] sm:text-lg"
        >
          AIS
        </Link>

        <nav className="hidden items-center justify-center gap-6 lg:flex xl:gap-8">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.14em] text-[#111111]/80 transition hover:text-[#111111]"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
          <Link
            href="/contact"
            className="hidden rounded-full border border-[#111111] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#111111] transition hover:bg-black/[0.04] sm:inline-flex sm:px-5 sm:text-[11px]"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/contact"
            className="inline-flex rounded-full bg-black px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-black/90 sm:px-5 sm:text-[11px]"
          >
            Contacto
          </Link>
        </div>
      </div>
    </header>
  );
}
