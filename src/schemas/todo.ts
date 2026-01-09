import { z } from "zod";

export const createInputSchema = z.object({
  text: z
    .string()
    .min(3, "Задача должна содержать не менее 3х символов")
    .max(100, "Задача должна содержать не более 100х символов"),
});

export const toggleInputSchema = z.object({
  id: z.string(),
  done: z.boolean(),
});
