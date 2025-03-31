import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
	email:{
		type:String,
	},
	password:{
		type:String
	}
},{versionKey:false});

const Admin = mongoose.model("Admin",AdminSchema);

export default Admin;

