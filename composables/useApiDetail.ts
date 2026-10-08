/**
 * Fetch one record from the Django API for a detail page.
 *
 * - Uses useAsyncData so the request made during SSR is reused on hydration
 *   instead of being sent again from the browser.
 * - Turns a missing record into a real 404 page instead of a 500 crash.
 */
export async function useApiDetail<T = any>(key: string, path: string): Promise<T> {
  const config = useRuntimeConfig();
  const { data, error } = await useAsyncData<T>(key, () =>
    $fetch<T>(config.public.apiBase + path)
  );

  if (error.value || data.value == null) {
    const notFound = !error.value || error.value.statusCode === 404;
    throw createError({
      statusCode: notFound ? 404 : 500,
      statusMessage: notFound ? "Página no encontrada" : "Error al cargar los datos",
      fatal: true,
    });
  }

  return data.value as T;
}
