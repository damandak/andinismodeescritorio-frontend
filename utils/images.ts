// Pick the right size of a photo from the API (/image/<id>/):
//   tb_item_cover  ~400 px tall   (cards, mountain header)
//   tb_medium      up to 1600 px  (large photos, high-density screens)
//   image          the original   (only when opened on purpose)
// Older photos may not have every size yet; fall back to the next one.

type ApiImage = {
  image?: string | null;
  tb_item_cover?: string | null;
  tb_medium?: string | null;
} | null | undefined;

/** Cover-sized display: the cover, or the medium size on 2x screens. */
export function coverSrc(img: ApiImage): string | undefined {
  return img?.tb_item_cover || img?.tb_medium || img?.image || undefined;
}
export function coverSrcset(img: ApiImage): string | undefined {
  if (!img?.tb_item_cover || !img?.tb_medium) return undefined;
  return `${img.tb_item_cover} 1x, ${img.tb_medium} 2x`;
}

/** Large display (full width, blog headers): the medium size. */
export function largeSrc(img: ApiImage): string | undefined {
  return img?.tb_medium || img?.image || undefined;
}
