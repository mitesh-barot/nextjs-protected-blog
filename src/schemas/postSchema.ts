import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(50, "Title too long")
    .trim(),

  content: z
    .string()
    .min(20, "Content must be at least 20 characters")
    .max(10000, "Content too long")
    .trim(),
});

export type PostInput = z.infer<typeof postSchema>;
