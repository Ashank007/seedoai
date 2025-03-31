import express from 'express';
import { Login, Register } from '../controllers/Admin.controller.js';
import { GetAllLeaves, UpdateLeave } from '../controllers/Leave.controller.js';

const AdminRouter = express.Router();

AdminRouter.post("/register",Register);
AdminRouter.post("/login",Login);
AdminRouter.get("/getall",GetAllLeaves);
AdminRouter.post("/update-leave",UpdateLeave);
export default AdminRouter;
