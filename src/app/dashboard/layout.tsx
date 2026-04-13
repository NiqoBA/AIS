import { redirect } from "next/navigation";
import { DashboardViewerProvider } from "@/components/dashboard/DashboardViewerContext";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  const displayName =
    profile?.full_name?.trim() ||
    profile?.email ||
    user.email ||
    "Usuario";

  return (
    <DashboardViewerProvider displayName={displayName}>
      <DashboardShell displayName={displayName}>{children}</DashboardShell>
    </DashboardViewerProvider>
  );
}
