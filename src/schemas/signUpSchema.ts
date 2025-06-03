import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast 2 Characters.")
    .max(20, "Username must be no more than 20 Characters.")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid Email."}),
    password: z.string().min(6, {message: "password must be atleast 6 characters"})
});  