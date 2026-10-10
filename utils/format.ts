// Text helpers shared by pages (auto-imported by Nuxt from utils/).

const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/**
 * The API sends dates with their known precision: "1896-xx-xx" (year only),
 * "2023-10-xx" (month) or "1963-02-10" (day). Returns readable Spanish:
 * "1896", "octubre de 2023", "10 de febrero de 1963". Empty for no date.
 */
export function formatPartialDate(value?: string | null): string {
  if (!value) return "";
  const [y, m, d] = value.split("-");
  const year = String(Number(y));
  if (!m || m === "xx") return year;
  const month = MONTHS.at(Number(m) - 1);
  if (!month) return year;
  if (!d || d === "xx") return `${month} de ${year}`;
  return `${Number(d)} de ${month} de ${year}`;
}

/** "Ana", "Ana y Luis", "Ana, Luis y Pedro", "Ana, Luis, Pedro y otros" */
export function joinNames(names: string[], max = 3): string {
  const list = names.filter(Boolean);
  if (list.length === 0) return "";
  if (list.length > max) return `${list.slice(0, max).join(", ")} y otros`;
  if (list.length === 1) return list[0];
  return `${list.slice(0, -1).join(", ")} y ${list.at(-1)}`;
}

/** 5424 -> "5.424 m"; empty for no value */
export function formatAltitude(value?: number | string | null): string {
  if (value === null || value === undefined || value === "") return "";
  return `${new Intl.NumberFormat("es-CL").format(Number(value))} m`;
}

const FEMININE_PREFIXES = ["punta", "aguja", "torre"];

/** "al Cerro El Plomo", "a la Punta Patricia" (from a full mountain name) */
export function toMountain(fullName: string): string {
  const first = fullName.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  return `${FEMININE_PREFIXES.includes(first) ? "a la" : "al"} ${fullName}`;
}

/** "la Ruta Normal", "la ruta Glaciar Iver" (avoids "ruta Ruta Normal") */
export function routeWithArticle(name: string): string {
  return /^ruta\b/i.test(name.trim()) ? `la ${name}` : `la ruta ${name}`;
}
