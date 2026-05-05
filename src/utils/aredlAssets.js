/**
 * AREDL hosts full level pictures (from the Geode level-thumbnails pipeline) in the Thumbnails repo.
 * @see https://github.com/All-Rated-Extreme-Demon-List/Thumbnails
 * @param {number|string} gdLevelId Geometry Dash level ID
 * @returns {string} raw.githubusercontent.com URL for the full WebP
 */
export function aredlLevelFullImageUrl(gdLevelId) {
  const id = String(gdLevelId).trim();
  return `https://raw.githubusercontent.com/All-Rated-Extreme-Demon-List/Thumbnails/main/levels/full/${id}.webp`;
}
