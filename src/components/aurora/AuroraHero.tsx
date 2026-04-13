import Image from "next/image";
import heroPlayer from "../../../imgs/bg-hero.jpg";

/** Panel interno: alineado al gris del JPG para multiply limpio */
const PANEL_BG = "#dfe6ec";
/** Fondo de la página (fuera del contenedor redondeado): más claro */
const PAGE_BG = "#f4f7fa";

export function AuroraHero() {
  return (
    <section
      id="product"
      className="relative min-h-screen overflow-hidden pt-20 text-[#111111]"
      style={{ backgroundColor: PAGE_BG }}
    >
      <div className="relative mx-auto min-h-[calc(100vh-5rem)] w-full max-w-[1700px] px-3 pb-4 sm:px-5 lg:px-8">
        <div
          className="relative isolate h-full min-h-0 overflow-hidden rounded-[28px] border border-black/[0.07] shadow-[0_18px_65px_-35px_rgba(0,0,0,0.22)] lg:min-h-[min(820px,92vh)]"
          style={{ backgroundColor: PANEL_BG }}
        >
          {/* Marca de agua: un poco más oscura que el fondo para leerse en claro */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-[-2%] z-[1] flex select-none justify-center"
            aria-hidden
          >
            <span
              className="font-black leading-none tracking-[-0.05em] [font-size:clamp(150px,22vw,380px)]"
              style={{ color: "#c5ccd4" }}
            >
              AIS
            </span>
          </div>

          {/* Móvil / tablet: figura apoyada en el borde inferior del panel, crece hacia arriba */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] flex justify-center lg:hidden">
            <div className="relative h-[min(58vh,560px)] w-[min(92vw,460px)] max-w-full sm:h-[min(56vh,580px)]">
              <Image
                src={heroPlayer}
                alt="Jugador AIS"
                fill
                priority
                quality={92}
                sizes="(max-width: 1023px) 92vw, 0"
                className="object-contain object-bottom mix-blend-multiply"
              />
            </div>
          </div>

          {/* Desktop: figura a la derecha, anclada abajo */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[4%] z-[2] hidden sm:top-[3%] lg:top-[2%] lg:block">
            <div className="relative mx-auto h-full w-full max-w-[min(680px,56vw)] min-h-[320px]">
              <Image
                src={heroPlayer}
                alt="Jugador AIS"
                fill
                priority
                quality={92}
                sizes="(max-width: 1024px) 96vw, 56vw"
                className="object-contain object-bottom mix-blend-multiply"
              />
            </div>
          </div>

          <div className="relative z-20 flex min-h-0 flex-col p-7 pb-8 max-lg:min-h-[min(calc(100dvh-5.5rem),880px)] sm:p-9 lg:min-h-0 lg:grid lg:min-h-[min(820px,92vh)] lg:grid-cols-[52%_48%] lg:p-12">
            <div className="ais-fade-up relative max-w-[640px] self-start pt-2 max-lg:pb-5 sm:max-lg:pb-6 lg:pb-0 lg:pt-6">
              <p className="text-sm text-black/55">
                |{" "}
                <span className="font-bold uppercase">A</span>
                rtificial <span className="font-bold uppercase">I</span>
                ntelligence <span className="font-bold uppercase">S</span>
                couting
              </p>
              <h1 className="mt-4 text-[clamp(40px,5.5vw,84px)] font-bold leading-[0.92] tracking-tight text-[#141414]">
                Descubrí el
                <br />
                talento que
                <br />
                nadie está
                <br />
                <span className="text-[#141414] underline decoration-[#00a8d4] decoration-4 underline-offset-[0.12em]">
                  mirando
                </span>
              </h1>
              <p className="mt-5 text-sm font-medium text-black/55">Proyecto en validación</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="inline-flex items-center rounded-full bg-black px-7 py-3 text-sm font-semibold text-white transition hover:scale-[1.02]"
                >
                  Solicitar acceso →
                </button>
                <button
                  type="button"
                  className="inline-flex items-center rounded-full bg-white px-7 py-3 text-sm font-medium text-black/75 shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                >
                  Ver plataforma
                </button>
              </div>
            </div>

            <div className="hidden min-h-[200px] lg:block" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
