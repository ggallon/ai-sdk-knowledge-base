import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100),
});
