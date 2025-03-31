import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import GenerateToken from '../utils/GenerateToken.js';
import Admin from '../models/Admin.models.js';
import bcrypt from 'bcrypt';
const Register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json(new ApiResponse(false, 'Email and Password is required'));
    const existingAdmin = await Admin.findOne({ email: email });
    if (existingAdmin)
      return res
        .status(400)
        .json(new ApiResponse(false, 'Admin already exists'));
    const hasedpassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ email: email, password: hasedpassword });
    res
      .status(201)
      .json(new ApiResponse(true, 'Admin registered successfully'));
  } catch (error) {
    res.status(500).json(new ApiError(false, error.message));
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json(new ApiResponse(false, 'Email and Password is required'));
    const admin = await Admin.findOne({ email: email });
    if (!admin)
      return res.status(404).json(new ApiResponse(false, 'Admin Not Found'));
    const ismatched = await bcrypt.compare(password, admin.password);
    if (!ismatched)
      return res
        .status(400)
        .json(new ApiResponse(false, 'Password you entered is wrong'));
    const token = GenerateToken({ data: admin._id });
    res.status(200).json(new ApiResponse(true, {token:token}));
  } catch (error) {
    res.status(500).json(new ApiError(false, error.message));
  }
};
export { Register, Login };
