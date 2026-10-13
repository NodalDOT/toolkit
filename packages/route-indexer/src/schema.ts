import { z } from "zod";

export const RouteMetaSchema = z
  .object({
    title: z.string().trim().min(1),
  })
  .strict();
