import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Map, Calendar, Globe, FileText, Plus, TrendingUp, ArrowRight,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getDashboardStats } from "../api/dashboard.api";
import { formatShortDate, isUpcoming } from "../utils/formatDate";
import Loader from "../components/common/Loader";

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className="card flex items-center gap-4">
    <div className={`p-3 rounded-xl ${bg}`}>
      <Icon className={color} size={22} />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-500 mt-1">Plan your next adventure</p>
        </div>
        <Link to="/upload" className="btn-primary hidden sm:flex gap-2 items-center">
          <Plus size={16} /> New Trip
        </Link>
      </div>

      {loading ? (
        <Loader className="py-16" />
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={Map}
              label="Total Itineraries"
              value={stats?.totalItineraries ?? 0}
              color="text-blue-600"
              bg="bg-blue-50"
            />
            <StatCard
              icon={Calendar}
              label="Upcoming Trips"
              value={stats?.upcomingTrips ?? 0}
              color="text-green-600"
              bg="bg-green-50"
            />
            <StatCard
              icon={Globe}
              label="Shared"
              value={stats?.sharedItineraries ?? 0}
              color="text-purple-600"
              bg="bg-purple-50"
            />
            <StatCard
              icon={FileText}
              label="Documents"
              value={stats?.uploadedDocuments ?? 0}
              color="text-orange-600"
              bg="bg-orange-50"
            />
          </div>

          {/* Recent itineraries */}
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp size={18} className="text-blue-500" />
                Recent Itineraries
              </h2>
              <Link
                to="/history"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>

            {stats?.recentItineraries?.length > 0 ? (
              <div className="space-y-3">
                {stats.recentItineraries.map((it) => (
                  <Link
                    key={it._id}
                    to={`/itinerary/${it._id}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {it.title || `Trip to ${it.destination}`}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {it.destination} • {formatShortDate(it.departureDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isUpcoming(it.departureDate) ? (
                        <span className="badge bg-green-100 text-green-700">Upcoming</span>
                      ) : (
                        <span className="badge bg-gray-100 text-gray-600">Past</span>
                      )}
                      {it.isPublic && (
                        <span className="badge bg-blue-100 text-blue-700">Shared</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Map className="mx-auto text-gray-300 mb-3" size={36} />
                <p className="text-gray-500 mb-4">No itineraries yet</p>
                <Link to="/upload" className="btn-primary">
                  <Plus size={14} /> Create your first trip
                </Link>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <Link
              to="/upload"
              className="card hover:shadow-md transition-shadow flex items-center gap-4 group cursor-pointer"
            >
              <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                <Plus className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Create New Trip</p>
                <p className="text-xs text-gray-400">Upload documents & generate itinerary</p>
              </div>
              <ArrowRight size={16} className="text-gray-300 ml-auto group-hover:text-blue-400 transition-colors" />
            </Link>
            <Link
              to="/history"
              className="card hover:shadow-md transition-shadow flex items-center gap-4 group cursor-pointer"
            >
              <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
                <Calendar className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Trip History</p>
                <p className="text-xs text-gray-400">View, edit, or share past itineraries</p>
              </div>
              <ArrowRight size={16} className="text-gray-300 ml-auto group-hover:text-purple-400 transition-colors" />
            </Link>
          </div>
        </>
      )}

      {/* Mobile new trip FAB */}
      <Link
        to="/upload"
        className="sm:hidden fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-2xl hover:bg-blue-700 transition-colors z-30"
      >
        <Plus size={22} />
      </Link>
    </DashboardLayout>
  );
};

export default Dashboard;
