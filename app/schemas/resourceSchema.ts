import { z } from "zod";

export const resourceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Invalid URL format"),
});
