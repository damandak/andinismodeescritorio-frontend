// https://nuxt.com/docs/api/configuration/nuxt-config
const apiAddress = process.env.NODE_ENV === 'development' ? 'http://localhost:8000/api/' : 'http://24.199.116.133/api/'

export default defineNuxtConfig({
  runtimeConfig: {
    // The private keys which are only available server-side
    apiSecret: '123',
    // Keys within public are also exposed client-side
    public: {
      apiBase: apiAddress,
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
    }
    // These variables are exposed to the rest of your application using the useRuntimeConfig composable.
  },
  // app: {
  //   pageTransition: { name: 'page', mode: 'out-in' }
  // },
  build: {
    transpile: ['@googlemaps/js-api-loader'],
  },
  css: ["@/assets/styles/main.scss"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/styles/_variables.scss";'
        }
      }
    }
  },
  modules: [
    '@nuxt/content'
  ],
})
