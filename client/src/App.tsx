import { Switch, Route } from "wouter";
import { queryClient } from "@/services/api";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ErrorProvider, useErrorReporting } from "@/context/ErrorContext";
import { StudentProvider } from "@/context/StudentContext";
import { VendorProvider } from "@/context/VendorContext";
import { AdminProvider } from "@/context/AdminContext";
import { ErrorBoundary } from "@/components/error-boundaries";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NotFound from "@/pages/NotFound";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import NotesHub from "@/pages/admin/ManageNotes";
import UploadNotes from "@/pages/student/Projects";
import BrowseNotes from "@/pages/student/Notes";
import NoteDetail from "@/pages/student/AIStudyAssistant";
import Vendors from "@/pages/admin/VendorApproval";
import Admin from "@/pages/admin/Dashboard";
import StudyGroups from "@/pages/student/Events";
import CampusResources from "@/pages/admin/ManageProjects";
import ListService from "@/pages/vendor/Offerings";
import VendorDashboard from "@/pages/vendor/Dashboard";
import PricingPlans from "@/pages/vendor/Promotions";
import SuccessStories from "@/pages/vendor/Analytics";
import StudentDashboard from "@/pages/student/Dashboard";
import Discovery from "@/pages/admin/ManageEvents";
import MapView from "@/pages/student/MapView";
import AuthDemo from "@/pages/auth/Register";
import AuthCallback from "@/pages/auth/callback";
import SignIn from "@/pages/auth/Login";
import HowItWorks from "@/pages/how-it-works";
import BrowseServices from "@/pages/admin/Analytics";
import Accommodations from "@/pages/vendor/Events";
import BookTutors from "@/pages/book-tutors";
import StudentProfile from "@/pages/student/Profile";
import Notifications from "@/pages/student/Notifications";
import VendorProfile from "@/pages/vendor/Profile";
import VendorAnalytics from "@/pages/vendor/BusinessAnalytics";
import UserManagement from "@/pages/admin/UserManagement";
import AdminSettings from "@/pages/admin/Settings";

function Router() {
  const { user, loading } = useAuth();

  return (
    <Switch>
      {loading || !user ? (
        <>
          {/* Public routes */}
          <Route path="/" component={Landing} />
          <Route path="/how-it-works" component={HowItWorks} />
          <Route path="/browse-services" component={BrowseServices} />
          <Route path="/accommodations" component={Accommodations} />
          <Route path="/vendors" component={Vendors} />
          <Route path="/vendors/pricing" component={PricingPlans} />
          <Route path="/vendors/success-stories" component={SuccessStories} />
          <Route path="/book-tutors" component={BookTutors} />
          <Route path="/signin" component={SignIn} />
          <Route path="/auth-demo" component={AuthDemo} />
          <Route path="/auth/callback" component={AuthCallback} />
        </>
      ) : (
        <>
          {/* Authenticated home */}
          <Route path="/" component={Home} />
          <Route path="/how-it-works" component={HowItWorks} />
          
          {/* Student routes */}
          <Route path="/dashboard">
            {() => (
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/student/profile">
            {() => (
              <ProtectedRoute requiredRole="student">
                <StudentProfile />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/student/notifications">
            {() => (
              <ProtectedRoute requiredRole="student">
                <Notifications />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/browse">
            {() => (
              <ProtectedRoute requiredRole={["student", "admin"]}>
                <BrowseNotes />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/upload">
            {() => (
              <ProtectedRoute requiredRole="student">
                <UploadNotes />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/notes/:id">
            {() => (
              <ProtectedRoute requiredRole={["student", "admin"]}>
                <NoteDetail />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/study-groups">
            {() => (
              <ProtectedRoute requiredRole={["student", "admin"]}>
                <StudyGroups />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/map">
            {() => (
              <ProtectedRoute requiredRole="student">
                <MapView />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/discovery">
            {() => (
              <ProtectedRoute requiredRole={["student", "admin"]}>
                <Discovery />
              </ProtectedRoute>
            )}
          </Route>
          
          {/* Vendor routes */}
          <Route path="/vendors/dashboard">
            {() => (
              <ProtectedRoute requiredRole="vendor">
                <VendorDashboard />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/vendors/profile">
            {() => (
              <ProtectedRoute requiredRole="vendor">
                <VendorProfile />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/vendors/analytics">
            {() => (
              <ProtectedRoute requiredRole="vendor">
                <VendorAnalytics />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/vendors/list-service">
            {() => (
              <ProtectedRoute requiredRole="vendor">
                <ListService />
              </ProtectedRoute>
            )}
          </Route>
          
          {/* Admin routes */}
          <Route path="/admin">
            {() => (
              <ProtectedRoute requiredRole="admin">
                <Admin />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/admin/users">
            {() => (
              <ProtectedRoute requiredRole="admin">
                <UserManagement />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/admin/settings">
            {() => (
              <ProtectedRoute requiredRole="admin">
                <AdminSettings />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/notes">
            {() => (
              <ProtectedRoute requiredRole="admin">
                <NotesHub />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/campus-resources">
            {() => (
              <ProtectedRoute requiredRole="admin">
                <CampusResources />
              </ProtectedRoute>
            )}
          </Route>
          
          {/* Shared authenticated routes */}
          <Route path="/browse-services" component={BrowseServices} />
          <Route path="/accommodations" component={Accommodations} />
          <Route path="/vendors" component={Vendors} />
          <Route path="/vendors/pricing" component={PricingPlans} />
          <Route path="/vendors/success-stories" component={SuccessStories} />
          <Route path="/book-tutors" component={BookTutors} />
          <Route path="/auth-demo" component={AuthDemo} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppWithErrorHandling() {
  const { reportError } = useErrorReporting();
  
  return (
    <ErrorBoundary 
      level="critical" 
      showDetails={import.meta.env.MODE === 'development'}
      onError={(error, errorInfo) => {
        reportError(error, {
          type: 'error',
          source: 'client',
          details: { componentStack: errorInfo.componentStack },
          showToast: false // Critical errors have their own UI
        });
      }}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StudentProvider>
            <VendorProvider>
              <AdminProvider>
                <ErrorBoundary 
                  level="page"
                  onError={(error, errorInfo) => {
                    reportError(error, {
                      type: 'error',
                      source: 'client',
                      details: { componentStack: errorInfo.componentStack }
                    });
                  }}
                >
                  <TooltipProvider>
                    <Toaster />
                    <Router />
                  </TooltipProvider>
                </ErrorBoundary>
              </AdminProvider>
            </VendorProvider>
          </StudentProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ErrorProvider>
      <AppWithErrorHandling />
    </ErrorProvider>
  );
}

export default App;
