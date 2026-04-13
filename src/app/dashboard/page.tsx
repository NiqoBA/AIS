import { Suspense } from "react";
import { DashboardMapHome } from "@/components/dashboard/DashboardMapHome";

/** Vista principal: mapa (2/3) + listado y filtros (1/3). */
export default function DashboardMapHomePage() {
  return (
    <div className="h-full min-h-0 w-full">
      <Suspense
        fallback={
          <div className="flex h-full min-h-[200px] items-center justify-center bg-neutral-200 text-sm text-black/45">
            Cargando…
          </div>
        }
      >
        <DashboardMapHome />
      </Suspense>
    </div>
  );
}
