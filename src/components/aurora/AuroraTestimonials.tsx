const quotes = [
  {
    quote:
      "Aurora convirtió nuestras salidas al interior en visitas con objetivo. Por fin vemos el interior como una cantera, no como una lotería.",
    name: "Martín García",
    role: "Jefe de ojeo",
  },
  {
    quote:
      "Los mapas de calor y el flujo de alertas encajan con cómo briefeamos a los entrenadores. Menos ruido y decisiones más rápidas sobre a quién ver en vivo.",
    name: "Laura Fernández",
    role: "Directora deportiva",
  },
  {
    quote:
      "En el primer mes redujimos a la mitad los viajes a ciegas. El mapa y las fichas de jugadores son justo lo que el staff necesitaba.",
    name: "Diego Silva",
    role: "Jefe de scouts",
  },
] as const;

export function AuroraTestimonials() {
  return (
    <section
      id="demo"
      className="aurora-dark-surface scroll-mt-24 border-t border-cyan-500/10 px-5 py-20 sm:px-8 lg:px-10"
    >
      <h2 className="text-center text-xs font-bold uppercase tracking-[0.35em] text-cyan-400/90">
        De la cancha al podio
      </h2>
      <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-3">
        {quotes.map((q) => (
          <article
            key={q.name}
            className="glass-aurora flex flex-col rounded-2xl p-6"
          >
            <p className="text-sm leading-relaxed text-slate-300">&ldquo;{q.quote}&rdquo;</p>
            <div className="mt-6 flex items-center gap-3 border-t border-cyan-500/10 pt-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10 text-xs font-bold text-cyan-300">
                {q.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{q.name}</p>
                <p className="text-xs text-slate-500">{q.role}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mx-auto mt-16 flex max-w-4xl flex-wrap items-center justify-center gap-8 opacity-60 grayscale transition hover:opacity-90 hover:grayscale-0">
        <span className="text-lg font-black tracking-tight text-white">Peñarol</span>
        <span className="text-lg font-black tracking-tight text-white">Nacional</span>
        <span className="text-lg font-bold tracking-wide text-white">Defensor</span>
        <span className="text-lg font-bold tracking-wide text-white">Liverpool</span>
      </div>
    </section>
  );
}
