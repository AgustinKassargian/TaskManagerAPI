import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const CLUSTER = process.env.CLUSTER
const DB_NAME = process.env.DB_NAME;

export const connectDB = async()=>{
    try {
        console.log(`Conectando a la base de datos en ${DB_NAME} como ${DB_USER}`);
        await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${CLUSTER}.7kjqm.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`)
        console.log('DB connected')
        
    } catch (error) {
        console.log(error)
    }
}
