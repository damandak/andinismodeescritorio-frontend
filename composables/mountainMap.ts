/* eslint-disable no-undef */
// Google Maps setup shared by the home map and the mountain "Ubicación" tab:
// the map, the mountain markers (with the site's own pin icons), one shared
// info window, and the cluster bubbles.
//
// With a Map ID (NUXT_PUBLIC_GOOGLE_MAPS_MAP_ID) it uses Google's current
// AdvancedMarkerElement; without one it falls back to the classic Marker,
// which Google has deprecated but still serves. Both look the same.

export type MarkerKind = "ascended" | "unclimbed" | "current";

const ICONS: Record<MarkerKind, { url: string; width: number; height: number }> = {
  ascended: { url: "/img/marker3.png", width: 28, height: 42 },
  unclimbed: { url: "/img/marker-sin-ascenso.png", width: 28, height: 42 },
  current: { url: "/img/marker-alt-3.png", width: 36, height: 50 },
};

// Cluster bubble: the site's pink with a white ring, like the pins.
const CLUSTER_COLOR = "#d56887";

export type MountainMap = {
  google: any;
  map: any;
  advanced: boolean;
  makeMarker: (m: MapMountain, kind: MarkerKind) => any;
  clusterRenderer: { render: (cluster: { count: number; position: any }) => any };
};

function infoContent(m: MapMountain, onNavigate: (path: string) => void): HTMLElement {
  // Built as DOM nodes, not an HTML string, so names are never parsed as HTML.
  const root = document.createElement("div");
  const link = document.createElement("a");
  link.href = `/cerros/${m.id}`;
  link.className = "mtn-popup-link";
  link.addEventListener("click", (event) => {
    event.preventDefault(); // stay in the app instead of reloading the page
    onNavigate(`/cerros/${m.id}`);
  });
  const prefix = document.createElement("p");
  prefix.className = "prefix";
  prefix.textContent = m.prefix;
  const name = document.createElement("p");
  name.className = "name";
  name.textContent = m.name;
  link.append(prefix, name);
  root.append(link);
  const altitude = formatAltitude(m.altitude);
  if (altitude) {
    const alt = document.createElement("p");
    alt.className = "mtn-popup-altitude";
    alt.textContent = altitude;
    root.append(alt);
  }
  const status = document.createElement("p");
  status.className = "mtn-popup-altitude";
  status.textContent = m.ascended ? "Ascendido" : "Sin ascenso registrado";
  root.append(status);
  return root;
}

function clusterSvg(count: number, size: number): string {
  const r = size / 2;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
    `<circle cx="${r}" cy="${r}" r="${r - 1}" fill="white"/>` +
    `<circle cx="${r}" cy="${r}" r="${r - 4}" fill="${CLUSTER_COLOR}"/>` +
    `<text x="50%" y="50%" dy=".35em" text-anchor="middle" fill="white" ` +
    `font-family="Inter, Arial, sans-serif" font-weight="700" font-size="${size < 44 ? 13 : 15}">${count}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export async function createMountainMap(
  element: HTMLElement,
  options: {
    apiKey: string;
    mapId?: string;
    center: { lat: number; lng: number };
    zoom: number;
    gestureHandling?: string;
    onNavigate: (path: string) => void;
  }
): Promise<MountainMap> {
  const loader = getGoogleMapsLoader(options.apiKey);
  const { Map, InfoWindow } = await loader.importLibrary("maps");
  const advanced = Boolean(options.mapId);
  const markerLib: any = advanced ? await loader.importLibrary("marker") : null;
  const google = (window as any).google;

  const map = new Map(element, {
    center: options.center,
    zoom: options.zoom,
    mapTypeId: "satellite",
    rotateControl: false,
    streetViewControl: false,
    gestureHandling: options.gestureHandling,
    ...(advanced ? { mapId: options.mapId } : {}),
  });
  const infoWindow = new InfoWindow();

  const makeMarker = (m: MapMountain, kind: MarkerKind) => {
    const icon = ICONS[kind];
    const position = { lat: Number(m.latitude), lng: Number(m.longitude) };
    const title = `${m.prefix} ${m.name}`;
    let marker: any;
    if (advanced) {
      const img = document.createElement("img");
      img.src = icon.url;
      img.width = icon.width;
      img.height = icon.height;
      img.alt = "";
      // The pin's tip sits at the bottom centre, where Google anchors it.
      marker = new markerLib.AdvancedMarkerElement({ position, content: img, title });
    } else {
      marker = new google.maps.Marker({
        position,
        title,
        icon: { url: icon.url, scaledSize: new google.maps.Size(icon.width, icon.height) },
      });
    }
    if (kind !== "current") {
      marker.addListener("click", () => {
        infoWindow.setContent(infoContent(m, options.onNavigate));
        infoWindow.open({ anchor: marker, map });
      });
    }
    return marker;
  };

  const clusterRenderer = {
    render: ({ count, position }: { count: number; position: any }) => {
      const size = count < 10 ? 38 : count < 100 ? 44 : 52;
      const zIndex = 1000 + count;
      const title = `${count} cerros. Acerca el mapa para verlos.`;
      if (advanced) {
        const img = document.createElement("img");
        img.src = clusterSvg(count, size);
        img.width = size;
        img.height = size;
        img.alt = title;
        img.style.transform = "translateY(50%)"; // centre the bubble on the point
        return new markerLib.AdvancedMarkerElement({ position, content: img, title, zIndex });
      }
      return new google.maps.Marker({
        position,
        title,
        zIndex,
        icon: {
          url: clusterSvg(count, size),
          scaledSize: new google.maps.Size(size, size),
          anchor: new google.maps.Point(size / 2, size / 2),
        },
      });
    },
  };

  return { google, map, advanced, makeMarker, clusterRenderer };
}

/** Show or hide a marker of either kind. */
export function setMarkerMap(marker: any, map: any | null) {
  if ("map" in marker && typeof marker.setMap !== "function") marker.map = map;
  else marker.setMap(map);
}
