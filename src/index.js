import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./db.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL

connectDB();
app.listen(PORT);
console.log('Server on port', PORT);
console.log(`Documentación disponible en ${BASE_URL}/api-docs`);