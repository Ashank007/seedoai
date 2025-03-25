import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import Student from '../models/Student.models.js';
import moment from 'moment';

const AddStudent = async (req, res) => {
  try {
    const { student_id } = req.body;
    if (!student_id)
      return res
        .status(400)
        .json(new ApiResponse(false, 'Student Id is required'));
    const student = await Student.findOne({ studentid: student_id });
    if (student)
      return res
        .status(400)
        .json(new ApiResponse(false, 'Student already exists'));
    const newStudent = await Student.create({ studentid: student_id });
    res.status(201).json(new ApiResponse(true, 'Student created successfully'));
  } catch (error) {
    res.status(500).json(new ApiError(false, error.message));
  }
};

const MarkAttendance = async (req, res) => {
  try {
    const { student_id, type } = req.body;
    if (!student_id || !type)
      return res
        .status(400)
        .json(
          new ApiResponse(false, 'Student ID and attendance type are required'),
        );
    const student = await Student.findOne({ studentid: student_id });
    if (!student)
      return res.status(404).json(new ApiResponse(false, 'Student not found'));
    const currentDate = moment().format('YYYY-MM-DD hh:mm A');
    student.timestamps.push({ att_type: type, date: currentDate });
    await student.save();
    return res
      .status(200)
      .json(
        new ApiResponse(
          true,
          `Attendance marked successfully for Student ID: ${student_id}`,
        ),
      );
  } catch (error) {
    console.error('Error marking attendance:', error);
    return res
      .status(500)
      .json(new ApiError(false, error.message || 'Failed to mark attendance'));
  }
};

const GetStudent = async (req, res) => {
  try {
    const data = await Student.find({});
    if (!data)
      return res.status(404).json(new ApiResponse(false, 'No Data Found'));
    res.status(200).json(new ApiResponse(true, data));
  } catch (error) {
    res.status(500).json(new ApiError(false, error.message));
  }
};
const GetStudentCountByDate = async (req, res) => {
  try {
    const date = moment().format('YYYY-MM-DD');
    const records = await Student.find({
      'timestamps.date': { $regex: `^${date}` }, // Match records starting with YYYY-MM-DD
    });
    res.status(200).json(new ApiResponse(true, records.length));
  } catch (error) {
    res.status(500).json(new ApiError(false, error.message));
  }
};
export { AddStudent, MarkAttendance, GetStudent, GetStudentCountByDate };
