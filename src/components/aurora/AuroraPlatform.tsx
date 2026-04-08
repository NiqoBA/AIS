import Image from "next/image";

function UruguayMapMock() {
  return (
    <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl border border-cyan-500/25 bg-[#050a0e]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "var(--aurora-pcb-bg)",
          backgroundSize: "320px 320px",
          backgroundRepeat: "repeat",
        }}
        aria-hidden
      />
      <svg
        viewBox="0 0 200 280"
        className="absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)] text-cyan-500/30"
        aria-hidden
      >
        <path
          fill="currentColor"
          fillOpacity="0.15"
          stroke="rgba(0,242,255,0.35)"
          strokeWidth="1"
          d="M95 20 L120 35 L135 55 L140 85 L155 120 L165 160 L158 200 L145 235 L115 255 L85 250 L55 230 L40 195 L35 155 L42 115 L55 80 L70 50 Z"
        />
      </svg>
      <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-black uppercase tracking-[0.2em] text-white/10">
        Uruguay
      </p>
      {[
        { t: 28, l: 42, c: "bg-cyan-400" },
        { t: 45, l: 58, c: "bg-amber-500" },
        { t: 62, l: 38, c: "bg-cyan-400" },
        { t: 38, l: 72, c: "bg-lime-400" },
        { t: 72, l: 52, c: "bg-amber-500" },
      ].map((d, i) => (
        <span
          key={i}
          className={`absolute h-2 w-2 rounded-full ${d.c} shadow-[0_0_10px_currentColor]`}
          style={{ top: `${d.t}%`, left: `${d.l}%` }}
        />
      ))}
      <div className="absolute bottom-4 left-4 flex flex-wrap gap-4 text-[10px] uppercase tracking-wider text-slate-500">
        <span>
          <span className="mr-1 inline-block h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f2ff]" />{" "}
          Partidos analizados
        </span>
        <span>
          <span className="mr-1 inline-block h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_#ff9d00]" />{" "}
          Jugadores detectados
        </span>
      </div>
    </div>
  );
}

export function AuroraPlatform() {
  return (
    <section className="aurora-dark-surface border-t border-cyan-500/10 px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
      <div className="flex flex-col gap-10 lg:gap-12">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400/80">
            Cuadrícula de inteligencia
          </p>
          <h2 className="mt-2 text-xl font-bold uppercase tracking-wide text-white sm:text-2xl">
            De la cancha al podio
          </h2>
          <p className="mt-3 max-w-md text-sm text-slate-400">
            Mapa en vivo de detecciones en Salto, Rivera, Young y Fray Bentos, vinculado a fichas de
            recomendación para tu equipo de scouting.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <UruguayMapMock />

          <div className="flex flex-col gap-6">
            <div className="glass-aurora overflow-hidden rounded-2xl p-2">
              <Image
                src="/imgs/jugador.jpg"
                alt="Seguimiento de jugadores y analítica en vivo"
                width={900}
                height={560}
                className="w-full rounded-xl object-cover"
                sizes="(max-width: 1024px) 100vw, 90vw"
              />
            </div>

            <div className="glass-aurora rounded-xl border border-teal-400/30 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-teal-300">
                    Alerta de jugador
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">Mateo Rossi</p>
                  <p className="text-xs text-slate-400">ED · 17 · Salto, Uruguay</p>
                </div>
                <span className="rounded border border-amber-400/40 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-300">
                  Alto potencial
                </span>
              </div>
              <p className="mt-3 border-l-2 border-teal-400/50 pl-3 text-xs leading-relaxed text-slate-300">
                La IA recomienda visita en vivo: juego explosivo por la banda, victorias repetidas en
                el 1c1 y señales de gol en los últimos tres partidos analizados.
              </p>
              <button
                type="button"
                className="mt-4 w-full rounded-md bg-teal-400/90 py-2.5 text-xs font-bold uppercase tracking-wide text-[#050a0e]"
              >
                Ver perfil completo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
