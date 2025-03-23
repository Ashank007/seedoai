import mongoose from "mongoose";

const FacultySchema = new mongoose.Schema({
	facultyid: {
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

const Faculty = mongoose.model("Faculty",FacultySchema);

export default Faculty;


