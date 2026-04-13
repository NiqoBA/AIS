import { MatchesListClient } from "@/components/dashboard/MatchesListClient";
import { fetchAllMatchesWithAi } from "@/lib/dashboard/queries";

const card =
  "rounded-2xl border border-black/[0.08] bg-white p-5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]";

export default async function PartidosPage() {
  const matches = await fetchAllMatchesWithAi();

  return (
    <div className="mx-auto max-w-3xl">
      <section className={card}>
        <h1 className="text-lg font-semibold text-[#111111]">Partidos analizados</h1>
        <p className="mt-1 text-sm text-black/55">
          Encuentros con seguimiento AIS en la base de datos.
        </p>
        <div className="mt-6">
          <MatchesListClient matches={matches} />
        </div>
      </section>
    </div>
  );
}
