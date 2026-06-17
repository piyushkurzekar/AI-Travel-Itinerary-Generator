import { Link } from "react-router-dom";
import {
  MapPin, Calendar, Users, Globe, Lock, Trash2, Share2,
} from "lucide-react";
import { formatShortDate, isUpcoming } from "../../utils/formatDate";

const ItineraryCard = ({ itinerary, onDelete, onShare }) => {
  const upcoming = isUpcoming(itinerary.departureDate);

  return (
    <div className="card hover:shadow-md transition-shadow duration-200 group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {upcoming ? (
              <span className="badge bg-green-100 text-green-700">Upcoming</span>
            ) : (
              <span className="badge bg-gray-100 text-gray-600">Past</span>
            )}
            {itinerary.isPublic && (
              <span className="badge bg-blue-100 text-blue-700 flex items-center gap-1">
                <Globe size={10} /> Shared
              </span>
            )}
          </div>
          <Link
            to={`/itinerary/${itinerary._id}`}
            className="block font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate"
          >
            {itinerary.title || `Trip to ${itinerary.destination}`}
          </Link>
        </div>
      </div>

      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin size={14} className="text-blue-400 flex-shrink-0" />
          <span className="truncate">
            {itinerary.source} → {itinerary.destination}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar size={14} className="text-blue-400 flex-shrink-0" />
          <span>
            {formatShortDate(itinerary.departureDate)}
            {itinerary.returnDate && ` – ${formatShortDate(itinerary.returnDate)}`}
          </span>
        </div>
        {itinerary.travelerCount > 1 && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users size={14} className="text-blue-400 flex-shrink-0" />
            <span>{itinerary.travelerCount} travelers</span>
          </div>
        )}
      </div>

      {itinerary.summary && (
        <p className="text-xs text-gray-400 line-clamp-2 mb-4">
          {itinerary.summary}
        </p>
      )}

      <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
        <Link
          to={`/itinerary/${itinerary._id}`}
          className="flex-1 btn-primary text-xs py-1.5"
        >
          View Itinerary
        </Link>
        <button
          onClick={() => onShare(itinerary)}
          className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          title="Share"
        >
          {itinerary.isPublic ? (
            <Globe size={16} className="text-blue-500" />
          ) : (
            <Share2 size={16} />
          )}
        </button>
        <button
          onClick={() => onDelete(itinerary)}
          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default ItineraryCard;
