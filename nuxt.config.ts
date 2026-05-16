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
    prerender: {
      crawlLinks: false,
      routes: [],
    },
  },

  app: {
    head: {
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href:
            "https://fonts.googleapis.com/css2?" +
            "family=Inter:wght@300..800&" +
            "family=Lora:ital,wght@0,400..700;1,400..700&" +
            "display=swap",
        },
      ],
    },
  },

  runtimeConfig: {
    apiSecret: "123",
    public: {
      apiBase: apiAddress,
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
  },

  build: {
    transpile: ["@googlemaps/js-api-loader"],
  },

  css: ["~/assets/scss/_typography.scss", "@/assets/styles/main.scss"],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/styles/_variables.scss";',
        },
      },
    },
  },

  modules: ["@nuxt/content"],
});