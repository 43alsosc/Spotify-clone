import { z } from "zod";
import { externalUrlsSchema } from "./external-urls";
import { CopyrightSchema } from "./copyright";
import { ImageSchema } from "./image";

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

export type Episode = z.infer<typeof EpisodeSchema>;
