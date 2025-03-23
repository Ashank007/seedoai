import express from "express";
import {
  AddFaculty,
  GetFaculy,
  GetFacultyCountByDate,
  MarkFaculty,
} from "../controllers/Faculty.controller.js";
const FacultyRouter = express.Router();

FacultyRouter.post("/add", AddFaculty);
FacultyRouter.post("/mark", MarkFaculty);
FacultyRouter.get("/getall", GetFaculy);
FacultyRouter.post("/getcount", GetFacultyCountByDate);
export default FacultyRouter;
