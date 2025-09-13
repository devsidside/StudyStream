import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import NotesHub from "@/pages/notes-hub";
import UploadNotes from "@/pages/upload-notes";
import BrowseNotes from "@/pages/browse-notes";
import NoteDetail from "@/pages/note-detail";
import Vendors from "@/pages/vendors";
import Admin from "@/pages/admin";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/notes" component={NotesHub} />
          <Route path="/upload" component={UploadNotes} />
          <Route path="/browse" component={BrowseNotes} />
          <Route path="/notes/:id" component={NoteDetail} />
          <Route path="/vendors" component={Vendors} />
          <Route path="/admin" component={Admin} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
