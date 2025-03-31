import express from 'express';
import dotenv from "dotenv";
import ConnectDb from "./config/ConnectDb.js"
import StudentRouter from './routes/Student.routes.js';
import FacultyRouter from './routes/Faculty.routes.js';
import VehicleRouter from './routes/Vehicle.routes.js';
import AdminRouter from './routes/Admin.routes.js';
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
const app = express();
ConnectDb();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/", (_, res) => {
	res.send("<h1> Backend Server is Working</h1>");
});
app.use("/api/v1/student",StudentRouter);
app.use("/api/v1/faculty",FacultyRouter);
app.use("/api/v1/vehicle",VehicleRouter);
app.use("/api/v1/admin",AdminRouter);
export default app;

