"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Map, { Marker, NavigationControl, type MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

import type { JugadorMapa } from "@/components/dashboard/jugadoresMapaData";
import {
  POSICIONES_ORDEN,
  colorForPosicion,
} from "@/components/dashboard/posicionColors";

export type { JugadorMapa } from "@/components/dashboard/jugadoresMapaData";

/** Solo para la vista inicial (sin maxBounds: el usuario puede moverse y zoomear libre). */
const BOUNDS_INICIAL_URUGUAY: [[number, number], [number, number]] = [
  [-58.44, -34.98],
  [-53.09, -30.08],
];

const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

type MapFocusRequest = { playerId: number; nonce: number };

type MapaJugadoresProps = {
  /** Mapa edge-to-edge dentro de su celda (vista principal del dashboard). */
  fullScreen?: boolean;
  jugadores: JugadorMapa[];
  /** Al cambiar, centra el mapa en ese jugador (p. ej. al tocar la lista). */
  focusRequest?: MapFocusRequest | null;
  /** Jugador resaltado en el mapa (mismo id que en la lista). */
  selectedPlayerId?: number | null;
  /** Click en un marcador: abrir detalle y sincronizar con el pipeline. */
  onPlayerSelect?: (playerId: number) => void;
};

export default function MapaJugadores({
  fullScreen = false,
  jugadores,
  focusRequest = null,
  selectedPlayerId = null,
  onPlayerSelect,
}: MapaJugadoresProps) {
  const mapRef = useRef<MapRef>(null);

  const markerMeta = useMemo(
    () =>
      jugadores.map((j) => ({
        j,
        color: colorForPosicion(j.posicion),
      })),
    [jugadores],
  );

  useEffect(() => {
    if (!focusRequest) return;
    const j = jugadores.find((p) => p.id === focusRequest.playerId);
    if (!j) return;
    const map = mapRef.current?.getMap?.();
    if (!map) return;
    map.flyTo({
      center: [j.lng, j.lat],
      zoom: Math.max(map.getZoom(), 11),
      essential: true,
    });
  }, [focusRequest, jugadores]);

  if (!token) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-white px-6 py-12 text-center ${
          fullScreen
            ? "min-h-[100dvh] w-full"
            : "min-h-[400px] rounded-2xl border border-black/[0.08] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]"
        }`}
      >
        <p className="font-medium text-[#111111]">Falta el token de Mapbox</p>
        <p className="mt-2 max-w-md text-sm text-black/55">
          Agregá{" "}
          <code className="rounded bg-black/[0.06] px-1.5 py-0.5 font-mono text-xs">
            NEXT_PUBLIC_MAPBOX_TOKEN
          </code>{" "}
          en <code className="font-mono text-xs">.env.local</code> y reiniciá el
          servidor de desarrollo.
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        fullScreen
          ? "relative h-full w-full min-h-0 overflow-hidden"
          : "relative overflow-hidden rounded-2xl border border-black/[0.08] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]"
      }
    >
      <Map
        ref={mapRef}
        mapboxAccessToken={token}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        projection={{ name: "mercator" }}
        initialViewState={{
          bounds: BOUNDS_INICIAL_URUGUAY,
          fitBoundsOptions: {
            padding: fullScreen
              ? { top: 16, bottom: 72, left: 16, right: 16 }
              : 48,
            maxZoom: 8,
          },
        }}
        style={{
          width: "100%",
          height: fullScreen ? "100%" : "min(600px, 70vh)",
        }}
        minZoom={0}
        maxZoom={22}
        dragRotate={false}
        pitchWithRotate={false}
        maxPitch={0}
        touchPitch={false}
      >
        <NavigationControl position="bottom-right" showCompass={false} />
        {markerMeta.map(({ j, color }) => {
          const selected = selectedPlayerId === j.id;
          return (
            <Marker
              key={j.id}
              longitude={j.lng}
              latitude={j.lat}
              anchor="center"
              onClick={(e) => {
                e.originalEvent?.stopPropagation?.();
                onPlayerSelect?.(j.id);
              }}
            >
              <button
                type="button"
                style={{ backgroundColor: color }}
                className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-[3px] border-white text-sm font-bold uppercase text-white shadow-[0_4px_14px_rgba(0,0,0,0.35)] transition hover:scale-110 hover:ring-4 hover:ring-white/80 ${
                  selected
                    ? "ring-[3px] ring-blue-400 ring-offset-2 ring-offset-transparent"
                    : "ring-2 ring-black/15"
                }`}
                aria-label={`Ver ${j.nombre}`}
                aria-pressed={selected}
              >
                {j.nombre.trim().charAt(0)}
              </button>
            </Marker>
          );
        })}
      </Map>

      <div className="pointer-events-none absolute bottom-14 left-3 z-10 max-w-[200px] rounded-xl border border-black/[0.08] bg-white/95 px-3 py-2.5 text-[10px] shadow-lg backdrop-blur-sm sm:bottom-4 sm:left-4">
        <p className="mb-2 font-bold uppercase tracking-wide text-black/55">
          Posición
        </p>
        <ul className="space-y-1.5">
          {POSICIONES_ORDEN.map((pos) => (
            <li key={pos} className="flex items-center gap-2 text-[#111111]">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full border border-black/10"
                style={{ backgroundColor: colorForPosicion(pos) }}
              />
              <span className="leading-tight">{pos}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
