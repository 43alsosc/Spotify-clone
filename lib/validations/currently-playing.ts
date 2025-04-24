import { z } from "zod";
import { EpisodeSchema } from "./episode";
import { TrackSchema } from "./track";
import { externalUrlsSchema } from "./external-urls";

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

export type GetCurrentlyPlayingTrack = z.infer<
  typeof GetCurrentlyPlayingTrackSchema
>;
