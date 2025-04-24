import { z } from "zod";
import { ImageSchema } from "./image";

export const CategorySchema = z.object({
  href: z.string(),
  icons: z.array(ImageSchema),
  id: z.string(),
  name: z.string(),
});

export type Category = z.infer<typeof CategorySchema>;
