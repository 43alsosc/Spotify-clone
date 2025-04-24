import { z } from "zod";
import { externalUrlsSchema } from "./external-urls";

export const ContextObjectSchema = z.object({
  external_urls: externalUrlsSchema,
  href: z.string(),
  type: z.string(),
  uri: z.string(),
});

export type ContextObject = z.infer<typeof ContextObjectSchema>;
