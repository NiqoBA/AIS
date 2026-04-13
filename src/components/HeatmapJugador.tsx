"use client";

import { useEffect, useMemo, useRef } from "react";

/** Demo: mediocampista — mayor densidad en el centro (250–450), algo de mediocampo propio (150–250), pocos en extremos. */
const DEFAULT_POSICIONES: HeatmapPosicion[] = [
  { x: 335, y: 175, value: 9 },
  { x: 360, y: 205, value: 10 },
  { x: 310, y: 195, value: 8 },
  { x: 390, y: 220, value: 9 },
  { x: 285, y: 225, value: 8 },
  { x: 420, y: 190, value: 7 },
  { x: 350, y: 245, value: 9 },
  { x: 320, y: 155, value: 7 },
  { x: 400, y: 255, value: 8 },
  { x: 270, y: 210, value: 8 },
  { x: 440, y: 200, value: 7 },
  { x: 340, y: 280, value: 6 },
  { x: 195, y: 200, value: 7 },
  { x: 220, y: 235, value: 6 },
  { x: 175, y: 175, value: 5 },
  { x: 115, y: 230, value: 4 },
  { x: 615, y: 215, value: 3 },
  { x: 655, y: 195, value: 4 },
];

const HEAT_W = 700;
const HEAT_H = 460;

export type HeatmapPosicion = { x: number; y: number; value: number };

type HeatmapJugadorProps = {
  /** Píxeles sobre la cancha 700×460; intensidad 0–10. Si se omite o vacío, datos de ejemplo (mediocampista). */
  posiciones?: HeatmapPosicion[];
};

/**
 * Mapa de calor de posicionamiento sobre cancha horizontal (heatmap.js, solo cliente).
 */
export default function HeatmapJugador({ posiciones }: HeatmapJugadorProps) {
  const heatmapLayerRef = useRef<HTMLDivElement>(null);

  const puntos = useMemo(() => {
    if (posiciones != null && posiciones.length > 0) return posiciones;
    return DEFAULT_POSICIONES;
  }, [posiciones]);

  useEffect(() => {
    const layer = heatmapLayerRef.current;
    if (!layer) return undefined;

    layer.innerHTML = "";

    let cancelled = false;

    void import("heatmap.js")
      .then((mod) => {
        if (cancelled) return;
        const el = heatmapLayerRef.current;
        if (!el) return;

        el.innerHTML = "";

        const instance = mod.default.create({
          container: el,
          width: HEAT_W,
          height: HEAT_H,
          radius: 55,
          maxOpacity: 0.8,
          minOpacity: 0.1,
          blur: 0.85,
        });

        instance.setData({
          max: 10,
          min: 0,
          data: puntos,
        });
      })
      .catch(() => {
        /* heatmap.js solo en cliente */
      });

    return () => {
      cancelled = true;
      if (heatmapLayerRef.current) {
        heatmapLayerRef.current.innerHTML = "";
      }
    };
  }, [posiciones]);

  return (
    <div
      className="relative mx-auto"
      style={{
        position: "relative",
        width: HEAT_W,
        height: HEAT_H,
      }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        style={{ position: "absolute", inset: 0 }}
        viewBox="0 0 700 460"
        preserveAspectRatio="none"
        aria-hidden
      >
        <title>Cancha de fútbol (horizontal)</title>
        <rect x="0" y="0" width="700" height="460" fill="#2d6a3f" />

        <g fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinejoin="round">
          <rect x="0" y="0" width="700" height="460" />

          {/* Línea del medio (vertical, x = 350) */}
          <line x1="350" y1="0" x2="350" y2="460" />

          {/* Círculo central */}
          <circle cx="350" cy="230" r="62" />
          <circle cx="350" cy="230" r="3" fill="#ffffff" stroke="none" />

          {/* Área grande izquierda: x=20 … x=120 */}
          <rect x="20" y="94" width="100" height="272" />
          {/* Área grande derecha: x=580 … x=680 */}
          <rect x="580" y="94" width="100" height="272" />

          {/* Área chica / arco izquierdo: x=20 … x=60 */}
          <rect x="20" y="158" width="40" height="144" />
          {/* Área chica / arco derecho: x=640 … x=680 */}
          <rect x="640" y="158" width="40" height="144" />

          {/* Arcos de esquina */}
          <path d="M 16 0 A 16 16 0 0 1 0 16" />
          <path d="M 684 0 A 16 16 0 0 0 700 16" />
          <path d="M 0 444 A 16 16 0 0 0 16 460" />
          <path d="M 700 444 A 16 16 0 0 1 684 460" />

          {/* Puntos de penalti */}
          <circle cx="72" cy="230" r="3" fill="#ffffff" stroke="none" />
          <circle cx="628" cy="230" r="3" fill="#ffffff" stroke="none" />
        </g>
      </svg>

      <div
        ref={heatmapLayerRef}
        className="absolute inset-0"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: HEAT_W,
          height: HEAT_H,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
