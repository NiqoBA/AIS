import Link from "next/link";

const footerLinks = [
  { href: "#caracteristicas", label: "Características" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "/auth", label: "Acceso" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#060b24] py-14 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 lg:items-start">
        <div className="text-center sm:text-left">
          <p className="text-lg font-semibold tracking-tight">ScoutAI</p>
          <p className="mt-2 max-w-xs text-sm text-white/55">
            Scouting asistido por IA para el fútbol uruguayo.
          </p>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 sm:justify-start">
          {footerLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-white/65 transition hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div
          id="contacto"
          className="scroll-mt-28 text-center sm:text-left lg:text-right"
        >
          <a
            href="mailto:contacto@scoutai.uy"
            className="text-sm text-accent-soft transition hover:text-white"
          >
            contacto@scoutai.uy
          </a>
        </div>
      </div>
      <p className="mt-10 text-center text-xs text-white/40">
        © {new Date().getFullYear()} ScoutAI. Todos los derechos reservados.
      </p>
    </footer>
  );
}

