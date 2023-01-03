// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    // The private keys which are only available server-side
    apiSecret: '123',
    // Keys within public are also exposed client-side
    public: {
      apiBase: 'http://localhost:8000/api/',
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
    }
    // These variables are exposed to the rest of your application using the useRuntimeConfig composable.
  },
  // app: {
  //   pageTransition: { name: 'page', mode: 'out-in' }
  // },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/styles/main.scss";'
        }
      }
    }
  },
  modules: [
    '@nuxt/content'
  ],
})
