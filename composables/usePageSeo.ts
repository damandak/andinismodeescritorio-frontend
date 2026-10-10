/**
 * Title, description, social preview (Open Graph) and canonical URL for a
 * page. The site name is appended to the title by the template in app.vue.
 */
export function usePageSeo(options: {
  title: string;
  description: string;
  image?: string | null;
  type?: "website" | "article" | "profile";
}) {
  const config = useRuntimeConfig();
  const route = useRoute();
  const url = String(config.public.siteUrl).replace(/\/$/, "") + route.path;
  const description = options.description.replace(/\s+/g, " ").trim().slice(0, 300);

  useSeoMeta({
    title: options.title,
    description,
    ogTitle: options.title,
    ogDescription: description,
    ogUrl: url,
    ogType: options.type ?? "website",
    ogImage: options.image || undefined,
    twitterCard: options.image ? "summary_large_image" : "summary",
  });
  useHead({ link: [{ rel: "canonical", href: url }] });
}
