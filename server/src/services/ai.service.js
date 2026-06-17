const { GoogleGenerativeAI } = require("@google/generative-ai");
const env = require("../config/env");
const { parseAIJson } = require("../utils/cleanAIResponse");

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

// Models in order of preference (newest first)
const MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const callWithRetry = async (modelName, prompt) => {
  for (let attempt = 0; attempt < MODELS.length; attempt++) {
    const name = MODELS[attempt];
    try {
      const model = genAI.getGenerativeModel({ model: name });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      const is429 = err.message?.includes("429") || err.message?.includes("quota");
      const is404 = err.message?.includes("404") || err.message?.includes("not found");
      if ((is429 || is404) && attempt < MODELS.length - 1) {
        console.warn(`Model ${name} failed (${is429 ? "quota" : "not found"}), trying next...`);
        if (is429) await sleep(3000);
        continue;
      }
      throw err;
    }
  }
};

const extractBookingDetails = async (combinedText) => {
  const prompt = `You are a travel document parser. Analyze the following text extracted from travel booking documents and extract all booking information.

Return ONLY a valid JSON object with no markdown code blocks, no explanation, just pure JSON matching this exact structure:
{
  "travelerName": "",
  "source": "",
  "destination": "",
  "departureDate": "",
  "returnDate": "",
  "flights": [
    {
      "airline": "",
      "flightNumber": "",
      "departureAirport": "",
      "arrivalAirport": "",
      "departureDate": "",
      "departureTime": "",
      "arrivalDate": "",
      "arrivalTime": ""
    }
  ],
  "hotels": [
    {
      "hotelName": "",
      "address": "",
      "checkIn": "",
      "checkOut": "",
      "bookingReference": ""
    }
  ],
  "otherBookings": [
    {
      "type": "",
      "details": ""
    }
  ]
}

Rules:
- Fill in only information that is clearly present in the document text
- Use empty string "" for missing fields
- Use arrays with empty objects if no data found
- For dates, use format: YYYY-MM-DD if possible, or the format from the document
- For times, use HH:MM format

Document text:
${combinedText.slice(0, 8000)}`;

  try {
    const responseText = await callWithRetry(MODELS[0], prompt);
    return parseAIJson(responseText);
  } catch (error) {
    console.error("AI extraction error:", error.message);
    throw new Error(`AI extraction failed: ${error.message}`);
  }
};

const generateItinerary = async (bookingData) => {

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
  } = bookingData;

  const flightInfo = bookingDetails.flights?.length
    ? `Flights: ${JSON.stringify(bookingDetails.flights)}`
    : "No flight bookings";
  const hotelInfo = bookingDetails.hotels?.length
    ? `Hotels: ${JSON.stringify(bookingDetails.hotels)}`
    : "No hotel bookings";

  const prompt = `You are an expert travel planner. Create a detailed day-by-day travel itinerary based on the confirmed booking details below.

CONFIRMED BOOKING DETAILS (do not invent or modify these):
- Traveler: ${travelerName || "Traveler"}
- From: ${source}
- To: ${destination}
- Departure: ${departureDate}
- Return: ${returnDate || "Not specified"}
- Number of travelers: ${travelerCount}
- ${flightInfo}
- ${hotelInfo}
- Other bookings: ${JSON.stringify(bookingDetails.otherBookings || [])}

TRAVELER PREFERENCES:
- Interests: ${interests.length ? interests.join(", ") : "General sightseeing"}
- Budget type: ${budgetType}
- Travel pace: ${travelPace}
- Special requests: ${specialRequests || "None"}

RULES:
1. Do NOT suggest activities before the arrival time/date
2. Do NOT suggest activities after the departure time on the return date
3. Include realistic travel times between locations
4. First day should account for arrival and travel from airport/station
5. Last day should account for check-out and travel to airport/station
6. Match budget: budget=affordable local options, medium=mix, premium=upscale
7. Match pace: relaxed=2-3 activities/day, balanced=3-4/day, fast-paced=5-6/day
8. Include local food recommendations in meals array
9. All estimatedCost values should be realistic numbers in USD

Return ONLY a valid JSON object with no markdown, no explanation, just JSON matching this structure:
{
  "title": "Trip title here",
  "summary": "2-3 sentence trip summary",
  "destination": "${destination}",
  "departureDate": "${departureDate}",
  "returnDate": "${returnDate || ""}",
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "title": "Day title",
      "activities": [
        {
          "time": "HH:MM",
          "activity": "Activity name",
          "location": "Specific location",
          "description": "Brief description",
          "estimatedCost": 0
        }
      ],
      "meals": ["Breakfast suggestion", "Lunch suggestion", "Dinner suggestion"],
      "transport": "Transport notes for the day",
      "notes": "Important notes"
    }
  ],
  "travelTips": ["tip1", "tip2", "tip3", "tip4", "tip5"],
  "packingSuggestions": ["item1", "item2", "item3"],
  "emergencyInformation": ["info1", "info2"],
  "estimatedBudget": {
    "accommodation": 0,
    "food": 0,
    "transport": 0,
    "activities": 0,
    "other": 0,
    "total": 0
  }
}`;

  try {
    const responseText = await callWithRetry(MODELS[0], prompt);
    const parsed = parseAIJson(responseText);

    if (!parsed.title || !parsed.days || !Array.isArray(parsed.days)) {
      throw new Error("Invalid itinerary structure from AI");
    }

    return parsed;
  } catch (error) {
    console.error("AI itinerary generation error:", error.message);
    throw new Error(`Itinerary generation failed: ${error.message}`);
  }
};

module.exports = { extractBookingDetails, generateItinerary };
