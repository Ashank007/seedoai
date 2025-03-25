import express from 'express';
import {
  AddFaculty,
  GetFaculy,
  GetFacultyCountByDate,
  MarkFaculty,
  GetFacultyByBlock,
} from '../controllers/Faculty.controller.js';
const FacultyRouter = express.Router();

FacultyRouter.post('/add', AddFaculty);
FacultyRouter.post('/mark', MarkFaculty);
FacultyRouter.get('/getall', GetFaculy);
FacultyRouter.post('/getbyblock', GetFacultyByBlock);
FacultyRouter.get('/getcount', GetFacultyCountByDate);
export default FacultyRouter;
