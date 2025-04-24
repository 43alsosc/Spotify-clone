import { z } from "zod";
import { AlbumSchema } from "./album";
import { externalUrlsSchema } from "./external-urls";
import { SimplifiedArtistSchema } from "./artist";

export const TrackSchema = z.object({
  album: AlbumSchema,
  artists: z.array(SimplifiedArtistSchema),
  available_markets: z.array(z.string()),
  disc_number: z.number(),
  duration_ms: z.number(),
  explicit: z.boolean(),
  external_ids: z.object({
    isrc: z.string(),
    ean: z.string().optional(),
    upc: z.string().optional(),
  }),
  external_urls: externalUrlsSchema,
  href: z.string(),
  id: z.string(),
  is_playable: z.boolean().optional(),
  linked_from: z
    .object({
      external_urls: externalUrlsSchema,
      href: z.string(),
      id: z.string(),
      type: z.string(),
      uri: z.string(),
    })
    .optional(),
  restrictions: z
    .object({
      reason: z.string(),
    })
    .optional(),
  name: z.string(),
  popularity: z.number(),
  preview_url: z.string().nullable(),
  track_number: z.number(),
  type: z.literal("track"),
  uri: z.string(),
  is_local: z.boolean(),
});

export type Track = z.infer<typeof TrackSchema>;
