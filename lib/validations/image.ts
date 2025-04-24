import { z } from "zod";

export const ImageSchema = z.object({
  height: z.number().nullable(),
  url: z.string(),
  width: z.number().nullable(),
});

export type Image = z.infer<typeof ImageSchema>;
