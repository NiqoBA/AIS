export function ageFromBirthDate(isoDate: string | null | undefined): number | null {
  if (!isoDate) return null;
  const bd = new Date(isoDate);
  if (Number.isNaN(bd.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - bd.getFullYear();
  const m = today.getMonth() - bd.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) age -= 1;
  return age;
}
