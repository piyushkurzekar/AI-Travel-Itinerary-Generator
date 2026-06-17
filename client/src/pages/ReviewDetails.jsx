import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Plus, Trash2, Wand2, AlertCircle, Plane, Hotel, Package,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import Button from "../components/common/Button";
import { generateItinerary } from "../api/itinerary.api";
import toast from "react-hot-toast";

const INTERESTS = ["Culture", "Food", "Adventure", "Nature", "Shopping", "Nightlife", "History", "Art", "Beaches", "Hiking"];
const PACE_OPTIONS = [
  { value: "relaxed", label: "Relaxed", desc: "2-3 activities/day" },
  { value: "balanced", label: "Balanced", desc: "3-4 activities/day" },
  { value: "fast-paced", label: "Fast-paced", desc: "5-6 activities/day" },
];
const BUDGET_OPTIONS = [
  { value: "budget", label: "Budget", desc: "Affordable & local" },
  { value: "medium", label: "Medium", desc: "Mix of options" },
  { value: "premium", label: "Premium", desc: "Upscale experiences" },
];

const emptyFlight = () => ({
  airline: "", flightNumber: "", departureAirport: "", arrivalAirport: "",
  departureDate: "", departureTime: "", arrivalDate: "", arrivalTime: "",
});
const emptyHotel = () => ({
  hotelName: "", address: "", checkIn: "", checkOut: "", bookingReference: "",
});

const ReviewDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingDetails: initial = {}, documents = [] } = location.state || {};

  const [form, setForm] = useState({
    travelerName: initial.travelerName || "",
    source: initial.source || "",
    destination: initial.destination || "",
    departureDate: initial.departureDate || "",
    returnDate: initial.returnDate || "",
    travelerCount: 1,
    interests: [],
    budgetType: "medium",
    travelPace: "balanced",
    specialRequests: "",
    flights: initial.flights?.length ? initial.flights : [emptyFlight()],
    hotels: initial.hotels?.length ? initial.hotels : [emptyHotel()],
    otherBookings: initial.otherBookings || [],
  });

  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("basics");

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const toggleInterest = (interest) => {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(interest)
        ? f.interests.filter((i) => i !== interest)
        : [...f.interests, interest],
    }));
  };

  const handleGenerate = async () => {
    if (!form.source || !form.destination || !form.departureDate) {
      toast.error("Please fill in source, destination, and departure date");
      return;
    }
    setLoading(true);
    try {
      const res = await generateItinerary({
        ...form,
        bookingDetails: {
          flights: form.flights.filter((f) => f.airline || f.flightNumber),
          hotels: form.hotels.filter((h) => h.hotelName),
          otherBookings: form.otherBookings,
        },
        uploadedDocuments: documents,
      });
      toast.success("Itinerary generated!");
      navigate(`/itinerary/${res.data.data._id}`);
    } catch (err) {
      toast.error(err.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: "basics", label: "Trip Basics" },
    { id: "flights", label: "Flights" },
    { id: "hotels", label: "Hotels" },
    { id: "preferences", label: "Preferences" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Review Booking Details</h1>
          <p className="text-gray-500 mt-1">
            We extracted these details from your documents. Please review and correct if needed.
          </p>
        </div>

        {/* Section tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl overflow-x-auto">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeSection === s.id
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="card space-y-5">
          {/* Trip Basics */}
          {activeSection === "basics" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Traveler Name</label>
                  <input className="input" value={form.travelerName}
                    onChange={(e) => update("travelerName", e.target.value)}
                    placeholder="Your name" />
                </div>
                <div>
                  <label className="label">Number of Travelers</label>
                  <input type="number" min={1} max={20} className="input"
                    value={form.travelerCount}
                    onChange={(e) => update("travelerCount", Number(e.target.value))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Source / Origin *</label>
                  <input className="input" value={form.source}
                    onChange={(e) => update("source", e.target.value)}
                    placeholder="e.g. New York" />
                </div>
                <div>
                  <label className="label">Destination *</label>
                  <input className="input" value={form.destination}
                    onChange={(e) => update("destination", e.target.value)}
                    placeholder="e.g. Paris" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Departure Date *</label>
                  <input type="date" className="input" value={form.departureDate}
                    onChange={(e) => update("departureDate", e.target.value)} />
                </div>
                <div>
                  <label className="label">Return Date</label>
                  <input type="date" className="input" value={form.returnDate}
                    onChange={(e) => update("returnDate", e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* Flights */}
          {activeSection === "flights" && (
            <div className="space-y-4">
              {form.flights.map((flight, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-700 flex items-center gap-2">
                      <Plane size={15} className="text-blue-500" /> Flight {i + 1}
                    </h4>
                    {form.flights.length > 1 && (
                      <button onClick={() => update("flights", form.flights.filter((_, j) => j !== i))}
                        className="text-red-400 hover:text-red-600">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label text-xs">Airline</label>
                      <input className="input text-sm" value={flight.airline}
                        onChange={(e) => {
                          const flights = [...form.flights];
                          flights[i] = { ...flights[i], airline: e.target.value };
                          update("flights", flights);
                        }} placeholder="e.g. Air France" />
                    </div>
                    <div>
                      <label className="label text-xs">Flight Number</label>
                      <input className="input text-sm" value={flight.flightNumber}
                        onChange={(e) => {
                          const flights = [...form.flights];
                          flights[i] = { ...flights[i], flightNumber: e.target.value };
                          update("flights", flights);
                        }} placeholder="e.g. AF123" />
                    </div>
                    <div>
                      <label className="label text-xs">Departure Airport</label>
                      <input className="input text-sm" value={flight.departureAirport}
                        onChange={(e) => {
                          const flights = [...form.flights];
                          flights[i] = { ...flights[i], departureAirport: e.target.value };
                          update("flights", flights);
                        }} placeholder="e.g. JFK" />
                    </div>
                    <div>
                      <label className="label text-xs">Arrival Airport</label>
                      <input className="input text-sm" value={flight.arrivalAirport}
                        onChange={(e) => {
                          const flights = [...form.flights];
                          flights[i] = { ...flights[i], arrivalAirport: e.target.value };
                          update("flights", flights);
                        }} placeholder="e.g. CDG" />
                    </div>
                    <div>
                      <label className="label text-xs">Departure Date & Time</label>
                      <div className="flex gap-2">
                        <input type="date" className="input text-sm flex-1" value={flight.departureDate}
                          onChange={(e) => {
                            const flights = [...form.flights];
                            flights[i] = { ...flights[i], departureDate: e.target.value };
                            update("flights", flights);
                          }} />
                        <input type="time" className="input text-sm w-28" value={flight.departureTime}
                          onChange={(e) => {
                            const flights = [...form.flights];
                            flights[i] = { ...flights[i], departureTime: e.target.value };
                            update("flights", flights);
                          }} />
                      </div>
                    </div>
                    <div>
                      <label className="label text-xs">Arrival Date & Time</label>
                      <div className="flex gap-2">
                        <input type="date" className="input text-sm flex-1" value={flight.arrivalDate}
                          onChange={(e) => {
                            const flights = [...form.flights];
                            flights[i] = { ...flights[i], arrivalDate: e.target.value };
                            update("flights", flights);
                          }} />
                        <input type="time" className="input text-sm w-28" value={flight.arrivalTime}
                          onChange={(e) => {
                            const flights = [...form.flights];
                            flights[i] = { ...flights[i], arrivalTime: e.target.value };
                            update("flights", flights);
                          }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="secondary" size="sm" onClick={() => update("flights", [...form.flights, emptyFlight()])}>
                <Plus size={14} /> Add Flight
              </Button>
            </div>
          )}

          {/* Hotels */}
          {activeSection === "hotels" && (
            <div className="space-y-4">
              {form.hotels.map((hotel, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-700 flex items-center gap-2">
                      <Hotel size={15} className="text-blue-500" /> Hotel {i + 1}
                    </h4>
                    {form.hotels.length > 1 && (
                      <button onClick={() => update("hotels", form.hotels.filter((_, j) => j !== i))}
                        className="text-red-400 hover:text-red-600">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="label text-xs">Hotel Name</label>
                      <input className="input text-sm" value={hotel.hotelName}
                        onChange={(e) => {
                          const hotels = [...form.hotels];
                          hotels[i] = { ...hotels[i], hotelName: e.target.value };
                          update("hotels", hotels);
                        }} placeholder="Hotel name" />
                    </div>
                    <div className="col-span-2">
                      <label className="label text-xs">Address</label>
                      <input className="input text-sm" value={hotel.address}
                        onChange={(e) => {
                          const hotels = [...form.hotels];
                          hotels[i] = { ...hotels[i], address: e.target.value };
                          update("hotels", hotels);
                        }} placeholder="Hotel address" />
                    </div>
                    <div>
                      <label className="label text-xs">Check-in</label>
                      <input type="date" className="input text-sm" value={hotel.checkIn}
                        onChange={(e) => {
                          const hotels = [...form.hotels];
                          hotels[i] = { ...hotels[i], checkIn: e.target.value };
                          update("hotels", hotels);
                        }} />
                    </div>
                    <div>
                      <label className="label text-xs">Check-out</label>
                      <input type="date" className="input text-sm" value={hotel.checkOut}
                        onChange={(e) => {
                          const hotels = [...form.hotels];
                          hotels[i] = { ...hotels[i], checkOut: e.target.value };
                          update("hotels", hotels);
                        }} />
                    </div>
                    <div className="col-span-2">
                      <label className="label text-xs">Booking Reference</label>
                      <input className="input text-sm" value={hotel.bookingReference}
                        onChange={(e) => {
                          const hotels = [...form.hotels];
                          hotels[i] = { ...hotels[i], bookingReference: e.target.value };
                          update("hotels", hotels);
                        }} placeholder="e.g. HT-12345" />
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="secondary" size="sm" onClick={() => update("hotels", [...form.hotels, emptyHotel()])}>
                <Plus size={14} /> Add Hotel
              </Button>
            </div>
          )}

          {/* Preferences */}
          {activeSection === "preferences" && (
            <div className="space-y-5">
              <div>
                <label className="label">Interests</label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((interest) => (
                    <button key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        form.interests.includes(interest)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Budget Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {BUDGET_OPTIONS.map((opt) => (
                    <button key={opt.value} type="button"
                      onClick={() => update("budgetType", opt.value)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        form.budgetType === opt.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <p className="font-medium text-sm text-gray-900">{opt.label}</p>
                      <p className="text-xs text-gray-400">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Travel Pace</label>
                <div className="grid grid-cols-3 gap-3">
                  {PACE_OPTIONS.map((opt) => (
                    <button key={opt.value} type="button"
                      onClick={() => update("travelPace", opt.value)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        form.travelPace === opt.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <p className="font-medium text-sm text-gray-900">{opt.label}</p>
                      <p className="text-xs text-gray-400">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Special Requests</label>
                <textarea className="input resize-none h-20"
                  value={form.specialRequests}
                  onChange={(e) => update("specialRequests", e.target.value)}
                  placeholder="Accessibility needs, dietary restrictions, special occasions..." />
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3 pt-2">
            {activeSection !== "basics" && (
              <Button variant="secondary" className="flex-1"
                onClick={() => {
                  const order = ["basics", "flights", "hotels", "preferences"];
                  const idx = order.indexOf(activeSection);
                  setActiveSection(order[idx - 1]);
                }}>
                Back
              </Button>
            )}
            {activeSection !== "preferences" ? (
              <Button className="flex-1"
                onClick={() => {
                  const order = ["basics", "flights", "hotels", "preferences"];
                  const idx = order.indexOf(activeSection);
                  setActiveSection(order[idx + 1]);
                }}>
                Next
              </Button>
            ) : (
              <Button className="flex-1" loading={loading} onClick={handleGenerate}>
                <Wand2 size={15} />
                Generate Itinerary
              </Button>
            )}
          </div>

          {loading && (
            <div className="bg-blue-50 rounded-xl p-3 flex gap-2">
              <AlertCircle size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                AI is generating your personalized itinerary. This may take 15-30 seconds...
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReviewDetails;
