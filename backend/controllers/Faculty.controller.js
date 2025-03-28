import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import Faculty from '../models/Faculty.models.js';
import moment from 'moment';

const AddFaculty = async (req, res) => {
  try {
    const { faculty_id, block } = req.body;
    if (!faculty_id || !block)
      return res
        .status(400)
        .json(new ApiResponse(false, 'Faculty Id and Block is required'));
    const faculty = await Faculty.findOne({ facultyid: faculty_id });
    if (faculty)
      return res
        .status(400)
        .json(new ApiResponse(false, 'Faculty Already Registered'));
    const newFaculty = await Faculty.create({
      facultyid: faculty_id,
      block: block,
    });
    res.status(201).json(new ApiResponse(true, 'Faculty added successfully'));
  } catch (error) {
    res.status(500).json(new ApiError(false, error.message));
  }
};

const MarkFaculty = async (req, res) => {
  try {
    const { faculty_id, type } = req.body;
    if (!faculty_id || !type)
      return res
        .status(400)
        .json(new ApiResponse(false, 'Faculty ID and type is required'));
    const faculty = await Faculty.findOne({ facultyid: faculty_id });
    if (!faculty)
      return res.status(404).json(new ApiResponse(false, 'Faculty not found'));
    const currentDate = moment().format('YYYY-MM-DD hh:mm A');
    const lastTimestamp = faculty.timestamps[faculty.timestamps.length - 1];
    if (lastTimestamp) {
      const isSameDay = moment(lastTimestamp.date, 'YYYY-MM-DD hh:mm A').isSame(
        moment(currentDate, 'YYYY-MM-DD hh:mm A'),
        'day',
      );
      if (isSameDay && lastTimestamp.att_type === type) {
        lastTimestamp.date = currentDate;
      } else {
        faculty.timestamps.push({ att_type: type, date: currentDate });
      }
    } else {
      faculty.timestamps.push({ att_type: type, date: currentDate });
    }
    await faculty.save();
    return res
      .status(200)
      .json(
        new ApiResponse(
          true,
          `Attendance Marked successfully for Faculty ID: ${faculty_id}`,
        ),
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(false, error.message || 'Failed to mark attendance'));
  }
};

const GetFaculy = async (req, res) => {
  try {
    const data = await Faculty.find({});
    if (!data)
      return res.status(404).json(new ApiResponse(false, 'No Data Found'));
    res.status(200).json(new ApiResponse(true, data));
  } catch (error) {
    res.status(500).json(new ApiError(false, error.message));
  }
};

const GetFacultyByBlock = async (req, res) => {
  try {
    const { block } = req.body;
    if (!block)
      return res.status(400).json(new ApiResponse('Block is required'));

    const data = await Faculty.find({ block: block }).select("-_id");

    if (!data || data.length === 0)
      return res.status(404).json(new ApiResponse('No Block Found'));

    res.status(200).json(new ApiResponse(true, {
      count: data.length,    
      faculties: data          
     }));
  } catch (error) {
    res.status(500).json(new ApiError(false, error.message));
  }
};

const GetFacultyCountByDate = async (req, res) => {
  try {
    const date = moment().format('YYYY-MM-DD');
    const records = await Faculty.find({
      'timestamps.date': { $regex: `^${date}` }, // Match records starting with YYYY-MM-DD
    });
    res.status(200).json(new ApiResponse(true, records.length));
  } catch (error) {
    res.status(500).json(new ApiError(false, error.message));
  }
};

export { AddFaculty, MarkFaculty, GetFaculy,GetFacultyByBlock,GetFacultyCountByDate };
