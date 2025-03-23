import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
	studentid: {
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
	block:{
		type:String
	}
},{versionKey:false});

const Student = mongoose.model("Student",StudentSchema);

export default Student;
