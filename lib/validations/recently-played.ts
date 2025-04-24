import { z } from "zod";
import { PlayHistoryObjectSchema } from "./play-history";

export const GetRecentlyPlayedSchema = z.object({
  href: z.string(),
  limit: z.number(),
  next: z.string(),
  cursors: z.object({
    after: z.string(),
    before: z.string(),
  }),
  total: z.number(),
  items: z.array(PlayHistoryObjectSchema),
});

export type GetRecentlyPlayed = z.infer<typeof GetRecentlyPlayedSchema>;
