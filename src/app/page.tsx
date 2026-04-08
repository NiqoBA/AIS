import {
  AuroraHero,
  AuroraNav,
} from "@/components/aurora";

export default function Home() {
  return (
    <div className="min-h-dvh bg-[#f4f7fa]">
      <AuroraNav />
      <AuroraHero />
    </div>
  );
}
