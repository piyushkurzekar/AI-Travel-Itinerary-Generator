import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Plus, Map, SlidersHorizontal } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import ItineraryCard from "../components/itinerary/ItineraryCard";
import ShareModal from "../components/itinerary/ShareModal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";
import { getItineraries, deleteItinerary } from "../api/itinerary.api";
import toast from "react-hot-toast";

const FILTERS = [
  { value: "", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
  { value: "shared", label: "Shared" },
];

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "travel_date", label: "Travel date" },
];

const ItineraryHistory = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const [shareItinerary, setShareItinerary] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchItineraries = async (params = {}) => {
    setLoading(true);
    try {
      const res = await getItineraries({
        search: search || undefined,
        filter: filter || undefined,
        sort,
        page,
        limit: 9,
        ...params,
      });
      setItineraries(res.data.data.itineraries);
      setPagination(res.data.data.pagination);
    } catch {
      toast.error("Failed to load itineraries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, [filter, sort, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchItineraries({ page: 1 });
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteItinerary(deleteTarget._id);
      setItineraries((prev) => prev.filter((i) => i._id !== deleteTarget._id));
      toast.success("Itinerary deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleShareUpdate = (updated) => {
    setItineraries((prev) =>
      prev.map((i) => (i._id === updated._id ? { ...i, ...updated } : i))
    );
    setShareItinerary((prev) => (prev ? { ...prev, ...updated } : prev));
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Trips</h1>
          <p className="text-gray-500 mt-1">
            {pagination?.total ?? 0} itineraries
          </p>
        </div>
        <Link to="/upload" className="btn-primary flex items-center gap-2">
          <Plus size={15} /> New Trip
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input pl-9 pr-3"
              placeholder="Search by destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button type="submit" size="sm" variant="secondary">
            Search
          </Button>
        </form>

        <div className="flex gap-2">
          <div className="relative">
            <Filter size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              className="input pl-7 pr-3 py-2 text-sm"
              value={filter}
              onChange={(e) => { setFilter(e.target.value); setPage(1); }}
            >
              {FILTERS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <SlidersHorizontal size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              className="input pl-7 pr-3 py-2 text-sm"
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <Loader className="py-20" />
      ) : itineraries.length === 0 ? (
        <EmptyState
          icon={Map}
          title="No itineraries found"
          description={
            search || filter
              ? "Try adjusting your search or filter"
              : "Upload your first travel documents to generate an itinerary"
          }
          action={
            !search && !filter ? (
              <Link to="/upload" className="btn-primary">
                <Plus size={14} /> Create your first trip
              </Link>
            ) : null
          }
        />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {itineraries.map((it) => (
              <ItineraryCard
                key={it._id}
                itinerary={it}
                onDelete={setDeleteTarget}
                onShare={setShareItinerary}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="secondary"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-500">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page === pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {shareItinerary && (
        <ShareModal
          isOpen={!!shareItinerary}
          onClose={() => setShareItinerary(null)}
          itinerary={shareItinerary}
          onUpdate={handleShareUpdate}
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Itinerary?"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </DashboardLayout>
  );
};

export default ItineraryHistory;
