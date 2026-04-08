const steps = [
  {
    n: "01",
    title: "Grabación en el interior",
    body: "Se documentan partidos en ciudades donde hoy es difícil mantener presencia continua de ojeadores.",
  },
  {
    n: "02",
    title: "Análisis con IA",
    body: "La plataforma procesa video y extrae métricas e insights por jugador, con foco en posición y desempeño observado.",
  },
  {
    n: "03",
    title: "Recomendaciones al club",
    body: "Su institución recibe listas accionables por posición: perfiles priorizados según criterios técnicos acordados.",
  },
  {
    n: "04",
    title: "Visita con criterio",
    body: "El ojeador viaja sabiendo exactamente a quién mirar y en qué contexto jugó. Menos idas a ciegas.",
  },
] as const;

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="scroll-mt-28 border-t border-slate-200/80 bg-canvas py-20 sm:py-28"
      aria-labelledby="como-heading"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <h2
          id="como-heading"
          className="text-center text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
        >
          Cómo funciona
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-base text-muted">
          Cuatro pasos, sin reemplazar el juicio profesional en cancha.
        </p>
        <div className="mt-16 grid grid-cols-1 gap-12 border-t border-slate-200/80 pt-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {steps.map((s) => (
            <div key={s.n} className="relative">
              <span className="text-sm font-bold tabular-nums text-accent">{s.n}</span>
              <h3 className="mt-3 text-lg font-semibold tracking-tight text-ink">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
