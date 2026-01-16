import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const DarkVeil = lazy(() => import("./components/backgrounds/Dark_Veil"));
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// Student/Public Pages
import Home from "./pages/student/Home";
import News from "./pages/student/News";
import Communities from "./pages/student/Communities";
import ClubDetails from "./pages/student/ClubDetails";
import Events from "./pages/student/Events";
import EventDetails from "./pages/student/EventDetails";
import Venues from "./pages/student/Venues";
import VenueDetails from "./pages/student/VenueDetails";
import Speakers from "./pages/student/Speakers";
import SpeakerDetails from "./pages/student/SpeakerDetails";
import MyBookings from "./pages/student/MyBookings";
import Notifications from "./pages/student/Notifications";
import Profile from "./pages/student/Profile";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";

// Organizer Pages
import CreateEvent from "./pages/organizer/CreateEvent";

// Components
import ProtectedRoute from "./components/auth/ProtectedRoute";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen relative">
        <Suspense fallback={<div className="fixed inset-0 bg-black -z-10" />}>
          <DarkVeil />
        </Suspense>

        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/news" element={<News />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/communities/:id" element={<ClubDetails />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/venues" element={<Venues />} />
            <Route path="/venues/:id" element={<VenueDetails />} />
            <Route path="/speakers" element={<Speakers />} />
            <Route path="/speakers/:id" element={<SpeakerDetails />} />

            {/* Protected Routes - Any Logged In User */}
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Admin Only */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Organizer Only */}
            <Route
              path="/organizer/create-event"
              element={
                <ProtectedRoute allowedRoles={["organizer", "admin"]}>
                  <CreateEvent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
