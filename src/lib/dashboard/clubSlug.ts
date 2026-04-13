/** Slug estable para URLs de perfil de club (coincide con el dashboard demo). */
export function slugClub(nombre: string) {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function resolveClubNameFromSlug(
  slug: string,
  nombres: Iterable<string>,
): string | null {
  for (const n of nombres) {
    if (slugClub(n) === slug) return n;
  }
  return null;
}
