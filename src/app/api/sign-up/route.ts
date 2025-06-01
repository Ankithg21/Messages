import connectDB from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request){
    await connectDB();
    try {
        const {username, email, password} = await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({
            email,
            isVerified: true
        });
        if(existingUserVerifiedByUsername){
            return Response.json(
                {success: false, message: "Username is already Taken!."},
                {status: 400},
            );
        }

        const verifyCode = Math.floor(100000 + Math.random()*900000).toString();
        const existingUserByEmail = await UserModel.findOne({email});

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json(
                    {success: false, message: "User already exist with this email."},
                    {status: 400},
                );
            }
            else{
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            });
            await newUser.save();
        }

        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        if(!emailResponse.success){
            return Response.json(
                {success: false, message: emailResponse.message},
                {status: 500},
            );
        }

        return Response.json(
            {success: true, message: "User registered Successfully, please verify your email."},
            {status: 200},
        );

    } catch (error: any) {
        console.error("Error Registering User", error.message);
        return Response.json(
            {success: false, message: "Error Registering User."},
            {status: 500},
        );
    }
};
