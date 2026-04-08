const cities = ["Salto", "Young", "Fray Bentos", "Rivera"] as const;

export function Cities() {
  return (
    <section
      className="border-t border-slate-200/80 bg-surface py-20 sm:py-28"
      aria-labelledby="ciudades-heading"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <h2
          id="ciudades-heading"
          className="text-center text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
        >
          Ciudades cubiertas
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cities.map((city) => (
            <div
              key={city}
              className="rounded-3xl border border-slate-200/90 bg-canvas/40 px-6 py-8 text-center transition hover:border-slate-300 hover:shadow-[0_16px_48px_-24px_rgba(59,130,246,0.12)]"
            >
              <p className="text-lg font-semibold text-ink">{city}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-12 max-w-xl text-center text-base font-medium text-accent">
          Empezamos por el interior. Después, todo el país.
        </p>
      </div>
    </section>
  );
}
