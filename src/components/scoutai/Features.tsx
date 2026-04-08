import type { ComponentType } from "react";
import Link from "next/link";

function IconVideo() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="2"
        y="5"
        width="14"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M16 10l4-2v8l-4-2v-4Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconChart() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 19V5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M4 19h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path
        d="M8 15v-4M12 15V8M16 15v-6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconBell() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M18 16v-5a6 6 0 1 0-12 0v5l-2 2h16l-2-2Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconFilter() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6h16M7 12h10M10 18h4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconExport() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 15V3m0 0l4 4m-4-4L8 7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconMap() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 18 3 15V3l6 3 6-3 6 3v12l-6-3-6 3-6-3Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M9 3v15" stroke="currentColor" strokeWidth="1.75" />
      <path d="M15 6v15" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

const rowA = [
  {
    icon: IconVideo,
    title: "Análisis de video automático",
    desc: "Procesamiento de grabaciones de partidos con modelos de visión y lenguaje adaptados al contexto del fútbol amateur.",
    featured: true as const,
  },
  {
    icon: IconChart,
    title: "Métricas por jugador y posición",
    desc: "Señales de rendimiento y rol en cancha para comparar perfiles con el plantel que su club necesita reforzar.",
    featured: false as const,
  },
  {
    icon: IconBell,
    title: "Alertas de jugadores destacados",
    desc: "Notificaciones cuando un perfil supera los umbrales acordados: priorizá viajes con mayor probabilidad de acierto.",
    featured: false as const,
  },
  {
    icon: IconFilter,
    title: "Filtros por ciudad, edad y posición",
    desc: "Salto, Young, Fray Bentos, Rivera y más: acotá búsquedas al mapa y al perfil técnico que busca la secretaría técnica.",
    featured: false as const,
  },
] as const;

const rowB = [
  {
    icon: IconExport,
    title: "Informes exportables",
    desc: "Resúmenes listos para compartir internamente con ojeadores y cuerpo técnico, sin depender de hojas sueltas.",
  },
  {
    icon: IconMap,
    title: "Cobertura en expansión",
    desc: "Misma metodología en nuevas sedes: criterios homogéneos para comparar talento entre regiones.",
  },
] as const;

function FeatureCard({
  icon: Icon,
  title,
  desc,
  featured,
}: {
  icon: ComponentType;
  title: string;
  desc: string;
  featured?: boolean;
}) {
  if (featured) {
    return (
      <article className="group relative flex flex-col rounded-3xl border border-white/10 bg-[#0a0f2e] p-8 text-white shadow-[0_24px_64px_-20px_rgba(59,130,246,0.35)]">
        <div className="text-accent-soft">
          <Icon />
        </div>
        <h3 className="mt-6 text-lg font-semibold tracking-tight">{title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-white/70">{desc}</p>
        <Link
          href="#como-funciona"
          className="mt-6 inline-flex text-sm font-medium text-accent-soft transition group-hover:text-white"
        >
          Ver más →
        </Link>
      </article>
    );
  }
  return (
    <article className="group flex flex-col rounded-3xl border border-slate-200/80 bg-surface p-8 shadow-[0_20px_50px_-28px_rgba(15,23,42,0.18)] transition hover:border-slate-300/90 hover:shadow-[0_24px_60px_-24px_rgba(59,130,246,0.12)]">
      <div className="text-accent">
        <Icon />
      </div>
      <h3 className="mt-6 text-lg font-semibold tracking-tight text-ink">{title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{desc}</p>
      <Link
        href="/auth"
        className="mt-6 inline-flex text-sm font-medium text-accent transition hover:text-accent-soft"
      >
        Ver más →
      </Link>
    </article>
  );
}

export function Features() {
  return (
    <section
      id="caracteristicas"
      className="scroll-mt-28 bg-canvas pb-20 pt-2 sm:pb-28 sm:pt-0"
      aria-labelledby="features-heading"
    >
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2
              id="features-heading"
              className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
            >
              Funcionalidades potenciadas por IA
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Herramientas pensadas para direcciones deportivas: menos ruido, más decisiones con
              contexto antes de mandar a un ojeador al interior.
            </p>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {rowA.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
          <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
            {rowB.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
    </section>
  );
}

