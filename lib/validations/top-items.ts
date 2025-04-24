import { z } from "zod";

export const timeRangeEnum = z.enum(["long_term", "short_term", "medium_term"]);
export const typeEnum = z.enum(["artists", "tracks"]);

export type TimeRange = z.infer<typeof timeRangeEnum>;
export type ItemType = z.infer<typeof typeEnum>;
