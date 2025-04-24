import { z } from "zod";

export const externalUrlsSchema = z.object({
  spotify: z.string(),
});

export type ExternalUrls = z.infer<typeof externalUrlsSchema>;
