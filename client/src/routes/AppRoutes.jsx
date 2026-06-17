import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import UploadBooking from "../pages/UploadBooking";
import ReviewDetails from "../pages/ReviewDetails";
import ItineraryDetails from "../pages/ItineraryDetails";
import ItineraryHistory from "../pages/ItineraryHistory";
import SharedItinerary from "../pages/SharedItinerary";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import { useAuth } from "../context/AuthContext";

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Home />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />

      <Route path="/shared/:shareId" element={<SharedItinerary />} />

      <Route
        path="/dashboard"
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
      />
      <Route
        path="/upload"
        element={<ProtectedRoute><UploadBooking /></ProtectedRoute>}
      />
      <Route
        path="/review"
        element={<ProtectedRoute><ReviewDetails /></ProtectedRoute>}
      />
      <Route
        path="/itinerary/:id"
        element={<ProtectedRoute><ItineraryDetails /></ProtectedRoute>}
      />
      <Route
        path="/history"
        element={<ProtectedRoute><ItineraryHistory /></ProtectedRoute>}
      />
      <Route
        path="/profile"
        element={<ProtectedRoute><Profile /></ProtectedRoute>}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
