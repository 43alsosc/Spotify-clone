import { z } from "zod";
import { externalUrlsSchema } from "./external-urls";
import { ImageSchema } from "./image";

export const SimplifiedArtistSchema = z.object({
  external_urls: externalUrlsSchema,
  href: z.string(),
  id: z.string(),
  name: z.string(),
  type: z.string(),
  uri: z.string(),
});

export type SimplifiedArtist = z.infer<typeof SimplifiedArtistSchema>;

export const ArtistSchema = z.object({
  external_urls: externalUrlsSchema,
  followers: z.object({
    href: z.string().nullable(),
    total: z.number(),
  }),
  genres: z.array(z.string()),
  href: z.string(),
  id: z.string(),
  images: z.array(ImageSchema),
  name: z.string(),
  popularity: z.number(),
  type: z.literal("artist"),
  uri: z.string(),
});

export type Artist = z.infer<typeof ArtistSchema>;

export const GetFollowedArtistsSchema = z.object({
  artists: z.object({
    href: z.string(),
    limit: z.number(),
    next: z.string().nullable(),
    cursors: z.object({
      after: z.string().nullable(),
      before: z.string().nullable(),
    }),
    total: z.number(),
    items: z.array(ArtistSchema),
  }),
});

export type GetFollowedArtists = z.infer<typeof GetFollowedArtistsSchema>;
