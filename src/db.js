import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB_URL = process.env.DB_URL

export const connectDB = async()=>{
    try {
        console.log(`Conectando a la base de datos.`);
        await mongoose.connect(DB_URL)
        console.log('DB connected')
        
    } catch (error) {
        console.log(error)
    }
}
