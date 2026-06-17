const Itinerary = require("../models/Itinerary");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { generateItinerary } = require("../services/ai.service");

const generate = asyncHandler(async (req, res) => {
  const {
    travelerName,
    source,
    destination,
    departureDate,
    returnDate,
    travelerCount = 1,
    interests = [],
    budgetType = "medium",
    travelPace = "balanced",
    specialRequests = "",
    bookingDetails = {},
    uploadedDocuments = [],
  } = req.body;

  // Generate itinerary via AI
  const aiItinerary = await generateItinerary({
    travelerName,
    source,
    destination,
    departureDate,
    returnDate,
    travelerCount,
    interests,
    budgetType,
    travelPace,
    specialRequests,
    bookingDetails,
  });

  // Save to MongoDB
  const itinerary = await Itinerary.create({
    user: req.user._id,
    title: aiItinerary.title,
    summary: aiItinerary.summary,
    travelerName,
    source,
    destination,
    departureDate,
    returnDate,
    travelerCount,
    interests,
    budgetType,
    travelPace,
    specialRequests,
    bookingDetails,
    uploadedDocuments,
    days: aiItinerary.days || [],
    travelTips: aiItinerary.travelTips || [],
    packingSuggestions: aiItinerary.packingSuggestions || [],
    emergencyInformation: aiItinerary.emergencyInformation || [],
    estimatedBudget: aiItinerary.estimatedBudget || {},
    status: "generated",
  });

  res
    .status(201)
    .json(new ApiResponse(201, "Itinerary generated successfully", itinerary));
});

const getAll = asyncHandler(async (req, res) => {
  const {
    search,
    filter,
    sort = "newest",
    page = 1,
    limit = 10,
  } = req.query;

  const query = { user: req.user._id };

  if (search) {
    query.$or = [
      { destination: { $regex: search, $options: "i" } },
      { title: { $regex: search, $options: "i" } },
      { source: { $regex: search, $options: "i" } },
    ];
  }

  const now = new Date().toISOString().split("T")[0];
  if (filter === "upcoming") {
    query.departureDate = { $gte: now };
  } else if (filter === "past") {
    query.departureDate = { $lt: now };
  } else if (filter === "shared") {
    query.isPublic = true;
  }

  const sortOrder = sort === "travel_date" ? { departureDate: -1 } : { createdAt: -1 };
  const skip = (Number(page) - 1) * Number(limit);

  const [itineraries, total] = await Promise.all([
    Itinerary.find(query)
      .sort(sortOrder)
      .skip(skip)
      .limit(Number(limit))
      .select("-days -travelTips -packingSuggestions -emergencyInformation"),
    Itinerary.countDocuments(query),
  ]);

  res.json(
    new ApiResponse(200, "Itineraries retrieved successfully", {
      itineraries,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    })
  );
});

const getOne = asyncHandler(async (req, res) => {
  const itinerary = await Itinerary.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!itinerary) {
    throw new ApiError(404, "Itinerary not found");
  }

  res.json(new ApiResponse(200, "Itinerary retrieved successfully", itinerary));
});

const update = asyncHandler(async (req, res) => {
  const itinerary = await Itinerary.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!itinerary) {
    throw new ApiError(404, "Itinerary not found");
  }

  const allowedUpdates = [
    "title",
    "summary",
    "travelerName",
    "source",
    "destination",
    "departureDate",
    "returnDate",
    "travelerCount",
    "interests",
    "budgetType",
    "travelPace",
    "specialRequests",
    "days",
    "travelTips",
    "packingSuggestions",
    "emergencyInformation",
    "estimatedBudget",
  ];

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      itinerary[field] = req.body[field];
    }
  });

  await itinerary.save();
  res.json(new ApiResponse(200, "Itinerary updated successfully", itinerary));
});

const remove = asyncHandler(async (req, res) => {
  const itinerary = await Itinerary.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!itinerary) {
    throw new ApiError(404, "Itinerary not found");
  }

  res.json(new ApiResponse(200, "Itinerary deleted successfully"));
});

module.exports = { generate, getAll, getOne, update, remove };
