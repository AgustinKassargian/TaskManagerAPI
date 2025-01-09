import express from "express";
import morgan from "morgan";
import router from "./routes/router.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const CLIENT_URL = process.env.CLIENT_URL

const app = express();
app.use(cors({
    origin: CLIENT_URL,
    credentials:true
}))
app.use(morgan('dev'));
app.use(cookieParser())
app.use(express.json());
app.use('/api',router);


export default app;
