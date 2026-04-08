import Image from "next/image";

export function AuroraPostHowItWorks() {
  return (
    <section className="px-5 pb-20 pt-8 sm:px-8 lg:px-10 lg:pb-28">
      <div className="mx-auto w-full max-w-6xl space-y-8 lg:space-y-10">
        <div className="text-center">
          <h2 className="text-balance text-lg font-black uppercase leading-snug tracking-[0.08em] text-white sm:text-xl md:text-2xl">
            Tu próximo crack, identificado
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-8 xl:gap-10">
          <article className="relative w-full self-start overflow-hidden rounded-2xl border border-cyan-500/20 bg-[#050a0e] shadow-[0_0_50px_-18px_rgba(0,242,255,0.35)]">
            <Image
              src="/imgs/jugador2.0.jpg"
              alt="Antes y después: del talento invisible a jugador profesional"
              width={1024}
              height={630}
              className="h-auto w-full"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </article>

          <article className="relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl border border-cyan-500/20 bg-[#050a0e] shadow-[0_0_40px_-16px_rgba(0,242,255,0.3)]">
            <div className="relative min-h-[180px] flex-1 sm:min-h-[200px]">
              <Image
                src="/imgs/your-next-wonderkid.jpg"
                alt="Panel Aurora: mapa de Uruguay y jugadores recomendados"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050a0e]/30 via-transparent to-transparent"
                aria-hidden
              />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
