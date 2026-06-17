import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin, Calendar, Users, Plane, Globe, Lightbulb, Package,
  AlertTriangle, CheckCircle, Copy, MessageCircle,
} from "lucide-react";
import { getSharedItinerary } from "../api/itinerary.api";
import DayCard from "../components/itinerary/DayCard";
import BudgetSummary from "../components/itinerary/BudgetSummary";
import { PageLoader } from "../components/common/Loader";
import { formatDate } from "../utils/formatDate";
import copyToClipboard from "../utils/copyToClipboard";
import toast from "react-hot-toast";

const SharedItinerary = () => {
  const { shareId } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getSharedItinerary(shareId)
      .then((res) => setItinerary(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [shareId]);

  const handleCopy = async () => {
    const ok = await copyToClipboard(window.location.href);
    if (ok) toast.success("Link copied!");
    else toast.error("Failed to copy");
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Check out this travel itinerary to ${itinerary.destination}! ${window.location.href}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  if (loading) return <PageLoader />;

  if (notFound) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Globe className="text-gray-400" size={28} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Itinerary not found</h2>
        <p className="text-gray-500 text-sm mb-6">
          This itinerary may have been removed or sharing has been disabled.
        </p>
        <Link to="/" className="btn-primary">Go to TripAI</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-blue-600">
            <div className="p-1 bg-blue-600 rounded">
              <Plane className="text-white" size={14} />
            </div>
            TripAI
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Copy size={14} /> Copy link
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex items-center gap-1.5 text-sm text-white bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded-lg transition-colors"
            >
              <MessageCircle size={14} /> WhatsApp
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="card bg-gradient-to-br from-blue-600 to-indigo-700 text-white mb-6 p-7">
          <div className="flex items-start gap-2 mb-2">
            <span className="badge bg-white/20 text-white text-xs flex items-center gap-1">
              <Globe size={10} /> Public Itinerary
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-2">{itinerary.title}</h1>
          {itinerary.summary && (
            <p className="text-blue-100 text-sm mb-4">{itinerary.summary}</p>
          )}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-3 py-1.5 text-sm">
              <MapPin size={13} /> {itinerary.source} → {itinerary.destination}
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-3 py-1.5 text-sm">
              <Calendar size={13} /> {formatDate(itinerary.departureDate)}
              {itinerary.returnDate && ` – ${formatDate(itinerary.returnDate)}`}
            </div>
            {itinerary.travelerCount > 1 && (
              <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-3 py-1.5 text-sm">
                <Users size={13} /> {itinerary.travelerCount} travelers
              </div>
            )}
          </div>
        </div>

        {/* Days */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-blue-500" /> Day-by-Day Itinerary
          </h2>
          <div className="space-y-3">
            {itinerary.days?.map((day, i) => <DayCard key={i} day={day} />)}
          </div>
        </div>

        {/* Budget */}
        {itinerary.estimatedBudget?.total > 0 && (
          <div className="mb-6">
            <BudgetSummary budget={itinerary.estimatedBudget} />
          </div>
        )}

        {/* Tips & Packing */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {itinerary.travelTips?.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                <Lightbulb size={16} className="text-yellow-500" /> Travel Tips
              </h3>
              <ul className="space-y-2">
                {itinerary.travelTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle size={13} className="text-green-400 mt-0.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {itinerary.packingSuggestions?.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                <Package size={16} className="text-blue-500" /> Packing List
              </h3>
              <ul className="space-y-2">
                {itinerary.packingSuggestions.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Emergency */}
        {itinerary.emergencyInformation?.length > 0 && (
          <div className="card border-l-4 border-red-400 mb-6">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <AlertTriangle size={16} className="text-red-500" /> Emergency Information
            </h3>
            <ul className="space-y-1">
              {itinerary.emergencyInformation.map((info, i) => (
                <li key={i} className="text-sm text-gray-600">• {info}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer CTA */}
        <div className="text-center py-8 bg-blue-50 rounded-2xl">
          <h3 className="font-bold text-gray-900 mb-2">Want to create your own?</h3>
          <p className="text-sm text-gray-500 mb-4">
            Upload your travel documents and get an AI-generated itinerary in minutes
          </p>
          <Link to="/register" className="btn-primary">
            Get started free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SharedItinerary;
