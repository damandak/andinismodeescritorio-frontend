// Text helpers shared by pages (auto-imported by Nuxt from utils/).

const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

type DateParts = { year: number; month?: number; day?: number };

/**
 * The API sends dates with their known precision: "1896-xx-xx" (year only),
 * "2023-10-xx" (month) or "1963-02-10" (day). Year 1 ("0001-01-01") is a
 * placeholder some records use for "unknown date".
 */
function parsePartialDate(value?: string | null): DateParts | null {
  if (!value) return null;
  const [y, m, d] = value.split("-");
  const year = Number(y);
  if (!Number.isFinite(year) || year <= 1) return null;
  const month = m && m !== "xx" ? Number(m) : undefined;
  const day = month && d && d !== "xx" ? Number(d) : undefined;
  return { year, month: month && month >= 1 && month <= 12 ? month : undefined, day };
}

/** "1896", "octubre de 2023", "10 de febrero de 1963"; empty if unknown */
export function formatPartialDate(value?: string | null): string {
  const date = parsePartialDate(value);
  if (!date) return "";
  if (!date.month) return String(date.year);
  const month = MONTHS.at(date.month - 1);
  if (!date.day) return `${month} de ${date.year}`;
  return `${date.day} de ${month} de ${date.year}`;
}

/** Short form for tables: "1896", "oct 2023", "10 feb 1963"; "Sin fecha" */
export function formatPartialDateShort(value?: string | null): string {
  const date = parsePartialDate(value);
  if (!date) return "Sin fecha";
  if (!date.month) return String(date.year);
  const month = MONTHS.at(date.month - 1)!.slice(0, 3);
  if (!date.day) return `${month} ${date.year}`;
  return `${date.day} ${month} ${date.year}`;
}

/** For sentences: "en 1896", "en octubre de 2023", "el 10 de febrero de 1963" */
export function datePhrase(value?: string | null): string {
  const date = parsePartialDate(value);
  if (!date) return "";
  return `${date.day ? "el" : "en"} ${formatPartialDate(value)}`;
}

/**
 * "Primer ascenso: 1896 por Ana y Luis." — without the parts that are unknown
 * ("Primer ascenso por Ana." when the ascent has no date).
 */
export function firstAscentSentence(date?: string | null, team?: string): string {
  const when = formatPartialDate(date);
  return `Primer ascenso${when ? `: ${when}` : ""}${team ? ` por ${team}` : ""}.`;
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
