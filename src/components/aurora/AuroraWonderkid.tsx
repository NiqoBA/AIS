import Image from "next/image";

export function AuroraWonderkid() {
  return (
    <section
      id="for-clubs"
      className="aurora-dark-surface relative scroll-mt-24 border-t border-cyan-500/15"
    >
      <div className="relative min-h-[45vh] w-full sm:min-h-[50vh] md:min-h-[55vh]">
        <Image
          src="/imgs/your-next-wonderkid.jpg"
          alt="Tu próximo crack: del talento invisible a descubierto"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#050a0e] via-transparent to-transparent"
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-4 pb-8 pt-16 text-center">
          <span
            className="mb-2 text-cyan-300 drop-shadow-[0_0_12px_rgba(0,242,255,0.6)]"
            aria-hidden
          >
            ✦
          </span>
          <p className="max-w-lg text-lg font-extrabold uppercase leading-tight tracking-wide text-white/95 sm:text-xl md:text-2xl">
            Tu próximo crack, <span className="gradient-text-aurora">identificado</span>
          </p>
          <span className="mt-3 text-cyan-400/80" aria-hidden>
            ✦
          </span>
        </div>
      </div>
    </section>
  );
}
