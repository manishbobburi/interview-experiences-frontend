import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
});

export const signUpSchema = z.object({
  name: z.string().min(2, "Too short"),
  email: z.string().email(),
  password: z.string().min(6),
});

export type SignInPayload = z.infer<typeof signInSchema>;
export type SignUpPayload = z.infer<typeof signUpSchema>;