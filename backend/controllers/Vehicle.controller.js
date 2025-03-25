import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import Vehicle from '../models/Vehicle.models.js';
import moment from 'moment';

const AddVehicle = async (req, res) => {
  try {
    const { vehicle_id } = req.body;
    if (!vehicle_id)
      return res
        .status(400)
        .json(new ApiResponse(false, 'Vehicle Id is required'));
    const vehicle = await Vehicle.findOne({ vehicleid: vehicle_id });
    if (vehicle)
      return res
        .status(400)
        .json(new ApiResponse(false, 'Vehicle Already Registered'));
    const newVehicle = await Vehicle.create({ vehicleid: vehicle_id });
    res.status(201).json(new ApiResponse(true, 'Vehicle added successfully'));
  } catch (error) {
    res.status(500).json(new ApiError(false, error.message));
  }
};

const MarkVehicle = async (req, res) => {
  try {
    const { vehicle_id, type } = req.body;
    if (!vehicle_id || !type)
      return res
        .status(400)
        .json(new ApiResponse(false, 'Vehicle ID and type is required'));
    const vehicle = await Vehicle.findOne({ vehicleid: vehicle_id });
    if (!vehicle)
      return res.status(404).json(new ApiResponse(false, 'Vehicle not found'));
    const currentDate = moment().format('YYYY-MM-DD hh:mm A');
    const lastTimestamp = vehicle.timestamps[vehicle.timestamps.length - 1];
    if (lastTimestamp) {
      const isSameDay = moment(lastTimestamp.date, 'YYYY-MM-DD hh:mm A').isSame(
        moment(currentDate, 'YYYY-MM-DD hh:mm A'),
        'day',
      );
      if (isSameDay && lastTimestamp.att_type === type) {
        lastTimestamp.date = currentDate;
      } else {
        vehicle.timestamps.push({ att_type: type, date: currentDate });
      }
    } else {
      vehicle.timestamps.push({ att_type: type, date: currentDate });
    }
    await vehicle.save();
    return res
      .status(200)
      .json(
        new ApiResponse(
          true,
          `Entry added successfully for Vehicle ID: ${vehicle_id}`,
        ),
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(false, error.message || 'Failed to mark attendance'));
  }
};

const GetVehicle = async (req, res) => {
  try {
    const data = await Vehicle.find({});
    if (!data)
      return res.status(404).json(new ApiResponse(false, 'No Data Found'));
    res.status(200).json(new ApiResponse(true, data));
  } catch (error) {
    res.status(500).json(new ApiError(false, error.message));
  }
};

const GetVehicleCountByDate = async (req, res) => {
  try {
    const date = moment().format('YYYY-MM-DD');
    const records = await Vehicle.find({
      'timestamps.date': { $regex: `^${date}` }, // Match records starting with YYYY-MM-DD
    });
    res.status(200).json(new ApiResponse(true, records.length));
  } catch (error) {
    res.status(500).json(new ApiError(false, error.message));
  }
};
export { AddVehicle, MarkVehicle, GetVehicle, GetVehicleCountByDate };
