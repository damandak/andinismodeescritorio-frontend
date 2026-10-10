import { Loader } from "@googlemaps/js-api-loader";

let loader: Loader | null = null;

export function getGoogleMapsLoader(apiKey: string): Loader {
  if (!loader) {
    // Libraries are loaded on demand with loader.importLibrary("maps" | "marker").
    loader = new Loader({ apiKey, version: "weekly" });
  }
  return loader;
}
