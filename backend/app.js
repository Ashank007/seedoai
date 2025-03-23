import express from 'express';
import dotenv from "dotenv";
import ConnectDb from "./config/ConnectDb.js"
import StudentRouter from './routes/Student.routes.js';
import FacultyRouter from './routes/Faculty.routes.js';
import VehicleRouter from './routes/Vehicle.routes.js';
dotenv.config();
const app = express();
ConnectDb();
app.use(express.json());

app.get("/", (_, res) => {
	res.send("<h1> Backend Server is Working</h1>");
});
app.use("/api/v1/student",StudentRouter);
app.use("/api/v1/faculty",FacultyRouter);
app.use("/api/v1/vehicle",VehicleRouter);
export default app;

