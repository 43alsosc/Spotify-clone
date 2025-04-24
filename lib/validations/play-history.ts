import { z } from "zod";
import { TrackSchema } from "./track";
import { ContextObjectSchema } from "./context";

export const PlayHistoryObjectSchema = z.object({
  track: TrackSchema,
  played_at: z.string(),
  context: ContextObjectSchema,
});

export type PlayHistoryObject = z.infer<typeof PlayHistoryObjectSchema>;
