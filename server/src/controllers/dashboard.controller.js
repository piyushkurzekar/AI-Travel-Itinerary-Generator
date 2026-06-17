const Itinerary = require("../models/Itinerary");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const now = new Date().toISOString().split("T")[0];

  const [
    totalItineraries,
    upcomingTrips,
    sharedItineraries,
    totalDocuments,
    recentItineraries,
  ] = await Promise.all([
    Itinerary.countDocuments({ user: userId }),
    Itinerary.countDocuments({ user: userId, departureDate: { $gte: now } }),
    Itinerary.countDocuments({ user: userId, isPublic: true }),
    Itinerary.aggregate([
      { $match: { user: userId } },
      { $project: { docCount: { $size: "$uploadedDocuments" } } },
      { $group: { _id: null, total: { $sum: "$docCount" } } },
    ]),
    Itinerary.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title destination departureDate returnDate isPublic createdAt summary"),
  ]);

  const docCount = totalDocuments[0]?.total || 0;

  res.json(
    new ApiResponse(200, "Dashboard stats retrieved successfully", {
      totalItineraries,
      upcomingTrips,
      sharedItineraries,
      uploadedDocuments: docCount,
      recentItineraries,
    })
  );
});

module.exports = { getStats };
