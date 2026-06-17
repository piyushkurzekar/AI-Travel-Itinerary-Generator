const Itinerary = require("../models/Itinerary");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const generateShareId = require("../utils/generateShareId");

const enableSharing = asyncHandler(async (req, res) => {
  const itinerary = await Itinerary.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!itinerary) {
    throw new ApiError(404, "Itinerary not found");
  }

  // Generate a new share ID if not already set
  if (!itinerary.shareId) {
    itinerary.shareId = generateShareId();
  }
  itinerary.isPublic = true;
  await itinerary.save();

  res.json(
    new ApiResponse(200, "Sharing enabled", {
      shareId: itinerary.shareId,
      isPublic: itinerary.isPublic,
    })
  );
});

const regenerateShareLink = asyncHandler(async (req, res) => {
  const itinerary = await Itinerary.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!itinerary) {
    throw new ApiError(404, "Itinerary not found");
  }

  itinerary.shareId = generateShareId();
  itinerary.isPublic = true;
  await itinerary.save();

  res.json(
    new ApiResponse(200, "Share link regenerated", {
      shareId: itinerary.shareId,
      isPublic: itinerary.isPublic,
    })
  );
});

const disableSharing = asyncHandler(async (req, res) => {
  const itinerary = await Itinerary.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!itinerary) {
    throw new ApiError(404, "Itinerary not found");
  }

  itinerary.isPublic = false;
  await itinerary.save();

  res.json(new ApiResponse(200, "Sharing disabled successfully"));
});

const getShared = asyncHandler(async (req, res) => {
  const { shareId } = req.params;

  const itinerary = await Itinerary.findOne({
    shareId,
    isPublic: true,
  }).select(
    "title summary destination source departureDate returnDate travelerCount days travelTips packingSuggestions emergencyInformation estimatedBudget bookingDetails createdAt"
  );

  if (!itinerary) {
    throw new ApiError(404, "Shared itinerary not found or sharing has been disabled");
  }

  res.json(
    new ApiResponse(200, "Shared itinerary retrieved successfully", itinerary)
  );
});

module.exports = { enableSharing, regenerateShareLink, disableSharing, getShared };
