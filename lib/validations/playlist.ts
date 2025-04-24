import { z } from "zod";
import { OwnerSchema } from "./owner";
import { ImageSchema } from "./image";
import { externalUrlsSchema } from "./external-urls";
import { CategorySchema } from "./category";
import { TrackSchema } from "./track";
import { EpisodeSchema } from "./episode";

// Basis skjemaer
export const PlaylistBaseSchema = z.object({
  href: z.string(),
  limit: z.number(),
  next: z.string().nullable(),
  offset: z.number(),
  previous: z.string().nullable(),
  total: z.number(),
});

// Bruker-relaterte skjemaer
export const SimplifiedPlaylistSchema = z.object({
  collaborative: z.boolean(),
  description: z.string(),
  external_urls: externalUrlsSchema,
  href: z.string(),
  id: z.string(),
  images: z.array(ImageSchema),
  name: z.string(),
  owner: OwnerSchema,
  primary_color: z.string().nullable(),
  public: z.boolean(),
  snapshot_id: z.string(),
  tracks: z.object({ href: z.string(), total: z.number() }),
  type: z.string(),
  uri: z.string(),
});

export const GetUsersPlaylistsSchema = PlaylistBaseSchema.extend({
  items: z.array(SimplifiedPlaylistSchema),
});

// Spor og episode skjemaer
export const PlaylistItemBaseSchema = z.object({
  added_at: z.string(),
  added_by: z.object({
    external_urls: externalUrlsSchema,
    href: z.string(),
    id: z.string(),
    type: z.string(),
    uri: z.string(),
  }),
  is_local: z.boolean(),
  primary_color: z.string().nullable(),
});

export const PlaylistTrackSchema = PlaylistItemBaseSchema.extend({
  track: TrackSchema,
});

export const PlaylistEpisodeSchema = PlaylistItemBaseSchema.extend({
  track: EpisodeSchema,
});

// Spilleliste-relaterte skjemaer
export const playlistDetailsSchema = z.object({
  collaborative: z.boolean(),
  description: z.string().nullable(),
  id: z.string(),
  images: z.array(ImageSchema),
  name: z.string(),
  owner: OwnerSchema,
  public: z.boolean(),
  type: z.string(),
  tracks: z.object({
    total: z.number(),
  }),
});

export const GetFeaturedPlaylistsSchema = PlaylistBaseSchema.extend({
  items: z.array(CategorySchema),
});

export const GetPlaylistTracksSchema = PlaylistBaseSchema.extend({
  items: z.array(z.union([PlaylistTrackSchema, PlaylistEpisodeSchema])),
});

export const GetPlaylistPageSchema = PlaylistBaseSchema.extend({
  items: z.array(z.union([PlaylistTrackSchema, PlaylistEpisodeSchema])),
});

// Type eksporter
export type SimplifiedPlaylist = z.infer<typeof SimplifiedPlaylistSchema>;
export type GetUsersPlaylists = z.infer<typeof GetUsersPlaylistsSchema>;
export type GetFeaturedPlaylists = z.infer<typeof GetFeaturedPlaylistsSchema>;
export type PlaylistTrack = z.infer<typeof PlaylistTrackSchema>;
export type PlaylistEpisode = z.infer<typeof PlaylistEpisodeSchema>;
export type GetPlaylistTracks = z.infer<typeof GetPlaylistTracksSchema>;
export type PlaylistDetails = z.infer<typeof playlistDetailsSchema>;
export type GetPlaylistPage = z.infer<typeof GetPlaylistPageSchema>;
