import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  isAdmin: z.boolean(),
  first_name: z.string(),
  last_name: z.string(),
});
export type User = z.infer<typeof UserSchema>;
