import { z } from "zod";

const externalUrlsSchema = z.object({
  spotify: z.string(),
});

const ImageSchema = z.object({
  height: z.number().nullable(),
  url: z.string(),
  width: z.number().nullable(),
});

const OwnerSchema = z.object({
  display_name: z.string(),
  external_urls: externalUrlsSchema,
  href: z.string(),
  id: z.string(),
  type: z.string(),
  uri: z.string(),
});

export const UserSchema = z.object({
  display_name: z.string(),
  external_urls: externalUrlsSchema,
  followers: z.object({
    href: z.string().nullable(),
    total: z.number(),
  }),
  href: z.string(),
  id: z.string(),
  images: z.array(ImageSchema),
  type: z.string(),
  uri: z.string(),
});

const SimplifiedArtistSchema = z.object({
  external_urls: externalUrlsSchema,
  href: z.string(),
  id: z.string(),
  name: z.string(),
  type: z.string(),
  uri: z.string(),
});

const AlbumSchema = z.object({
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

const CopyrightSchema = z.object({
  text: z.string(),
  type: z.string(),
});

export const EpisodeSchema = z.object({
  audio_preview_url: z.string().nullable().optional(),
  description: z.string().optional(),
  html_description: z.string().optional(),
  duration_ms: z.number(),
  explicit: z.boolean(),
  external_urls: externalUrlsSchema,
  href: z.string(),
  id: z.string(),
  images: z.array(ImageSchema),
  is_externally_hosted: z.boolean().optional(),
  is_playable: z.boolean().optional(),
  language: z.string().optional(),
  languages: z.array(z.string()).optional(),
  name: z.string(),
  release_date: z.string().optional(),
  release_date_precision: z.string().optional(),
  resume_point: z
    .object({
      fully_played: z.boolean(),
      resume_position_ms: z.number(),
    })
    .optional(),
  type: z.literal("episode"),
  uri: z.string(),
  restrictions: z
    .object({
      reason: z.string(),
    })
    .optional(),
  show: z
    .object({
      available_markets: z.array(z.string()),
      copyrights: z.array(CopyrightSchema),
      description: z.string(),
      html_description: z.string(),
      explicit: z.boolean(),
      external_urls: externalUrlsSchema,
      href: z.string(),
      id: z.string(),
      images: z.array(ImageSchema),
      is_externally_hosted: z.boolean(),
      languages: z.array(z.string()),
      media_type: z.string(),
      name: z.string(),
      publisher: z.string(),
      type: z.string(),
      uri: z.string(),
      total_episodes: z.number(),
    })
    .optional(),
});

export const CategoryTracks = z.object({
  href: z.string(),
  icons: z.array(ImageSchema),
  id: z.string(),
  name: z.string(),
});

export const SimplifiedPlaylist = z.object({
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

export const GetUsersPlaylists = z.object({
  href: z.string(),
  limit: z.number(),
  next: z.string().nullable(),
  offset: z.number(),
  previous: z.string().nullable(),
  total: z.number(),
  items: z.array(SimplifiedPlaylist),
});

export const CategoryObject = z.object({
  href: z.string(),
  icons: z.array(ImageSchema),
  id: z.string(),
  name: z.string(),
});

export const GetFeaturedPlaylists = z.object({
  href: z.string(),
  limit: z.number(),
  next: z.string().nullable(),
  offset: z.number(),
  previous: z.string().nullable(),
  total: z.number(),
  items: z.array(CategoryObject),
});

export const ContextObjectSchema = z.object({
  external_urls: externalUrlsSchema,
  href: z.string(),
  type: z.string(),
  uri: z.string(),
});

export const PlayHistoryObject = z.object({
  track: TrackSchema,
  played_at: z.string(),
  context: ContextObjectSchema,
});

export const GetRecentlyPlayed = z.object({
  href: z.string(),
  limit: z.number(),
  next: z.string(),
  cursors: z.object({
    after: z.string(),
    before: z.string(),
  }),
  total: z.number(),
  items: z.array(PlayHistoryObject),
});

export const PlaylistTrackSchema = z.object({
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
  track: TrackSchema,
});

export const PlaylistEpisodeSchema = z.object({
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
  track: EpisodeSchema,
});

export const GetPlaylistSchema = z.object({
  collaborative: z.boolean(),
  description: z.string().nullable(),
  external_urls: externalUrlsSchema,
  href: z.string(),
  id: z.string(),
  images: z.array(ImageSchema),
  name: z.string(),
  owner: OwnerSchema,
  public: z.boolean(),
  snapshot_id: z.string(),
  tracks: z.object({
    href: z.string(),
    limit: z.number(),
    next: z.string().nullable(),
    offset: z.number(),
    previous: z.string().nullable(),
    total: z.number(),
    items: z.array(z.union([PlaylistTrackSchema, PlaylistEpisodeSchema])),
  }),
  type: z.string(),
  uri: z.string(),
});

export const GetPlaylistPageSchema = z.object({
  href: z.string(),
  items: z.array(z.union([PlaylistTrackSchema, PlaylistEpisodeSchema])),
  limit: z.number(),
  next: z.string().nullable(),
  offset: z.number(),
  previous: z.string().nullable(),
  total: z.number(),
});

export const GetCurrentlyPlayingTrackSchema = z.object({
  device: z.object({
    id: z.string().nullable(),
    is_active: z.boolean(),
    is_private_session: z.boolean(),
    is_restricted: z.boolean(),
    name: z.string(),
    type: z.string(),
    volume_percent: z.string(),
    supports_volume: z.boolean(),
  }),
  repeat_state: z.enum(["off", "track", "context"]),
  shuffle_state: z.boolean(),
  context: z.object({
    type: z.string(),
    href: z.string(),
    external_urls: externalUrlsSchema,
    uri: z.string(),
  }),
  timestamp: z.number(),
  progress_ms: z.number().nullable(),
  is_playing: z.boolean(),
  item: TrackSchema.or(EpisodeSchema),
  currently_playing_type: z.enum(["track", "episode", "ad", "unknown"]),
  actions: z.object({
    interrupting_playback: z.boolean().optional(),
    pausing: z.boolean().optional(),
    resuming: z.boolean().optional(),
    seeking: z.boolean().optional(),
    skipping_next: z.boolean().optional(),
    skipping_prev: z.boolean().optional(),
    toggling_repeat_context: z.boolean().optional(),
    toggling_shuffle: z.boolean().optional(),
    toggling_repeat_track: z.boolean().optional(),
    transferring_playback: z.boolean().optional(),
  }),
});

// Typer eksportert fra Zod-skjemaene
export type Track = z.infer<typeof TrackSchema>;
export type Episode = z.infer<typeof EpisodeSchema>;
export type PlaylistTrack = z.infer<typeof PlaylistTrackSchema>;
