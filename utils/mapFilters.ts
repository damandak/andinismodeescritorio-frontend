// Filters of the home map: which mountains to show, and how they are
// written in the URL so a filtered map can be shared
// (/?pais=Chile&min=5000&ascendido=no).

export type MapFilters = {
  prefixes: string[];
  countries: string[];
  regions: string[];
  minAltitude: number | null;
  maxAltitude: number | null;
  ascended: boolean | null; // null = both
};

export type MapMountain = {
  id: number;
  prefix: string;
  name: string;
  latitude: string | number | null;
  longitude: string | number | null;
  altitude: number | null;
  ascended: boolean;
  countries?: string[];
  regions?: string[];
};

export function emptyFilters(): MapFilters {
  return { prefixes: [], countries: [], regions: [], minAltitude: null, maxAltitude: null, ascended: null };
}

export function activeFilterCount(f: MapFilters): number {
  return (
    (f.prefixes.length ? 1 : 0) +
    (f.countries.length ? 1 : 0) +
    (f.regions.length ? 1 : 0) +
    (f.minAltitude !== null ? 1 : 0) +
    (f.maxAltitude !== null ? 1 : 0) +
    (f.ascended !== null ? 1 : 0)
  );
}

const anyOf = (wanted: string[], values: string[] = []) =>
  wanted.length === 0 || values.some((v) => wanted.includes(v));

export function matchesFilters(m: MapMountain, f: MapFilters): boolean {
  if (f.prefixes.length && !f.prefixes.includes(m.prefix)) return false;
  if (!anyOf(f.countries, m.countries)) return false;
  if (!anyOf(f.regions, m.regions)) return false;
  // With an altitude filter, mountains without altitude are left out.
  if (f.minAltitude !== null && (m.altitude === null || m.altitude < f.minAltitude)) return false;
  if (f.maxAltitude !== null && (m.altitude === null || m.altitude > f.maxAltitude)) return false;
  if (f.ascended !== null && m.ascended !== f.ascended) return false;
  return true;
}

export function hasCoordinates(m: MapMountain): boolean {
  return m.latitude !== null && m.longitude !== null && m.latitude !== "" && m.longitude !== "";
}

// --- URL ---------------------------------------------------------------

const list = (v: unknown): string[] =>
  (Array.isArray(v) ? v.join(",") : typeof v === "string" ? v : "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const num = (v: unknown): number | null => {
  const n = Number(Array.isArray(v) ? v[0] : v);
  return v !== undefined && v !== null && v !== "" && Number.isFinite(n) ? n : null;
};

export function filtersFromQuery(q: Record<string, unknown>): MapFilters {
  const asc = Array.isArray(q.ascendido) ? q.ascendido[0] : q.ascendido;
  return {
    prefixes: list(q.prefijo),
    countries: list(q.pais),
    regions: list(q.region),
    minAltitude: num(q.min),
    maxAltitude: num(q.max),
    ascended: asc === "si" ? true : asc === "no" ? false : null,
  };
}

export function filtersToQuery(f: MapFilters): Record<string, string> {
  const q: Record<string, string> = {};
  if (f.prefixes.length) q.prefijo = f.prefixes.join(",");
  if (f.countries.length) q.pais = f.countries.join(",");
  if (f.regions.length) q.region = f.regions.join(",");
  if (f.minAltitude !== null) q.min = String(f.minAltitude);
  if (f.maxAltitude !== null) q.max = String(f.maxAltitude);
  if (f.ascended !== null) q.ascendido = f.ascended ? "si" : "no";
  return q;
}
