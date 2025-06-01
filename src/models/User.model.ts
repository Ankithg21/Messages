import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document{
    content: string;
    createdAt: Date;
}

export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];
}

const MessageSchema: Schema<Message> = new mongoose.Schema({
    content:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now,
    }
});

const UserSchema: Schema<User> = new mongoose.Schema({
    username:{
        type: String,
        required: [true, "Username is required"],
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please use valid Email."],
        unique: true,
    },
    password:{
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode:{
        type: String,
        required: [true, "Verify Code is required."]
    },
    verifyCodeExpiry:{
        type: Date,
        required: [true, "verify Code Expiry is required."]
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    isAcceptingMessage:{
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema]
});

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", UserSchema);
export default UserModel;
