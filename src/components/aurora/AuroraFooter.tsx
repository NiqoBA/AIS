import Link from "next/link";

const social = [
  { label: "Facebook", href: "#", icon: "f" },
  { label: "Instagram", href: "#", icon: "◎" },
  { label: "LinkedIn", href: "#", icon: "in" },
  { label: "X", href: "#", icon: "𝕏" },
] as const;

export function AuroraFooter() {
  return (
    <footer className="aurora-dark-surface border-t border-cyan-500/15 px-5 py-14 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-[1920px] flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-bold tracking-[0.15em] text-white">
            AURORA <span className="text-cyan-400">FOOTBALL</span>
          </p>
          <p className="mt-2 max-w-xs text-sm text-slate-500">
            Scouting con IA sobre talento uruguayo: de las canchas del interior a los radares
            profesionales.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-slate-400">
          <Link href="/#product" className="hover:text-cyan-300">
            Producto
          </Link>
          <Link href="/#features" className="hover:text-cyan-300">
            Funciones
          </Link>
          <Link href="/#for-clubs" className="hover:text-cyan-300">
            Para clubes
          </Link>
          <Link href="/auth" className="hover:text-cyan-300">
            Iniciar sesión
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          {social.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-500/25 text-xs text-cyan-300 transition hover:border-cyan-400 hover:bg-cyan-500/10"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-[1920px] flex-col items-center justify-between gap-4 border-t border-cyan-500/10 pt-8 sm:flex-row">
        <p className="text-xs text-slate-600">© {new Date().getFullYear()} Aurora Football</p>
        <Link
          href="/auth"
          className="btn-aurora-outline rounded-md px-6 py-2.5 text-[11px]"
        >
          Reservar una demo
        </Link>
      </div>
    </footer>
  );
}
