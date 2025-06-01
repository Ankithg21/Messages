import mongoose from "mongoose";

type connectionObject={
    isConnected?: number,
};

const connection: connectionObject = {};

async function connectDB(): Promise<void>{
    if(connection.isConnected){
        console.log("Database already connected.");
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URL!);
        connection.isConnected = db.connections[0].readyState;
        console.log("Database connected Successfully.");
        return;
    } catch (error: any) {
        console.log("Failed to connect Database.", error.message);
        process.exit(1);
        return;
    }
}

module.exports = connectDB;