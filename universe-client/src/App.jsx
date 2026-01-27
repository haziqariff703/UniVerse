import { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
// Context
import { ThemeProvider } from "@/context/ThemeContext";

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// Public Pages
import Home from "./pages/public/Home";
import News from "./pages/public/News";
import Communities from "./pages/public/Communities";
import ClubDetails from "./pages/public/ClubDetails";
import Events from "./pages/public/Events";
import EventDetails from "./pages/public/EventDetails";
import Venues from "./pages/public/Venues";
import VenueDetails from "./pages/public/VenueDetails";
import Speakers from "./pages/public/Speakers";
import SpeakerDetails from "./pages/public/SpeakerDetails";
import MyBookings from "./pages/public/MyBookings";

// Student Pages
import ClubProposal from "./pages/student/ClubProposal";
import Notifications from "./pages/student/Notifications";
import Profile from "./pages/student/Profile";

// Admin Pages
import AdminLayout from "./components/layout/AdminLayout";
// Lazy Load Admin Pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const UsersPage = lazy(() => import("./pages/admin/UsersPage"));
const EventsPage = lazy(() => import("./pages/admin/EventsPage"));
const OrganizersPage = lazy(() => import("./pages/admin/OrganizersPage"));
const VenuesPage = lazy(() => import("./pages/admin/VenuesPage"));
const AuditLogsPage = lazy(() => import("./pages/admin/AuditLogsPage"));

// Organizer Pages
import CreateEvent from "./pages/organizer/CreateEvent";
import MyEvents from "./pages/organizer/MyEvents";
import EventGuestList from "./pages/organizer/EventGuestList";
import EventDashboard from "./pages/organizer/EventDashboard";

import EditEvent from "./pages/organizer/EditEvent";
import ScanQR from "./pages/organizer/ScanQR";

// Components
import ProtectedRoute from "./components/auth/ProtectedRoute";

import { useState, useEffect } from "react";
import MainSidebar from "./components/layout/MainSidebar";
import Navbar from "./components/layout/Navbar";
import { BackgroundBeams } from "@/components/ui/background-beams";

const Layout = ({ children }) => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };
    checkUser();
    window.addEventListener("authChange", checkUser);
    window.addEventListener("storage", checkUser);
    return () => {
      window.removeEventListener("authChange", checkUser);
      window.removeEventListener("storage", checkUser);
    };
  }, []);

  if (location.pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#020617] via-[#030712] to-black text-foreground transition-colors duration-300 relative">
      {/* Simplified Animated Beams - CSS Gradients (Above background, below content) */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-60">
          {/* Animated gradient beams */}
          <div
            className="absolute inset-0 animate-pulse-ultra-slow"
            style={{
              background: `
                radial-gradient(ellipse 80% 50% at 50% -20%, rgba(168, 85, 247, 0.5), transparent),
                radial-gradient(ellipse 60% 40% at 80% 50%, rgba(6, 182, 212, 0.4), transparent),
                radial-gradient(ellipse 70% 50% at 20% 80%, rgba(168, 85, 247, 0.45), transparent)
              `,
            }}
          />
        </div>
      </div>

      {/* Grain overlay - Cinematic texture above beams */}
      <div
        className="fixed inset-0 z-[0] opacity-[0.02] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      {user && <MainSidebar user={user} collapsed={sidebarCollapsed} />}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Navbar
          user={user}
          collapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 px-4 md:px-8 pb-8 pt-20 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <div className="min-h-screen relative bg-gradient-to-b from-[#020617] via-[#030712] to-black text-foreground transition-colors duration-300">
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/news" element={<News />} />
              <Route path="/communities" element={<Communities />} />
              <Route path="/start-club" element={<ClubProposal />} />
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
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route
                  path="dashboard"
                  element={
                    <Suspense
                      fallback={
                        <div className="p-8 text-foreground">Loading...</div>
                      }
                    >
                      <AdminDashboard />
                    </Suspense>
                  }
                />
                <Route
                  path="users"
                  element={
                    <Suspense
                      fallback={
                        <div className="p-8 text-foreground">Loading...</div>
                      }
                    >
                      <UsersPage />
                    </Suspense>
                  }
                />
                <Route
                  path="events"
                  element={
                    <Suspense
                      fallback={
                        <div className="p-8 text-foreground">Loading...</div>
                      }
                    >
                      <EventsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="organizers"
                  element={
                    <Suspense
                      fallback={
                        <div className="p-8 text-foreground">Loading...</div>
                      }
                    >
                      <OrganizersPage />
                    </Suspense>
                  }
                />
                <Route
                  path="venues"
                  element={
                    <Suspense
                      fallback={
                        <div className="p-8 text-foreground">Loading...</div>
                      }
                    >
                      <VenuesPage />
                    </Suspense>
                  }
                />
                <Route
                  path="audit-logs"
                  element={
                    <Suspense
                      fallback={
                        <div className="p-8 text-foreground">Loading...</div>
                      }
                    >
                      <AuditLogsPage />
                    </Suspense>
                  }
                />
              </Route>

              {/* Protected Routes - Organizer Only */}
              <Route
                path="/organizer/my-events"
                element={
                  <ProtectedRoute allowedRoles={["organizer", "admin"]}>
                    <MyEvents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/event/:id/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["organizer", "admin"]}>
                    <EventDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/event/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={["organizer", "admin"]}>
                    <EditEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/event/:id/scan"
                element={
                  <ProtectedRoute allowedRoles={["organizer", "admin"]}>
                    <ScanQR />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/event/:id/guests"
                element={
                  <ProtectedRoute allowedRoles={["organizer", "admin"]}>
                    <EventGuestList />
                  </ProtectedRoute>
                }
              />
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
    </ThemeProvider>
  );
}

export default App;
