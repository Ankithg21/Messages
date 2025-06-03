import connectDB from "@/lib/dbConnect";
import UserModel from "@/models/User.model";

export async function POST(request: Request): Promise<Response> {
    // Connect DB
    await connectDB();

    try {
        const { username, code } = await request.json();
        const user = await UserModel.findOne({ username });

        if (!user) {
            return Response.json(
                { success: false, message: "User not found." },
                { status: 400 }
            );
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json(
                { success: true, message: "User verified successfully." },
                { status: 200 }
            );
        }
        if (!isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    message: "Verification code has expired, please sign up again to get a new code.",
                },
                { status: 400 }
            );
        }
        return Response.json(
            { success: false, message: "Invalid verification code." },
            { status: 400 }
        );

    } catch (error: any) {
        console.error("Error verifying user:", error);
        return Response.json(
            { success: false, message: "Internal server error while verifying user." },
            { status: 500 }
        );
    }
}
