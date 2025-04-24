import { z } from "zod";
import { externalUrlsSchema } from "./external-urls";

export const OwnerSchema = z.object({
  display_name: z.string(),
  external_urls: externalUrlsSchema,
  href: z.string(),
  id: z.string(),
  type: z.string(),
  uri: z.string(),
});

export type Owner = z.infer<typeof OwnerSchema>;
