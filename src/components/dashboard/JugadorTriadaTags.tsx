"use client";

import { useMemo } from "react";

import { jugadorTriadaDemo } from "@/components/dashboard/jugadorInformeDemo";
import type { JugadorMapa } from "@/components/dashboard/jugadoresMapaData";

function fmt(n: number) {
  return n.toFixed(1).replace(".", ",");
}

export function JugadorTriadaTags({
  j,
  compact,
}: {
  j: JugadorMapa;
  compact?: boolean;
}) {
  const t = useMemo(() => jugadorTriadaDemo(j), [j]);
  const pill =
    compact
      ? "rounded px-1 py-px text-[8px]"
      : "rounded-md px-1.5 py-0.5 text-[9px] sm:text-[10px]";
  return (
    <div
      className={`flex flex-wrap gap-1 ${compact ? "mt-0.5" : "mt-1.5"}`}
      aria-label="Características demo: físico, técnica e inteligencia"
    >
      <span
        className={`border border-emerald-700/20 bg-emerald-50 font-semibold tabular-nums text-emerald-900 ${pill}`}
      >
        Fís. {fmt(t.fisico)}
      </span>
      <span
        className={`border border-blue-700/20 bg-blue-50 font-semibold tabular-nums text-blue-900 ${pill}`}
      >
        Téc. {fmt(t.tecnica)}
      </span>
      <span
        className={`border border-violet-700/20 bg-violet-50 font-semibold tabular-nums text-violet-900 ${pill}`}
      >
        Int. {fmt(t.inteligencia)}
      </span>
    </div>
  );
}
