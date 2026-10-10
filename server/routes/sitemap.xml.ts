// /sitemap.xml: every public page, so search engines find all the fichas.
// Built from the API (ids) and the blog posts; cached for 6 hours.
import { serverQueryContent } from "#content/server";

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default defineCachedEventHandler(
  async (event) => {
    const config = useRuntimeConfig(event);
    const site = String(config.public.siteUrl).replace(/\/$/, "");

    const ids: any = await $fetch(`${config.public.apiBase}sitemap/`).catch(() => null);
    if (!ids) {
      // Don't cache (and serve for hours) a sitemap missing every ficha.
      throw createError({ statusCode: 503, statusMessage: "API no disponible" });
    }

    const posts = await serverQueryContent(event, "blog")
      .where({ draft: { $ne: true } })
      .only(["_path", "date"])
      .find();

    const entries: { path: string; lastmod?: string }[] = [
      { path: "/" },
      { path: "/cerros" },
      { path: "/rutas" },
      { path: "/ascensos" },
      { path: "/andinistas" },
      { path: "/blog" },
      { path: "/quienessomos" },
      ...posts.map((p: any) => ({
        path: p._path,
        lastmod: p.date ? String(p.date).slice(0, 10) : undefined,
      })),
      ...ids.mountains.map((id: number) => ({ path: `/cerros/${id}` })),
      ...ids.routes.map((id: number) => ({ path: `/rutas/${id}` })),
      ...ids.ascents.map((id: number) => ({ path: `/ascensos/${id}` })),
      ...ids.andinists.map((id: number) => ({ path: `/andinistas/${id}` })),
    ];

    const body = entries
      .map(
        (e) =>
          `  <url><loc>${escapeXml(site + e.path)}</loc>${
            e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ""
          }</url>`
      )
      .join("\n");

    setHeader(event, "content-type", "application/xml; charset=utf-8");
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
  },
  { name: "sitemap", maxAge: 60 * 60 * 6 }
);
