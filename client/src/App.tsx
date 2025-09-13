import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { ErrorProvider, useErrorReporting } from "@/contexts/error-context";
import { ErrorBoundary } from "@/components/error-boundaries";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import NotesHub from "@/pages/notes-hub";
import UploadNotes from "@/pages/upload-notes";
import BrowseNotes from "@/pages/browse-notes";
import NoteDetail from "@/pages/note-detail";
import Vendors from "@/pages/vendors";
import Admin from "@/pages/admin";
import StudyGroups from "@/pages/study-groups";
import CampusResources from "@/pages/campus-resources";
import ListService from "@/pages/vendors/list-service";
import VendorDashboard from "@/pages/vendors/dashboard";
import PricingPlans from "@/pages/vendors/pricing";
import SuccessStories from "@/pages/vendors/success-stories";
import StudentDashboard from "@/pages/student-dashboard";
import Discovery from "@/pages/discovery";
import MapView from "@/pages/map-view";
import AuthDemo from "@/pages/auth-demo";
import AuthCallback from "@/pages/auth/callback";
import SignIn from "@/pages/signin";

function Router() {
  const { user, loading } = useAuth();

  return (
    <Switch>
      {loading || !user ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/signin" component={SignIn} />
          <Route path="/auth-demo" component={AuthDemo} />
          <Route path="/auth/callback" component={AuthCallback} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/notes" component={NotesHub} />
          <Route path="/upload" component={UploadNotes} />
          <Route path="/browse" component={BrowseNotes} />
          <Route path="/notes/:id" component={NoteDetail} />
          <Route path="/vendors" component={Vendors} />
          <Route path="/admin" component={Admin} />
          <Route path="/study-groups" component={StudyGroups} />
          <Route path="/campus-resources" component={CampusResources} />
          <Route path="/vendors/list-service" component={ListService} />
          <Route path="/vendors/dashboard" component={VendorDashboard} />
          <Route path="/vendors/pricing" component={PricingPlans} />
          <Route path="/vendors/success-stories" component={SuccessStories} />
          <Route path="/dashboard" component={StudentDashboard} />
          <Route path="/discovery" component={Discovery} />
          <Route path="/map" component={MapView} />
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
