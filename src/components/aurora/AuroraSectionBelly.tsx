/** Transición curva (panza) entre bloques de color */
export function AuroraSectionBelly() {
  return (
    <div className="pointer-events-none relative z-10 -mt-px w-full leading-[0]" aria-hidden>
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="aurora-belly-fill block h-12 w-full min-w-full sm:h-16 md:h-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path fill="currentColor" d="M0,28 Q720,118 1440,28 L1440,120 L0,120 Z" />
      </svg>
    </div>
  );
}
