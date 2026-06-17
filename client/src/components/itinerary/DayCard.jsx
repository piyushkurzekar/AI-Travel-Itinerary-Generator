import { useState } from "react";
import { ChevronDown, ChevronUp, Calendar, Utensils, Bus, Info } from "lucide-react";
import ActivityItem from "./ActivityItem";

const DayCard = ({ day }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="card p-0 overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {day.day}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{day.title || `Day ${day.day}`}</h3>
            {day.date && (
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <Calendar size={11} /> {day.date}
              </p>
            )}
          </div>
        </div>
        {expanded ? (
          <ChevronUp size={18} className="text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4">
          {/* Activities */}
          {day.activities?.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Activities
              </h4>
              <div className="space-y-2">
                {day.activities.map((activity, i) => (
                  <ActivityItem key={i} activity={activity} />
                ))}
              </div>
            </div>
          )}

          {/* Meals */}
          {day.meals?.filter(Boolean).length > 0 && (
            <div className="bg-amber-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Utensils size={13} className="text-amber-600" />
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                  Meals
                </span>
              </div>
              <ul className="space-y-1">
                {day.meals.filter(Boolean).map((meal, i) => (
                  <li key={i} className="text-sm text-amber-800">• {meal}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Transport */}
          {day.transport && (
            <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
              <Bus size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <span>{day.transport}</span>
            </div>
          )}

          {/* Notes */}
          {day.notes && (
            <div className="flex items-start gap-2 text-sm text-gray-600 bg-blue-50 rounded-xl p-3">
              <Info size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
              <span>{day.notes}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DayCard;
