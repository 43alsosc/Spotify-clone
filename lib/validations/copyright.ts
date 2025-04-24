import { z } from "zod";

export const CopyrightSchema = z.object({
  text: z.string(),
  type: z.string(),
});

export type Copyright = z.infer<typeof CopyrightSchema>;
