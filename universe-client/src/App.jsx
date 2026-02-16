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
import { Toaster } from "sonner";

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import { cn } from "@/lib/utils";
import { swalConfirm } from "@/lib/swalConfig";

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
import StudentDashboard from "./pages/student/StudentDashboard";

// Admin Pages
import AdminLayout from "./components/layout/AdminLayout";
// Lazy Load Admin Pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const UsersPage = lazy(() => import("./pages/admin/UsersPage"));
const EventsListPage = lazy(() => import("./pages/admin/EventsListPage"));
const EventApprovalsPage = lazy(
  () => import("./pages/admin/EventApprovalsPage"),
);
const OrganizersListPage = lazy(
  () => import("./pages/admin/OrganizersListPage"),
);
const OrganizerApprovalsPage = lazy(
  () => import("./pages/admin/OrganizerApprovalsPage"),
);
const VenuesPage = lazy(() => import("./pages/admin/VenuesPage"));
const AuditLogsPage = lazy(() => import("./pages/admin/AuditLogsPage"));
const SpeakersPage = lazy(() => import("./pages/admin/SpeakersPage"));
const SpeakerApprovalsPage = lazy(
  () => import("./pages/admin/SpeakerApprovalsPage"),
);
const ReviewsPage = lazy(() => import("./pages/admin/ReviewsPage"));
const NotificationsPage = lazy(() => import("./pages/admin/NotificationsPage"));
const SettingsPage = lazy(() => import("./pages/admin/SettingsPage"));
const CategoriesPage = lazy(() => import("./pages/admin/CategoriesPage"));
const CommunitiesPage = lazy(() => import("./pages/admin/CommunitiesPage"));

// Organizer Pages
import CreateEvent from "./pages/organizer/CreateEvent";
import MyEvents from "./pages/organizer/MyEvents";
import EventGuestList from "./pages/organizer/EventGuestList";
import EventDashboard from "./pages/organizer/EventDashboard";

import EditEvent from "./pages/organizer/EditEvent";
import ScanQR from "./pages/organizer/ScanQR";
import OrganizerVenues from "./pages/organizer/Venues";
import VenueEvents from "./pages/organizer/VenueEvents";
import Analytics from "./pages/organizer/Analytics";
import Workforce from "./pages/organizer/Workforce";
import Finance from "./pages/organizer/Finance";
import ActivityLog from "./pages/organizer/ActivityLog";
import OrganizerSpeakers from "./pages/organizer/Speakers";
import Broadcast from "./pages/organizer/Broadcast";

// Components
import ProtectedRoute from "./components/auth/ProtectedRoute";

import { useState, useEffect } from "react";
import MainSidebar from "./components/layout/MainSidebar";
import Navbar from "./components/layout/Navbar";
import FloatingLines from "./components/animate-ui/components/backgrounds/FloatingLines";
import StudentSidebar from "./components/layout/StudentSidebar";
import Footer from "./components/common/Footer";

// Memoized/Static props for background to prevent WebGL context loss
const BACKGROUND_GRADIENT = ["#18ecad", "#0facf0", "#E945F5"];

const Layout = ({ children }) => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Default to collapsed/hidden for hamburger

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse user", e);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();

    // Profile sync: fetch latest user data from server if logged in
    const syncUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const latestUser = await res.json();
          setUser(latestUser);
          localStorage.setItem("user", JSON.stringify(latestUser));
        }
      } catch (err) {
        console.error("Profile sync error:", err);
      }
    };

    syncUserProfile();

    // Also sync on visibility change (when user comes back to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") syncUserProfile();
    };

    window.addEventListener("authChange", checkUser);
    window.addEventListener("storage", checkUser);
    window.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("authChange", checkUser);
      window.removeEventListener("storage", checkUser);
      window.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Re-sync on major path changes to catch role updates
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Small delay to ensure state isn't jumping
      const timer = setTimeout(() => {
        const syncUserProfile = async () => {
          try {
            const res = await fetch("/api/users/profile", {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
              const latestUser = await res.json();
              // Only update if the user object has effectively changed
              const stored = JSON.parse(localStorage.getItem("user") || "{}");
              if (JSON.stringify(latestUser) !== JSON.stringify(stored)) {
                console.log("Syncing user profile...", latestUser);
                setUser(latestUser);
                localStorage.setItem("user", JSON.stringify(latestUser));
                window.dispatchEvent(new Event("authChange"));
              }
            }
          } catch {
            // Silently fail sync
          }
        };
        syncUserProfile();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  if (location.pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  // Determine if we should use the Glasy StudentSidebar
  // We use it for Students, Organizers, and Associations as it contains the Organizer Suite
  const useStudentSidebar =
    user && ["student", "organizer", "association"].includes(user.role);

  return (
    <div className="flex min-h-screen bg-black text-foreground transition-colors duration-300 relative">
      <div className="fixed inset-0 z-[0]">
        <FloatingLines
          linesGradient={BACKGROUND_GRADIENT}
          animationSpeed={1}
          interactive
          bendRadius={5}
          bendStrength={-0.5}
          mouseDamping={0.05}
          parallax
          parallaxStrength={0.2}
        />
      </div>

      {useStudentSidebar ? (
        <StudentSidebar
          user={user}
          isOpen={!sidebarCollapsed}
          onLogout={async () => {
            const result = await swalConfirm({
              title: "Logout?",
              text: "Are you sure you want to end your session?",
              confirmButtonText: "Logout",
              confirmButtonColor: "#ef4444",
            });

            if (result.isConfirmed) {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              setUser(null);
              window.dispatchEvent(new Event("authChange"));
              const navigate = (path) => {
                window.history.pushState({}, "", path);
                window.dispatchEvent(new Event("popstate"));
              };
              navigate("/login");
            }
          }}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      ) : (
        user && <MainSidebar user={user} collapsed={sidebarCollapsed} />
      )}

      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 relative z-10 transition-all duration-300",
          user?.role === "student" && !sidebarCollapsed ? "ml-[280px]" : "ml-0",
        )}
      >
        <Navbar
          user={user}
          collapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 px-4 md:px-8 pb-8 pt-20 w-full max-w-7xl mx-auto">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <div className="min-h-screen relative bg-black text-foreground transition-colors duration-300">
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route path="/communities" element={<Communities />} />
              <Route path="/start-club" element={<ClubProposal />} />
              <Route path="/communities/:id" element={<ClubDetails />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/venues" element={<Venues />} />
              <Route path="/venues/:id" element={<VenueDetails />} />

              {/* Student Routes */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />

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
              <Route
                path="/news"
                element={
                  <ProtectedRoute>
                    <News />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/speakers"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <Speakers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/speakers/:id"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <SpeakerDetails />
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
                  element={<Navigate to="events/list" replace />}
                />
                <Route
                  path="events/list"
                  element={
                    <Suspense
                      fallback={
                        <div className="p-8 text-foreground">Loading...</div>
                      }
                    >
                      <EventsListPage />
                    </Suspense>
                  }
                />
                <Route
                  path="events/approvals"
                  element={
                    <Suspense
                      fallback={
                        <div className="p-8 text-foreground">Loading...</div>
                      }
                    >
                      <EventApprovalsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="organizers"
                  element={<Navigate to="organizers/list" replace />}
                />
                <Route
                  path="organizers/list"
                  element={
                    <Suspense
                      fallback={
                        <div className="p-8 text-foreground">Loading...</div>
                      }
                    >
                      <OrganizersListPage />
                    </Suspense>
                  }
                />
                <Route
                  path="organizers/approvals"
                  element={
                    <Suspense
                      fallback={
                        <div className="p-8 text-foreground">Loading...</div>
                      }
                    >
                      <OrganizerApprovalsPage />
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
                <Route
                  path="speakers"
                  element={<Navigate to="/admin/speakers/list" replace />}
                />
                <Route
                  path="speakers/list"
                  element={
                    <Suspense
                      fallback={
                        <div className="p-8 text-foreground">Loading...</div>
                      }
                    >
                      <SpeakersPage />
                    </Suspense>
                  }
                />
                <Route
                  path="speakers/approvals"
                  element={
                    <Suspense
                      fallback={
                        <div className="p-8 text-foreground">Loading...</div>
                      }
                    >
                      <SpeakerApprovalsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="reviews"
                  element={
                    <Suspense
                      fallback={
                        <div className="p-8 text-foreground">Loading...</div>
                      }
                    >
                      <ReviewsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="notifications"
                  element={
                    <Suspense
                      fallback={
                        <div className="p-8 text-foreground">Loading...</div>
                      }
                    >
                      <NotificationsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <Suspense
                      fallback={
                        <div className="p-8 text-foreground">Loading...</div>
                      }
                    >
                      <SettingsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="categories"
                  element={
                    <Suspense
                      fallback={
                        <div className="p-8 text-foreground">Loading...</div>
                      }
                    >
                      <CategoriesPage />
                    </Suspense>
                  }
                />
                <Route
                  path="communities"
                  element={
                    <Suspense
                      fallback={
                        <div className="p-8 text-foreground">Loading...</div>
                      }
                    >
                      <CommunitiesPage />
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
                  <ProtectedRoute
                    allowedRoles={["organizer", "admin"]}
                    requirePresident={true}
                  >
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
                  <ProtectedRoute
                    allowedRoles={["organizer", "admin"]}
                    requirePresident={true}
                  >
                    <CreateEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/venues"
                element={
                  <ProtectedRoute
                    allowedRoles={["organizer", "admin"]}
                    requirePresident={true}
                  >
                    <OrganizerVenues />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/venues/:id/events"
                element={
                  <ProtectedRoute allowedRoles={["organizer", "admin"]}>
                    <VenueEvents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/analytics"
                element={
                  <ProtectedRoute
                    allowedRoles={["organizer", "admin"]}
                    requirePresident={true}
                  >
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/workforce"
                element={
                  <ProtectedRoute allowedRoles={["organizer", "admin"]}>
                    <Workforce />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/finance"
                element={
                  <ProtectedRoute
                    allowedRoles={["organizer", "admin"]}
                    requirePresident={true}
                  >
                    <Finance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/activity-log"
                element={
                  <ProtectedRoute allowedRoles={["organizer", "admin"]}>
                    <ActivityLog />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/speakers"
                element={
                  <ProtectedRoute
                    allowedRoles={["organizer", "admin"]}
                    requirePresident={true}
                  >
                    <OrganizerSpeakers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/broadcast"
                element={
                  <ProtectedRoute
                    allowedRoles={["organizer", "admin"]}
                    requirePresident={true}
                  >
                    <Broadcast />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all for undefined routes - Redirects to Home/Dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
          <Toaster position="top-right" richColors closeButton />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
