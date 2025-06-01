import { z } from "zod";

export const usernameValidaion = z
    .string()
    .min(2, "Username must be atleast 2 Characters.")
    .max(20, "Username must be no more than 20 Characters.")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character.")

export const signUpSchema = z.object({
    username: usernameValidaion,
    email: z.string().email({message: "Invalid Email."}),
    password: z.string().min(6, {message: "password must be atleast 6 characters"})
});  