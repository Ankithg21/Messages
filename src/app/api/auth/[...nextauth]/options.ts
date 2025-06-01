import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/dbConnect";
import UserModel from "@/models/User.model";

export const authOptions: NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials): Promise<any>{
                await connectDB();
                if (!credentials) {
                    throw new Error("No credentials provided");
                }

                try {
                    const user = await UserModel.findOne({
                        $or:[
                            { email: credentials.username },
                            { username: credentials.username }
                        ]
                    });
                    if(!user){
                        throw new Error("No user found with this Email");
                    }
                    if(!user.isVerified){
                        throw new Error("Please verify your Account before login.");
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if(isPasswordCorrect){
                        return user;
                    }
                    else{
                        throw new Error("Incorrect Password.");
                    }
                } catch (error: any) {
                    throw new Error(error);
                }
            }
        })
    ],
    callbacks:{
        async jwt({token, user}){
            if(user){
                token._id = user._id ? user._id.toString() : undefined;
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
        async session({session, token}){
            if(token){
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session;
        }
    },
    pages:{
        signIn: "/sign-in",
    },
    session:{
        strategy:"jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
};