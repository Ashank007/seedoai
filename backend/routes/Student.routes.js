import express from "express";
import {
  AddStudent,
  GetStudent,
  GetStudentCountByDate,
  MarkAttendance,
} from "../controllers/Student.controller.js";
const StudentRouter = express.Router();

StudentRouter.post("/add", AddStudent);
StudentRouter.post("/mark", MarkAttendance);
StudentRouter.get("/getall", GetStudent);
StudentRouter.get("/getcount", GetStudentCountByDate);

export default StudentRouter;
