import { Link } from "react-router-dom";
import { Plane } from "lucide-react";

const AuthLayout = ({ children, title, subtitle }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2 mb-4">
          <div className="p-2 bg-blue-600 rounded-xl">
            <Plane className="text-white" size={22} />
          </div>
          <span className="font-bold text-2xl text-gray-900">TripAI</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-500 mt-1 text-sm">{subtitle}</p>}
      </div>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        {children}
      </div>
    </div>
  </div>
);

export default AuthLayout;
