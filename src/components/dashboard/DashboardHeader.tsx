import { SignOutButton } from "@/components/auth/SignOutButton";

type DashboardHeaderProps = {
  displayName: string;
  className?: string;
};

export function DashboardHeader({ displayName, className = "" }: DashboardHeaderProps) {
  return (
    <header
      className={`flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.08] bg-white/95 px-4 py-4 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] backdrop-blur-md sm:px-6 lg:px-8 ${className}`}
    >
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/45">
          Veedor
        </p>
        <p className="text-sm font-semibold text-[#111111]">{displayName}</p>
      </div>
      <SignOutButton
        redirectTo="/login"
        className="rounded-full border border-[#111111] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#111111] transition hover:bg-black/[0.04]"
      />
    </header>
  );
}
