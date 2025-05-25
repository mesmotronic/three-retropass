import { validColorCounts } from "../utils/isValidColorCount";

/**
 * Valid color count values for the RetroPass effect
 */
export type ColorCount = (typeof validColorCounts)[number];
