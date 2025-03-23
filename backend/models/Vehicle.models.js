import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema({
	vehicleid: {
		type: String,
	},
	timestamps: [
		{
			att_type: {
				type: String,
			        enum : ["CheckIn","CheckOut"]
			},
			date: {
				type: String,
			},
		},
	],
},{versionKey:false});

const Vehicle = mongoose.model("Vehicle",VehicleSchema);

export default Vehicle;
