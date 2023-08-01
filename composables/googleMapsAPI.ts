import { Loader } from "@googlemaps/js-api-loader";

let loader: Loader | null = null;

export function getGoogleMapsLoader(apiKey: string): Loader {
  if (!loader) {
    const version: string = "weekly";
    const libraries: string[] = ["places"];

    loader = new Loader({
      apiKey,
      version,
      libraries,
    });
  }

  return loader;
}
