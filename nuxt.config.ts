const apiAddress =
  process.env.NODE_ENV === "d"
    ? "http://127.0.0.1:8000/djangoapi/"
    : "https://andinismodeescritorio.cl/djangoapi/";
    
export default defineNuxtConfig({
  devtools: {
    enabled: false,
  },

  sourcemap: {
    server: false,
    client: false,
  },

  nitro: {
    preset: "node-server",
    sourceMap: false,
    // `npm run dev`: the browser calls /djangoapi on the site's own address, as
    // in production (where nginx sends it to Django). Backend: DEV_API_ORIGIN.
    devProxy: {
      "/djangoapi": {
        target: (process.env.DEV_API_ORIGIN || "http://127.0.0.1:8000") + "/djangoapi",
        changeOrigin: true,
      },
    },
    // JS, CSS and fonts are compressed (gzip and brotli) once, at build time.
    compressPublicAssets: true,
    // Cache for the pages in routeRules (and sitemap.xml), in memory but with
    // a limit (least used entries are dropped first), so it can't fill the server.
    storage: {
      cache: { driver: "lru-cache", max: 150, maxSize: 10 * 1024 * 1024 },
    },
    prerender: {
      crawlLinks: false,
      routes: [],
    },
  },

  // The blog (index and posts) is kept ready for 5 minutes instead of being
  // rebuilt on every visit: a change can take up to 5 minutes to show. Not used
  // for the thousands of detail pages: each one gets few visits, and a cached
  // page costs two renders (the page and its "_payload.json", which needs the
  // same rule, or the page shows the 404 screen). Errors (404) aren't cached.
  routeRules: {
    ...Object.fromEntries(
      ["/blog", "/blog/*"].flatMap((path) => [
        [path, { cache: { maxAge: 300, swr: false } }],
        [`${path}/_payload.json`, { cache: { maxAge: 300, swr: false } }],
      ])
    ),
    // Account pages depend on who is signed in: rendered in the browser.
    ...Object.fromEntries(
      ["/entrar", "/crear-cuenta", "/mi-cuenta", "/recuperar-clave", "/recuperar-clave/**", "/confirmar-email/**"].map(
        (path) => [path, { ssr: false }]
      )
    ),
  },

  runtimeConfig: {
    apiSecret: "123",
    public: {
      apiBase: apiAddress,
      // Public address of the site, for canonical URLs, social previews and
      // sitemap.xml. Override with NUXT_PUBLIC_SITE_URL.
      siteUrl: "https://www.andinismodeescritorio.cl",
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      // Google Cloud "Map ID": enables the current marker type
      // (AdvancedMarkerElement). Without it the map uses the classic markers.
      // Override at runtime with NUXT_PUBLIC_GOOGLE_MAPS_MAP_ID.
      googleMapsMapId: process.env.GOOGLE_MAPS_MAP_ID || "",
    },
  },

  build: {
    transpile: ["@googlemaps/js-api-loader"],
  },

  css: [
    // Inter and Lora served by the site itself (were loaded from Google Fonts).
    "~/assets/styles/fonts.css",
    "~/assets/scss/_typography.scss",
    "@/assets/styles/main.scss",
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // @use instead of the deprecated @import (removed in Dart Sass 3)
          additionalData: '@use "@/assets/styles/_variables.scss" as *;',
        },
      },
    },
  },

  modules: ["@nuxt/content"],
});