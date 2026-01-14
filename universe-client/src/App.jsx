import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const DarkVeil = lazy(() => import("./components/backgrounds/Dark_Veil"));
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import News from "./pages/News";
import Communities from "./pages/Communities";
import ClubDetails from "./pages/ClubDetails";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";
import CreateEvent from "./pages/CreateEvent";
import Venues from "./pages/Venues";
import VenueDetails from "./pages/VenueDetails";
import Speakers from "./pages/Speakers";
import SpeakerDetails from "./pages/SpeakerDetails";
import Notifications from "./pages/Notifications";

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
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/news" element={<News />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/communities/:id" element={<ClubDetails />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/organizer/create-event" element={<CreateEvent />} />
            <Route path="/venues" element={<Venues />} />
            <Route path="/venues/:id" element={<VenueDetails />} />
            <Route path="/speakers" element={<Speakers />} />
            <Route path="/speakers/:id" element={<SpeakerDetails />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
