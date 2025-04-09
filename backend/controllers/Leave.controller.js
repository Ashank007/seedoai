import ApiResponse from '../utils/ApiResponse.js'
import ApiError from '../utils/ApiError.js'
import Faculty from '../models/Faculty.models.js'
import Leave from '../models/Leaves.models.js'
const AddLeave = async(req,res) => {
 try {	
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }
  const id = req.user.data;
  const faculty = await Faculty.findById(id);
  const {reason,startdate,enddate} = req.body;
  if(!faculty) return res.status(404).json(new ApiResponse(false,"Faculty not found")); 
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  const leave = await Leave.create({reason:reason,startdate:startdate,enddate:enddate,proof:fileUrl,appliedby:id});
  faculty.leaves.push(leave._id);
  await faculty.save();
  res.status(201).json(new ApiResponse(true,"Leave Applied Successfully"));

 } catch (error) {
  res.status(500).json(new ApiError(false,error.message));	
 }
}
const GetAllFacultyLeaves = async(req,res) => {
try { 
  const id = req.user.data;
  const faculty = await Faculty.findById(id).populate("leaves");
  if(!faculty) return res.status(404).json(new ApiResponse(false,"Faculty not found"));
  const data = faculty.leaves;
  res.status(200).json(new ApiResponse(true,data));
} catch (error) {
  res.status(500).json(new ApiError(false,error.message));	
}
}
const GetAllLeaves = async (req,res) => {
try {
  const leavesdata = [];
  const leaves = await Leave.find({}).populate("appliedby","name email facultyid").select("reason leavestatus proof startdate enddate");
  leaves.forEach((data) => {
	if(data) leavesdata.push(data);
  })
  res.status(200).json(new ApiResponse(true,leavesdata));
} catch (error) {
  res.status(500).json(new ApiError(false,error.message));	
}
}
const UpdateLeave = async(req,res) => {
try {
   const {leaveId,leaveStatus} = req.body;
   console.log(leaveId,leaveStatus);
   if(!leaveId || !leaveStatus) return res.status(400).json(new ApiResponse(false,"leaveId and leaveStatus is required"));
   const leave = await Leave.findByIdAndUpdate(leaveId,{leavestatus:leaveStatus},{new:true});
   res.status(200).json(new ApiResponse(true,"Leave Updated Successfully"));
} catch (error) {	
  res.status(500).json(new ApiError(false,error.message));	
}
}
export {AddLeave,GetAllFacultyLeaves,GetAllLeaves,UpdateLeave};

