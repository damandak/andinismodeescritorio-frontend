const apiAddress =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8000/djangoapi/"
    : "https://andinismodeescritorio.cl/djangoapi/";

export default defineNuxtConfig({
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
  css: ["@/assets/styles/main.scss"],
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
