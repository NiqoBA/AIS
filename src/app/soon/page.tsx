import { AuroraNav } from "@/components/aurora";

export default function SoonPage() {
  return (
    <div className="min-h-dvh bg-[#f4f7fa]">
      <AuroraNav />
      <main className="mx-auto flex min-h-[calc(100dvh-5rem)] w-full max-w-3xl flex-col items-center justify-center px-6 pb-20 pt-24 sm:pt-28">
        <p className="w-full text-center text-[clamp(3rem,14vw,10rem)] font-black uppercase tracking-[0.2em] text-black">
          SOON
        </p>
      </main>
    </div>
  );
}
