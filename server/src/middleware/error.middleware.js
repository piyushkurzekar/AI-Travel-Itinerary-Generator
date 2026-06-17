const ApiError = require("../utils/ApiError");
const env = require("../config/env");

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error.status || (error.name === "CastError" ? 400 : 500);
    const message =
      error.message || "Something went wrong. Please try again.";
    error = new ApiError(statusCode, message);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    error = new ApiError(
      409,
      `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
    );
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = new ApiError(400, messages.join(". "));
  }

  // Multer errors
  if (err.code === "LIMIT_FILE_SIZE") {
    error = new ApiError(400, "File size exceeds the 10MB limit");
  }
  if (err.code === "LIMIT_FILE_COUNT") {
    error = new ApiError(400, "Too many files. Maximum 5 files allowed");
  }
  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    error = new ApiError(400, "Unexpected file field");
  }

  const response = {
    success: false,
    message: error.message,
    ...(error.errors?.length > 0 && { errors: error.errors }),
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  };

  res.status(error.statusCode || 500).json(response);
};

module.exports = errorHandler;
