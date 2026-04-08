"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

function ArrowIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const floatTransition = reduce
    ? { duration: 0 }
    : {
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: [0.45, 0, 0.55, 1] as const,
      };

  return (
    <section id="inicio" className="relative overflow-hidden hero-bg">
      <div className="relative mx-auto max-w-6xl px-6 pb-28 pt-36 sm:px-8 sm:pb-32 sm:pt-40 lg:min-h-[min(92vh,920px)] lg:pb-40 lg:pt-44">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex rounded-full border border-white/20 bg-white/[0.07] px-4 py-1.5 text-xs font-medium text-white/85 backdrop-blur-sm"
          >
            Scouting inteligente para el fútbol uruguayo
          </motion.div>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06 }}
            className="mt-8 text-balance text-4xl font-semibold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]"
          >
            Descubrí el talento que{" "}
            <span className="bg-gradient-to-r from-accent-soft via-accent to-sky-300 bg-clip-text text-transparent">
              nadie está mirando
            </span>
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg"
          >
            La IA analiza grabaciones de partidos en el interior de Uruguay y señala jugadores
            juveniles que merecen una visita. Su club recibe contexto por posición y rendimiento:
            sabe exactamente a quién ir a ver y dónde.
          </motion.p>
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.18 }}
            className="mx-auto mt-5 max-w-xl text-sm italic text-white/55"
          >
            Este jugador promete. Ir a verlo. La IA orienta al ojeador; no lo sustituye.
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.22 }}
            className="mt-10 flex justify-center"
          >
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-white shadow-[0_16px_50px_-12px_rgba(59,130,246,0.65)] transition hover:bg-accent-soft hover:shadow-[0_20px_56px_-12px_rgba(96,165,250,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft"
            >
              Solicitar acceso
              <ArrowIcon />
            </Link>
          </motion.div>
        </div>

        {/* Floating glass cards */}
        <motion.div
          className="glass-panel pointer-events-none absolute left-4 top-[52%] z-[5] hidden max-w-[220px] p-4 text-left text-white shadow-[0_20px_60px_-20px_rgba(99,102,241,0.35)] xl:left-0 xl:block"
          initial={false}
          animate={reduce ? {} : { y: [0, -10, 0] }}
          transition={floatTransition}
        >
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/55">
            Jugador destacado
          </p>
          <p className="mt-2 text-sm font-semibold">#10 · Salto FC</p>
          <p className="mt-1 text-xs text-white/65">Extremo derecho</p>
          <p className="mt-3 text-xs font-medium text-accent-soft">Potencial 8.7/10</p>
        </motion.div>

        <motion.div
          className="glass-panel-strong pointer-events-none absolute right-4 top-[48%] z-[5] hidden max-w-[240px] p-4 text-left text-white xl:right-0 xl:block"
          initial={false}
          animate={reduce ? {} : { y: [0, 12, 0] }}
          transition={
            reduce
              ? { duration: 0 }
              : {
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: [0.45, 0, 0.55, 1] as const,
                }
          }
        >
          <p className="text-[10px] font-semibold uppercase tracking-wider text-accent-soft">
            Nuevo análisis
          </p>
          <p className="mt-2 text-sm font-semibold">Rivera vs Young</p>
          <p className="mt-2 text-xs text-white/70">3 jugadores recomendados</p>
          <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        </motion.div>

        {/* Mobile / tablet: stacked preview cards */}
        <div className="relative z-[5] mx-auto mt-16 grid max-w-lg gap-4 lg:hidden">
          <div className="glass-panel p-4 text-white">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/55">
              Jugador destacado
            </p>
            <p className="mt-2 text-sm font-semibold">#10 · Salto FC · Extremo derecho</p>
            <p className="mt-2 text-xs font-medium text-accent-soft">Potencial 8.7/10</p>
          </div>
          <div className="glass-panel-strong p-4 text-white">
            <p className="text-[10px] font-semibold uppercase text-accent-soft">Nuevo análisis</p>
            <p className="mt-1 text-sm font-semibold">Rivera vs Young</p>
            <p className="text-xs text-white/70">3 jugadores recomendados</p>
          </div>
        </div>
      </div>

      {/* Separador inferior tipo “panza”: un solo arco redondo (simétrico), no onda */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[4] w-full overflow-hidden leading-[0]"
        aria-hidden
      >
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="block h-16 w-full min-w-full text-canvas sm:h-[5.25rem] md:h-24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M0,28 Q720,118 1440,28 L1440,120 L0,120 Z"
          />
        </svg>
      </div>
    </section>
  );
}

