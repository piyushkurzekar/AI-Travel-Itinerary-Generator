const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  time: { type: String },
  activity: { type: String, required: true },
  location: { type: String },
  description: { type: String },
  estimatedCost: { type: Number, default: 0 },
});

const daySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  date: { type: String },
  title: { type: String },
  activities: [activitySchema],
  meals: [{ type: String }],
  transport: { type: String },
  notes: { type: String },
});

const flightSchema = new mongoose.Schema({
  airline: { type: String },
  flightNumber: { type: String },
  departureAirport: { type: String },
  arrivalAirport: { type: String },
  departureDate: { type: String },
  departureTime: { type: String },
  arrivalDate: { type: String },
  arrivalTime: { type: String },
});

const hotelSchema = new mongoose.Schema({
  hotelName: { type: String },
  address: { type: String },
  checkIn: { type: String },
  checkOut: { type: String },
  bookingReference: { type: String },
});

const otherBookingSchema = new mongoose.Schema({
  type: { type: String },
  details: { type: String },
});

const documentSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  fileUrl: { type: String, required: true },
  publicId: { type: String },
});

const itinerarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    summary: { type: String },
    travelerName: { type: String },
    source: { type: String, required: true },
    destination: { type: String, required: true },
    departureDate: { type: String, required: true },
    returnDate: { type: String },
    travelerCount: { type: Number, default: 1, min: 1 },
    interests: [{ type: String }],
    budgetType: {
      type: String,
      enum: ["budget", "medium", "premium"],
      default: "medium",
    },
    travelPace: {
      type: String,
      enum: ["relaxed", "balanced", "fast-paced"],
      default: "balanced",
    },
    specialRequests: { type: String },
    bookingDetails: {
      flights: [flightSchema],
      hotels: [hotelSchema],
      otherBookings: [otherBookingSchema],
    },
    uploadedDocuments: [documentSchema],
    days: [daySchema],
    travelTips: [{ type: String }],
    packingSuggestions: [{ type: String }],
    emergencyInformation: [{ type: String }],
    estimatedBudget: {
      accommodation: { type: Number, default: 0 },
      food: { type: Number, default: 0 },
      transport: { type: Number, default: 0 },
      activities: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ["draft", "generated", "published"],
      default: "generated",
    },
    isPublic: { type: Boolean, default: false, index: true },
    shareId: { type: String, unique: true, sparse: true, index: true },
  },
  { timestamps: true }
);

itinerarySchema.index({ user: 1, createdAt: -1 });
itinerarySchema.index({ destination: "text", title: "text" });

module.exports = mongoose.model("Itinerary", itinerarySchema);
