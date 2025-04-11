import ApiResponse from '../utils/ApiResponse.js'
import ApiError from '../utils/ApiError.js'
import GenerateToken from '../utils/GenerateToken.js'
import Faculty from '../models/Faculty.models.js'
import moment from 'moment'
import bcrypt from 'bcrypt'

const Register = async (req, res) => {
 try {
  const { name, email, password } = req.body
  if (!name || !email || !password) return res.status(400).json(new ApiResponse(false, 'Name,Email and Password are required'))
  const faculty = await Faculty.findOne({ email: email })
  if (faculty) return res.status(400).json(new ApiResponse(false, 'Faculty already exists'))
  const hashedpassword = await bcrypt.hash(password, 10)
  await Faculty.create({
   name: name,
   email: email,
   password: hashedpassword
  })
  res.status(201).json(new ApiResponse(true, 'Faculty registered successfully'))
 } catch (error) {
  res.status(500).json(new ApiError(false, error.message))
 }
}

const Login = async (req, res) => {
 try {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json(new ApiResponse(false, 'Email and Password are required'))
  const faculty = await Faculty.findOne({ email: email })
  if (!faculty) return res.status(404).json(new ApiResponse(false, 'Faculty Not Found'))
  const ismatched = await bcrypt.compare(password, faculty.password)
  if (!ismatched) return res.status(400).json(new ApiResponse(false, 'Incorrect password'))
  const token = GenerateToken({ data: faculty._id })
  res.status(200).json(new ApiResponse(true, { token: token }))
 } catch (error) {
  res.status(500).json(new ApiError(false, error.message))
 }
}

const AddFaculty = async (req, res) => {
 try {
  const { email, faculty_id, block } = req.body;
  console.log(req.body);
  if (!email || !faculty_id || !block) return res.status(400).json(new ApiResponse(false, 'Email, Faculty ID, and Block are required'))
  const faculty = await Faculty.findOne({ email: email })
  if (!faculty) return res.status(404).json(new ApiResponse(false, 'Faculty Not Found'))
  faculty.facultyid = faculty_id
  faculty.block = block
  await faculty.save()
  res.status(201).json(new ApiResponse(true, 'Faculty added successfully'))
 } catch (error) {
  res.status(500).json(new ApiError(false, error.message))
 }
}

const MarkFaculty = async (req, res) => {
 try {
  const { faculty_id, type } = req.body
  if (!faculty_id || !type) return res.status(400).json(new ApiResponse(false, 'Faculty ID and type are required'))
  const faculty = await Faculty.findOne({ facultyid: faculty_id })
  if (!faculty) return res.status(404).json(new ApiResponse(false, 'Faculty not found'))
  const currentDate = moment().format('YYYY-MM-DD hh:mm A')
  faculty.timestamps.push({ att_type: type, date: currentDate })
  await faculty.save()
  res.status(200).json(new ApiResponse(true, `Attendance marked successfully for Faculty ID: ${faculty_id}`))
 } catch (error) {
  return res.status(500).json(new ApiError(false, error.message || 'Failed to mark attendance'))
 }
}

const GetFaculty = async (req, res) => {
 try {
  const data = await Faculty.find({})
  if (!data || data.length === 0) return res.status(404).json(new ApiResponse(false, 'No Data Found'))
  res.status(200).json(new ApiResponse(true, data))
 } catch (error) {
  res.status(500).json(new ApiError(false, error.message))
 }
}

const GetFacultyByBlock = async (req, res) => {
 try {
  const { block } = req.body
  if (!block) return res.status(400).json(new ApiResponse(false, 'Block is required'))
  const data = await Faculty.find({ block: block }).select('-_id')
  if (!data || data.length === 0) return res.status(404).json(new ApiResponse(false, 'No Block Found'))
  res.status(200).json(
   new ApiResponse(true, {
    count: data.length,
    faculties: data
   })
  )
 } catch (error) {
  res.status(500).json(new ApiError(false, error.message))
 }
}

const GetFacultyCountByDate = async (req, res) => {
 try {
  const date = moment().format('YYYY-MM-DD')
  console.log(date)
  const records = await Faculty.find({
   'timestamps.date': { $regex: `^${date}` } // Match records starting with YYYY-MM-DD
  })
  res.status(200).json(new ApiResponse(true, records.length))
 } catch (error) {
  res.status(500).json(new ApiError(false, error.message))
 }
}

const GetFacultyAttendance = async (req, res) => {
 try {
  const id = req.user.data
  const faculty = await Faculty.findById(id)
  if (!faculty) return res.status(404).json(new ApiResponse(false, 'Faculty Not Found'))
  const data = faculty.timestamps
  if (!data || data.length === 0) return res.status(400).json(new ApiResponse(false, 'No Attendance Records Right Now'))
  res.status(200).json(new ApiResponse(true, data))
 } catch (error) {
  res.status(500).json(new ApiError(false, error.message))
 }
}
const GetFacultyName = async (req, res) => {
 try {
  const id = req.user.data
  const faculty = await Faculty.findById(id)
  if (!faculty) return res.status(404).json(new ApiResponse(false, 'Faculty Not Found'))
  const name = faculty.name
  if (!name) return res.status(400).json(new ApiResponse(false, 'No Name Found of Faculty'))
  res.status(200).json(new ApiResponse(true, name))
 } catch (error) {
  res.status(500).json(new ApiError(false, error.message))
 }
}

const AddFacultyBulk = async (req, res) => {
 try {
  const {faculty_id, block } = req.body

  if (!faculty_id || !block || faculty_id.length !== block.length) {
   return res.status(400).json(new ApiResponse(false, 'Data is Incomplete'))
  }
  const formatteddata = faculty_id.map((e, index) => ({
   facultyid:e, 
   block: block[index]
  }))
  await Faculty.insertMany(formatteddata)
  res.status(201).json(new ApiResponse(true, 'Faculty Added in Bulk Successfully'))
 } catch (error) {
  res.status(500).json(new ApiError(false, error.message))
 }
}
export { Register, Login, AddFaculty, MarkFaculty, GetFaculty, GetFacultyByBlock, GetFacultyCountByDate, GetFacultyAttendance, GetFacultyName, AddFacultyBulk }
