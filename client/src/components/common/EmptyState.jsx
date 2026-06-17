import { MapPin } from "lucide-react";

const EmptyState = ({ title, description, icon: Icon = MapPin, action }) => (
  <div className="text-center py-16 px-4">
    <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
      <Icon className="text-blue-400" size={28} />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    {description && (
      <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
    )}
    {action}
  </div>
);

export default EmptyState;
