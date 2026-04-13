"use client";

import { usePathname } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

type DashboardShellProps = {
  children: React.ReactNode;
  displayName: string;
};

/** Vista principal: mapa + panel sin sidebar lateral. */
function MapHomeLayout({
  children,
}: DashboardShellProps) {
  return (
    <div className="relative h-dvh w-full overflow-hidden bg-neutral-200">
      <div className="absolute inset-x-0 top-0 z-0 min-h-0 bottom-0">
        {children}
      </div>
    </div>
  );
}

function StandardLayout({
  children,
  displayName,
}: DashboardShellProps) {
  return (
    <div className="min-h-dvh bg-[#f4f7fa] text-[#111111]">
      <div className="flex min-h-dvh min-w-0 flex-col">
        <DashboardHeader displayName={displayName} />
        <main className="flex-1 px-4 py-6 text-[#111111] sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export function DashboardShell({ children, displayName }: DashboardShellProps) {
  const pathname = usePathname();
  const isMapHome = pathname === "/dashboard";

  if (isMapHome) {
    return (
      <MapHomeLayout displayName={displayName}>{children}</MapHomeLayout>
    );
  }

  return (
    <StandardLayout displayName={displayName}>{children}</StandardLayout>
  );
}
