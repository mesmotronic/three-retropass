export const validColorCounts = Array.from({ length: 255 }).map((_, i) => i + 2);

/**
 * Valid color count values for the RetroPass effect
 */
export type ColorCount = (typeof validColorCounts)[number];

