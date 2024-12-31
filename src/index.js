import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./db.js";

dotenv.config();

const port = process.env.PORT || 3000;

connectDB();
app.listen(port)
console.log('Server on port', port)