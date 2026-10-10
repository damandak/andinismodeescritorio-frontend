// /robots.txt: everything may be indexed except the admin panel, and
// search engines are pointed to the sitemap.
export default defineEventHandler((event) => {
  const site = String(useRuntimeConfig(event).public.siteUrl).replace(/\/$/, "");
  setHeader(event, "content-type", "text/plain; charset=utf-8");
  return `User-agent: *\nDisallow: /admin/\n\nSitemap: ${site}/sitemap.xml\n`;
});
