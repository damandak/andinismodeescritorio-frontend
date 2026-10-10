// The blog is cached on the server for 5 minutes (routeRules in nuxt.config.ts).
// Browsers must still ask every time (cheap: "304 Not Modified" when nothing
// changed), so nobody keeps a copy of a page from before a deploy, whose
// scripts no longer exist.
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("beforeResponse", (event) => {
    if (event.path === "/blog" || event.path.startsWith("/blog/") || event.path.startsWith("/blog?")) {
      setResponseHeader(event, "cache-control", "no-cache");
    }
  });
});
