import Image from "next/image";

const steps = [
  {
    step: "1.",
    title: "Subida y procesamiento",
    desc: "Procesamiento del partido: análisis con IA activo en cada grabación del interior.",
    img: "/imgs/how-it-works-1.jpg",
    showProgress: true,
  },
  {
    step: "2.",
    title: "Perfilado de jugadores",
    desc: "Métricas radar, puntuaciones de potencial y perfiles estructurados por posición.",
    img: "/imgs/how-it-works-2.jpg",
    showProgress: false,
  },
  {
    step: "3.",
    title: "Recomendaciones accionables",
    desc: "Alertas con contexto del club, mapa y a quién ver en vivo después.",
    img: "/imgs/how-it-works-3.jpg",
    showProgress: false,
  },
] as const;

export function AuroraHowItWorks() {
  return (
    <section id="features" className="scroll-mt-24 px-5 pb-20 pt-10 sm:px-8 sm:pt-12 lg:px-10 lg:pb-24 lg:pt-14">
      <h2 className="text-center text-2xl font-extrabold uppercase tracking-[0.1em] text-white sm:text-3xl lg:text-4xl">
        Cómo funciona
      </h2>
      <div className="relative mx-auto mt-12 max-w-6xl">
        <div
          className="pointer-events-none absolute left-[8%] right-[8%] top-[42%] hidden h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent lg:block"
          aria-hidden
        />

        <div className="grid items-stretch gap-10 lg:grid-cols-3 lg:gap-9">
          {steps.map((step, i) => {
            const isCamera = step.showProgress;
            const isMiddle = i === 1;
            const orderClass =
              isCamera ? "lg:order-1" : i === 1 ? "lg:order-2" : "lg:order-3";
            return (
            <div
              key={step.title}
              className={`flex h-full flex-col items-center text-center transition-transform duration-300 ${
                isMiddle ? "relative z-10 lg:scale-[1.08]" : "relative z-0 lg:scale-[0.96]"
              } ${orderClass}`}
            >
              <h3 className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white sm:text-xs">
                <span className="mr-1.5 text-cyan-300">{step.step}</span>
                {step.title}
              </h3>
              <div
                className={`glass-aurora relative w-full overflow-hidden rounded-2xl p-1.5 ${
                  isCamera
                    ? "border-cyan-300/40 shadow-[0_0_48px_-8px_rgba(14,165,233,0.45)]"
                    : "border-cyan-500/20"
                }`}
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                  <Image
                    src={step.img}
                    alt={step.title}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 300px"
                  />
                </div>
              </div>

              <div className="mt-4 h-[34px] w-full max-w-xs px-2">
                {step.showProgress ? (
                  <>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full w-[72%] rounded-full bg-gradient-to-r from-cyan-400 to-lime-400"
                        style={{ boxShadow: "0 0 12px rgba(0,242,255,0.5)" }}
                      />
                    </div>
                    <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-slate-500">
                      Procesando partido · Análisis con IA activo
                    </p>
                  </>
                ) : null}
              </div>

            </div>
          )})}
        </div>
      </div>
    </section>
  );
}
