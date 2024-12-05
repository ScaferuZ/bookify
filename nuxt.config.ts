// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", "storeToRefs"],
      },
    ],
    "@nuxtjs/tailwindcss",
  ],

  imports: {
    dirs: ["stores", "composables", "@vueuse/core"],
  },

  typescript: {
    strict: true,
  },

  compatibilityDate: "2024-12-05",
});
