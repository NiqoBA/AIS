import { redirect } from "next/navigation";

/** El mapa es la pantalla principal en `/dashboard`. */
export default function MapaLegacyRedirect() {
  redirect("/dashboard");
}
