const { body, validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    throw new ApiError(400, messages[0], errors.array());
  }
  next();
};

const generateItineraryValidator = [
  body("source").trim().notEmpty().withMessage("Source location is required"),
  body("destination").trim().notEmpty().withMessage("Destination is required"),
  body("departureDate").notEmpty().withMessage("Departure date is required"),
  body("travelerCount")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Traveler count must be between 1 and 20"),
  body("budgetType")
    .optional()
    .isIn(["budget", "medium", "premium"])
    .withMessage("Budget type must be budget, medium, or premium"),
  body("travelPace")
    .optional()
    .isIn(["relaxed", "balanced", "fast-paced"])
    .withMessage("Travel pace must be relaxed, balanced, or fast-paced"),
  handleValidationErrors,
];

module.exports = { generateItineraryValidator };
