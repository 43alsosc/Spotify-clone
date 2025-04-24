import { z } from "zod";
import { ImageSchema } from "./image";
import { externalUrlsSchema } from "./external-urls";
import { SimplifiedArtistSchema } from "./artist";

export const AlbumSchema = z.object({
  album_type: z.string(),
  total_tracks: z.number(),
  available_markets: z.array(z.string()),
  external_urls: externalUrlsSchema,
  href: z.string(),
  id: z.string(),
  images: z.array(ImageSchema),
  name: z.string(),
  release_date: z.string(),
  release_date_precision: z.string(),
  restrictions: z
    .object({
      reason: z.string(),
    })
    .optional(),
  type: z.literal("album"),
  uri: z.string(),
  artists: z.array(SimplifiedArtistSchema),
});

export type Album = z.infer<typeof AlbumSchema>;
