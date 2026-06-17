const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { generateToken, setTokenCookie } = require("../utils/generateToken");

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);
  setTokenCookie(res, token);

  res
    .status(201)
    .json(new ApiResponse(201, "Account created successfully", user.toPublicJSON()));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user._id);
  setTokenCookie(res, token);

  res.json(new ApiResponse(200, "Login successful", user.toPublicJSON()));
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
  });
  res.json(new ApiResponse(200, "Logged out successfully"));
});

const getMe = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, "User retrieved successfully", req.user.toPublicJSON()));
});

module.exports = { register, login, logout, getMe };
