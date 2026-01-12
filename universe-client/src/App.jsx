import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const DarkVeil = lazy(() => import("./components/backgrounds/Dark_Veil"));
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";
import CreateEvent from "./pages/CreateEvent";

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
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/organizer/create-event" element={<CreateEvent />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
