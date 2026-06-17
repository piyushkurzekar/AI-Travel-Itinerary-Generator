import { Link } from "react-router-dom";
import { MapPin, Home } from "lucide-react";

const NotFound = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="text-center max-w-sm">
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <MapPin className="text-blue-400" size={36} />
      </div>
      <h1 className="text-6xl font-extrabold text-gray-200 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h2>
      <p className="text-gray-500 mb-8">
        Looks like you've wandered off the map. Let's get you back on track.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
      >
        <Home size={16} /> Go Home
      </Link>
    </div>
  </div>
);

export default NotFound;
