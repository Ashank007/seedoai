import express from "express";
import {
  AddVehicle,
  MarkVehicle,
  GetVehicle,
  GetVehicleCountByDate,
} from "../controllers/Vehicle.controller.js";
const VehicleRouter = express.Router();

VehicleRouter.post("/add", AddVehicle);
VehicleRouter.post("/mark", MarkVehicle);
VehicleRouter.get("/getall", GetVehicle);
VehicleRouter.get("/getcount", GetVehicleCountByDate);

export default VehicleRouter;
