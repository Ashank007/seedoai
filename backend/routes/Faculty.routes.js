import express from 'express'
import { AddFaculty, GetFaculty, GetFacultyCountByDate, MarkFaculty, GetFacultyByBlock, Register, Login ,GetFacultyAttendance, GetFacultyName} from '../controllers/Faculty.controller.js'
import isauthenticated from "../middlewares/isauthenticated.js";
import { AddLeave, GetAllFacultyLeaves} from '../controllers/Leave.controller.js';
import upload from '../utils/UploadFiles.js';
const FacultyRouter = express.Router();
FacultyRouter.post('/register', Register);
FacultyRouter.post('/login', Login);
FacultyRouter.post('/add', AddFaculty);
FacultyRouter.post('/mark', MarkFaculty);
FacultyRouter.get('/getall', GetFaculty);
FacultyRouter.post('/getbyblock', GetFacultyByBlock);
FacultyRouter.get('/getcount', GetFacultyCountByDate);
FacultyRouter.get("/attendance", isauthenticated,GetFacultyAttendance);
FacultyRouter.get("/name",isauthenticated,GetFacultyName);
FacultyRouter.post("/addleave",isauthenticated,upload.single("file"),AddLeave);
FacultyRouter.get("/allleaves",isauthenticated,GetAllFacultyLeaves);
export default FacultyRouter
