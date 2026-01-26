import { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Squares from "@/components/backgrounds/Squares";
// Context
import { ThemeProvider } from "@/context/ThemeContext";

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
import EventDashboard from "./pages/organizer/EventDashboard";
import EditEvent from "./pages/organizer/EditEvent";
import ScanQR from "./pages/organizer/ScanQR";

// Components
import ProtectedRoute from "./components/auth/ProtectedRoute";

import { useState, useEffect } from "react";
import MainSidebar from "./components/layout/MainSidebar";
import Navbar from "./components/layout/Navbar";

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
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      <MainSidebar user={user} collapsed={sidebarCollapsed} />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Navbar
          user={user}
          collapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 px-4 md:px-8 pb-8 pt-4 z-10 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <div className="min-h-screen relative bg-background text-foreground transition-colors duration-300">
          <div className="fixed inset-0 -z-10">
            {/* Squares background can be made theme-aware if needed, but for now we keep it or adjust props dynamically if possible. 
                Currently hardcoded to dark colors in original props. Let's make it more neutral or remove if it clashes with white mode. 
                For now keeping it but it might be invisible in light mode if not adjusted. */}
            <Squares
              squareSize={40}
              borderColor="rgba(128, 128, 128, 0.1)"
              hoverFillColor="rgba(128, 128, 128, 0.1)"
              speed={0.3}
              direction="diagonal"
              flickerProbability={0.1}
            />
          </div>

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
