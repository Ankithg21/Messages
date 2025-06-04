import connectDB from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { Message } from "@/models/User.model";

export async function POST(request: Request){
    await connectDB();

    const {username, content} = await request.json();
    try{
        const user = await UserModel.findOne({username});

        if(!user){
            return Response.json(
                {success: false, message: "User not found."},
                {status: 400},
            );
        }
        if(!user.isAcceptingMessage){
            return Response.json(
                {success: false, message: `${user.email} is not receiving messages.`},
                {status: 400},
            );
        }

        const newContent = {content, createdAt: new Date()};
        user.messages.push(newContent as Message);
        await user.save();

        return Response.json(
            {success: true, message: "Message sent successfully."},
            {status: 200},
        );
    }
    catch(error: any){
        console.log("Error adding messages.", error.message);
        return Response.json(
            {success: false, message: "Internal server error."},
            {status: 400},
        );
    }
};