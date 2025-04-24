import { z } from "zod";
import { externalUrlsSchema } from "./external-urls";
import { ImageSchema } from "./image";

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

export type User = z.infer<typeof UserSchema>;
