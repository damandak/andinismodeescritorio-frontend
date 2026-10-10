// State of the index tables (/cerros, /rutas, /ascensos, /andinistas) kept in
// the URL, so a search or a page can be shared and "back" returns to it:
//   /ascensos?buscar=plomo&orden=-fecha&pagina=2&por-pagina=20
// Default values are left out of the URL.

import type { LocationQuery } from "vue-router";

export type TableColumn = {
  /** Field in the API row, also the API `ordering` value. */
  field: string;
  label: string;
  /** Name of the column in the URL (`orden=fecha`). Required to be sortable. */
  key?: string;
  sortable?: boolean;
  is_boolean?: boolean;
  class?: string;
  link?: (row: any) => string;
  links?: (row: any) => { to: string; text: string }[];
  formatter?: (row: any) => string;
};

export type TableState = {
  search: string;
  page: number;
  pageSize: number;
  /** URL key of the sorted column, "" for the API's default order. */
  sort: string;
  desc: boolean;
};

export const PAGE_SIZES = [10, 20, 50, 100];
export const TABLE_QUERY_KEYS = ["buscar", "orden", "pagina", "por-pagina"];

function first(value: LocationQuery[string]): string {
  const v = Array.isArray(value) ? value[0] : value;
  return typeof v === "string" ? v : "";
}

/** Read the table state from the URL; anything invalid falls back to the default. */
export function tableStateFromQuery(query: LocationQuery, columns: TableColumn[]): TableState {
  const page = Number.parseInt(first(query.pagina), 10);
  const pageSize = Number.parseInt(first(query["por-pagina"]), 10);
  const orden = first(query.orden);
  const desc = orden.startsWith("-");
  const sort = desc ? orden.slice(1) : orden;
  const sortable = columns.some((c) => c.sortable && c.key === sort);
  return {
    search: first(query.buscar).trim(),
    page: page > 0 ? page : 1,
    pageSize: PAGE_SIZES.includes(pageSize) ? pageSize : PAGE_SIZES[0],
    sort: sortable ? sort : "",
    desc: sortable && desc,
  };
}

/** The URL query for a state, keeping other parameters (e.g. ?tab, utm_*). */
export function tableStateToQuery(state: TableState, current: LocationQuery = {}): LocationQuery {
  const query: LocationQuery = { ...current };
  for (const key of TABLE_QUERY_KEYS) delete query[key];
  if (state.search) query.buscar = state.search;
  if (state.sort) query.orden = (state.desc ? "-" : "") + state.sort;
  if (state.page > 1) query.pagina = String(state.page);
  if (state.pageSize !== PAGE_SIZES[0]) query["por-pagina"] = String(state.pageSize);
  return query;
}

/** Parameters for the Django API. */
export function tableApiQuery(state: TableState, columns: TableColumn[]) {
  const query: Record<string, string | number> = {
    page: state.page,
    page_size: state.pageSize,
  };
  if (state.search) query.search = state.search;
  const column = columns.find((c) => c.sortable && c.key === state.sort);
  if (column) query.ordering = (state.desc ? "-" : "") + column.field;
  return query;
}
