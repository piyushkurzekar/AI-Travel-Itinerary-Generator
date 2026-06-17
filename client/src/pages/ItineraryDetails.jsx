import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  MapPin, Calendar, Users, Plane, Hotel, Share2, Trash2, Edit,
  Download, ArrowLeft, Globe, Lightbulb, Package, AlertTriangle,
  CheckCircle,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import DayCard from "../components/itinerary/DayCard";
import BudgetSummary from "../components/itinerary/BudgetSummary";
import ShareModal from "../components/itinerary/ShareModal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";
import { getItinerary, deleteItinerary } from "../api/itinerary.api";
import { formatDate } from "../utils/formatDate";
import downloadItineraryPdf from "../utils/downloadItineraryPdf";
import toast from "react-hot-toast";

const InfoChip = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-1.5">
    <Icon size={13} className="text-blue-400" />
    <span>{text}</span>
  </div>
);

const ItineraryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    getItinerary(id)
      .then((res) => setItinerary(res.data.data))
      .catch(() => toast.error("Itinerary not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteItinerary(id);
      toast.success("Itinerary deleted");
      navigate("/history");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    toast.promise(downloadItineraryPdf(itinerary), {
      loading: "Preparing PDF...",
      success: "PDF downloaded!",
      error: "Download failed",
    });
    setTimeout(() => setDownloading(false), 2000);
  };

  if (loading) return <DashboardLayout><Loader className="py-20" /></DashboardLayout>;
  if (!itinerary) return (
    <DashboardLayout>
      <div className="text-center py-20">
        <p className="text-gray-500">Itinerary not found</p>
        <Link to="/history" className="btn-primary mt-4 inline-flex">Back to History</Link>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/history" className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {itinerary.isPublic && (
                <span className="badge bg-blue-100 text-blue-700 flex items-center gap-1">
                  <Globe size={10} /> Shared
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-gray-900 truncate">{itinerary.title}</h1>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button variant="ghost" size="sm" onClick={() => setShareOpen(true)}>
            <Share2 size={14} /> Share
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownload} loading={downloading}>
            <Download size={14} /> Download PDF
          </Button>
          <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => setDeleteOpen(true)}>
            <Trash2 size={14} /> Delete
          </Button>
        </div>

        {/* Summary card */}
        <div className="card bg-gradient-to-br from-blue-600 to-indigo-700 text-white mb-6 p-6">
          <p className="text-blue-100 text-sm mb-4">{itinerary.summary}</p>
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

        {/* Booking overview */}
        {(itinerary.bookingDetails?.flights?.length > 0 ||
          itinerary.bookingDetails?.hotels?.length > 0) && (
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {itinerary.bookingDetails.flights?.map((f, i) => (
              <div key={i} className="card border-l-4 border-blue-500 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Plane size={14} className="text-blue-500" />
                  <span className="text-sm font-semibold text-gray-700">
                    {f.airline} {f.flightNumber}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {f.departureAirport} → {f.arrivalAirport}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {f.departureDate} {f.departureTime}
                </p>
              </div>
            ))}
            {itinerary.bookingDetails.hotels?.map((h, i) => (
              <div key={i} className="card border-l-4 border-green-500 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Hotel size={14} className="text-green-500" />
                  <span className="text-sm font-semibold text-gray-700">{h.hotelName}</span>
                </div>
                <p className="text-xs text-gray-500">{h.address}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Check-in: {h.checkIn} · Check-out: {h.checkOut}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Day-by-day */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-blue-500" />
            Day-by-Day Itinerary
          </h2>
          <div className="space-y-3">
            {itinerary.days?.map((day, i) => (
              <DayCard key={i} day={day} />
            ))}
          </div>
        </div>

        {/* Budget */}
        {itinerary.estimatedBudget && (
          <div className="mb-6">
            <BudgetSummary budget={itinerary.estimatedBudget} />
          </div>
        )}

        {/* Tips & Packing */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {itinerary.travelTips?.length > 0 && (
            <div className="card">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-3">
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
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-3">
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

        {/* Emergency info */}
        {itinerary.emergencyInformation?.length > 0 && (
          <div className="card border-l-4 border-red-400 mb-6">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <AlertTriangle size={16} className="text-red-500" /> Emergency Information
            </h3>
            <ul className="space-y-1">
              {itinerary.emergencyInformation.map((info, i) => (
                <li key={i} className="text-sm text-gray-600">• {info}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        itinerary={itinerary}
        onUpdate={setItinerary}
      />

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Itinerary?"
        message={`Are you sure you want to delete "${itinerary.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </DashboardLayout>
  );
};

export default ItineraryDetails;
