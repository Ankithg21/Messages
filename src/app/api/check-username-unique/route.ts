import connectDB from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(request: Request): Promise<Response> {
    if(request.method === 'POST'){
        return Response.json(
            {success: false, message: "Method not allowed."},
            {status: 405},
        );
    }

    // connecting DB
    await connectDB();

    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username'),
        };

        // Validate with ZOD
        const result = UsernameQuerySchema.safeParse(queryParam);
        if (!result.success) {
            return Response.json(
                { success: false, message: "Zod validation failed for username schema." },
                { status: 400 }
            );
        }

        const {username} = result.data;
        const user = await UserModel.findOne({ username, isVerified: true });
        if (user) {
            return Response.json(
                { success: false, message: "Username already exists, try another one!" },
                { status: 400 }
            );
        }

        return Response.json(
            { success: true, message: "Username is unique." },
            { status: 200 }
        );
    } catch (error: any) {
        console.log("Error checking username:", error.message);
        return Response.json(
            { success: false, message: "Error checking username" },
            { status: 500 }
        );
    }
}
