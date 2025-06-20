import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import connectDB from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import {User} from "next-auth";

export async function POST(request: Request): Promise<Response> {
    await connectDB();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User

    if(!session || !session.user){
        return Response.json(
            {success: false, message: "Not Authenticated."},
            {status: 401},
        );
    }

    const userId = user._id;
    const {acceptMessages} = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId, 
            {isAcceptingMessage: acceptMessages},
            {new: true},
        );
        if(!updatedUser){
            return Response.json(
                {success: false, message: "Failed to update status to accept messages"},
                {status: 401}
            )
        }
        return Response.json(
            {success: true, message: "Message acceptance status updated successfully."},
            {status: 200}
        );

    } catch (error: any) {
        console.log("Failed to update user status to accept messages", error.message);
        return Response.json(
            {success: false, message: "Failed to update user status to accept messages"},
            {status: 500},
        );
    }
}

export async function GET(request: Request): Promise<Response> {
    await connectDB();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if(!session || !session.user){
        return Response.json(
            {success: false, message: "Not authenticated."},
            {status: 401},
        );
    }

    const userId = user._id;
    try {
        const foundUser = await UserModel.findById(userId);
        if(!foundUser){
            return Response.json(
                {success: false, message: "User not found"},
                {status: 404},
            );
        }

        return Response.json(
            {success: true, isAcceptingMessages: foundUser.isAcceptingMessage},
            {status: 200},
        )
    } catch (error: any) {
        console.log("Error in getting message acceptance status", error.message);
        return Response.json(
            {success: false, message: "Error in getting message acceptance status"},
            {status: 500},
        );
    }
}
