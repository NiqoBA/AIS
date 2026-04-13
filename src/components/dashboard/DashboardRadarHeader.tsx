"use client";

import { SignOutButton } from "@/components/auth/SignOutButton";

type DashboardRadarHeaderProps = {
  viewerName: string;
  totalVisibles: number;
  destacados: number;
  topPosicion: string | null;
  scoreProm0a100: number | null;
};

function Pill({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2 py-1 text-[10px] font-medium text-white">
      <span className="text-white/70">{icon}</span>
      {children}
    </div>
  );
}

export function DashboardRadarHeader({
  viewerName,
  totalVisibles,
  destacados,
  topPosicion,
  scoreProm0a100,
}: DashboardRadarHeaderProps) {
  return (
    <header className="shrink-0 border-b border-white/10 bg-zinc-800">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-3 py-2 sm:px-4">
        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/55">
            Niqo Scout
          </p>
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
            <h1 className="text-base font-bold tracking-tight text-white sm:text-[17px]">
              Radar
            </h1>
            <span className="hidden text-[10px] text-white/45 sm:inline">
              ·
            </span>
            <p className="text-[10px] text-white/55 sm:text-[11px]">
              Talentos — Uruguay
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
          <Pill
            icon={
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            }
          >
            <span className="tabular-nums font-semibold">{totalVisibles}</span>
            <span className="text-white/55"> jug.</span>
          </Pill>
          <Pill
            icon={
              <svg className="h-3 w-3 text-emerald-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" />
              </svg>
            }
          >
            <span className="tabular-nums font-semibold">{destacados}</span>
            <span className="text-white/55"> dest.</span>
          </Pill>
          <Pill
            icon={
              <svg className="h-3 w-3 text-white/55" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            }
          >
            <span className="text-white/55">Top </span>
            <span className="max-w-[72px] truncate font-semibold">
              {topPosicion ?? "—"}
            </span>
          </Pill>
          <Pill
            icon={
              <svg className="h-3 w-3 text-white/55" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
              </svg>
            }
          >
            <span className="text-white/55">Prom </span>
            <span className="tabular-nums font-semibold">
              {scoreProm0a100 != null ? scoreProm0a100 : "—"}
            </span>
          </Pill>

          <div className="hidden h-6 w-px bg-white/15 sm:block" />

          <div className="flex items-center gap-2">
            <div className="hidden text-right sm:block">
              <p className="text-[9px] uppercase tracking-wide text-white/45">
                Veedor
              </p>
              <p className="max-w-[120px] truncate text-[11px] font-medium text-white">
                {viewerName}
              </p>
            </div>
            <SignOutButton
              redirectTo="/login"
              className="shrink-0 rounded-full border border-white/25 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide text-white transition hover:bg-white/10"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
