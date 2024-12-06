import { z } from "zod";

export const ErrorObjSchema = z.object({
  message: z.string(),
});
export type ErrorElement = z.infer<typeof ErrorObjSchema>;

export const ErrorResponseSchema = z.object({
  errors: z.array(ErrorObjSchema),
});
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
