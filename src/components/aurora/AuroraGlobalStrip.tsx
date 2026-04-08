export function AuroraGlobalStrip() {
  return (
    <div className="border-y border-cyan-500/20 px-5 py-3 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-[1920px] flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400">
          Analítica global
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-slate-400">
          <span>
            <span className="font-semibold text-white">15.230</span> jugadores analizados
          </span>
          <span>
            <span className="font-semibold text-white">2.711</span> partidos procesados
          </span>
          <span>
            <span className="font-semibold text-amber-400">18</span> alertas de talento enviadas
          </span>
        </div>
      </div>
    </div>
  );
}
