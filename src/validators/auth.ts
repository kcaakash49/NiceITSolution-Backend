import { z } from "zod";

export const SignUpSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),

  email: z
    .string()
    .email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters"),

  role: z.enum(["superadmin", "support"]),
});


export const SignInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });