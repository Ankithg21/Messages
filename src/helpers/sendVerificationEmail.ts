import { resend } from "@/lib/resend";
import VerificationEmail from "../../Emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Anonymous Message Verification Code!',
            react: VerificationEmail({username, otp: verifyCode}),
        });

        return {
            success: true,
            message: "Verification Email sent successfully."
        }
    } catch (error: any) {
        console.error("Error sending verification email.", error.message);
        return {
            success: false,
            message: "Failed to send verification Email."
        }
    }
    
}