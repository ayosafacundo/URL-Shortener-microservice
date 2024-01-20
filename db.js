import mongoose from "mongoose";

const uri = process.env.ATLAS_URI || "";

async function connect() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(error);
    }
}
connect();
