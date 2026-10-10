// Photos of the blog, fetched in one request (/djangoapi/images/?ids=…) by the
// page and shared with <BlogHeader> and <BlogImage> through useState. The
// state travels to the browser with the page, so nothing is fetched twice.
// Before, each photo was one request on the server and again in the browser.

type ImageMap = Record<string, any>;

export function useBlogImageStore() {
  return useState<ImageMap>("blog-images", () => ({}));
}

/** Fetch several photos at once and keep them in the shared store. */
export async function loadBlogImages(
  apiBase: string,
  store: Ref<ImageMap>,
  ids: Array<number | string | null | undefined>
) {
  const wanted = [...new Set(ids.map((id) => Number(id)).filter((id) => id > 0))].filter(
    (id) => !(String(id) in store.value)
  );
  if (wanted.length === 0) return;
  const found: any[] = [];
  for (let i = 0; i < wanted.length; i += 100) {
    const data: any = await $fetch(apiBase + "images/", {
      query: { ids: wanted.slice(i, i + 100).join(",") },
    }).catch(() => null);
    found.push(...(data?.results ?? []));
  }
  const next = { ...store.value };
  for (const id of wanted) next[String(id)] = null; // missing photo: don't ask again
  for (const image of found) next[String(image.id)] = image;
  store.value = next;
}

/** One photo: from the page's batch if it's there, otherwise fetched on its own. */
export async function useBlogImage(id: number | string | null | undefined) {
  const store = useBlogImageStore();
  const config = useRuntimeConfig();
  const key = String(Number(id));
  const image = computed(() => store.value[key] ?? null);
  if (Number(id) > 0 && !(key in store.value)) {
    await loadBlogImages(config.public.apiBase, store, [id]);
  }
  return image;
}

/** Photo ids used by a blog post (its <blog-header> and <blog-image> blocks). */
export function blogImageIds(body: any): number[] {
  const ids: number[] = [];
  const walk = (node: any) => {
    if (!node || typeof node !== "object") return;
    if (node.tag === "blog-image" || node.tag === "blog-header") {
      const id = Number(node.props?.image_id ?? node.props?.[":image_id"]);
      if (id > 0) ids.push(id);
    }
    (node.children || []).forEach(walk);
  };
  walk(body);
  return ids;
}
