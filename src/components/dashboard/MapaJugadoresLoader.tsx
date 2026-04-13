"use client";

import dynamic from "next/dynamic";

import type { JugadorMapa } from "@/components/dashboard/jugadoresMapaData";

const MapaJugadores = dynamic(
  () => import("@/components/dashboard/MapaJugadores"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[100dvh] w-full items-center justify-center bg-neutral-200 text-sm text-black/55 lg:min-h-0">
        Cargando mapa…
      </div>
    ),
  },
);

type MapFocusRequest = { playerId: number; nonce: number };

type MapaJugadoresLoaderProps = {
  fullScreen?: boolean;
  jugadores: JugadorMapa[];
  focusRequest?: MapFocusRequest | null;
  selectedPlayerId?: number | null;
  onPlayerSelect?: (playerId: number) => void;
};

export function MapaJugadoresLoader({
  fullScreen = false,
  jugadores,
  focusRequest = null,
  selectedPlayerId = null,
  onPlayerSelect,
}: MapaJugadoresLoaderProps) {
  return (
    <MapaJugadores
      fullScreen={fullScreen}
      jugadores={jugadores}
      focusRequest={focusRequest}
      selectedPlayerId={selectedPlayerId}
      onPlayerSelect={onPlayerSelect}
    />
  );
}
