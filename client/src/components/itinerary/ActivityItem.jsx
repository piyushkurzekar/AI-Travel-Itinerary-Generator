import { Clock, MapPin, DollarSign } from "lucide-react";

const ActivityItem = ({ activity }) => (
  <div className="flex gap-3 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-sm text-gray-900">{activity.activity}</p>
        {activity.estimatedCost > 0 && (
          <span className="flex items-center gap-0.5 text-xs text-green-600 font-medium flex-shrink-0 bg-green-50 px-1.5 py-0.5 rounded">
            <DollarSign size={10} />{activity.estimatedCost}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-3 mt-1">
        {activity.time && (
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock size={11} /> {activity.time}
          </span>
        )}
        {activity.location && (
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin size={11} /> {activity.location}
          </span>
        )}
      </div>
      {activity.description && (
        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
          {activity.description}
        </p>
      )}
    </div>
  </div>
);

export default ActivityItem;
