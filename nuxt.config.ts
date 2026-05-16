const apiAddress =
  process.env.NODE_ENV === "d"
    ? "http://127.0.0.1:8000/djangoapi/"
    : "https://andinismodeescritorio.cl/djangoapi/";

export default defineNuxtConfig({
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
    // The private keys which are only available server-side
    apiSecret: "123",
    // Keys within public are also exposed client-side
    public: {
      apiBase: apiAddress,
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
    // These variables are exposed to the rest of your application using the useRuntimeConfig composable.
  },
  // app: {
  //   pageTransition: { name: 'page', mode: 'out-in' }
  // },
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
