import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import AskKnowZone from "@/pages/AskKnowZone";
import Forums from "@/pages/Forums";
import MentorConnect from "@/pages/MentorConnect";
import Opportunities from "@/pages/Opportunities";
import LostFound from "@/pages/LostFound";
import BusTracker from "@/pages/BusTracker";
import LinkedIn from "@/pages/LinkedIn";
import FacultyDashboard from "@/pages/FacultyDashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/ask" component={AskKnowZone} />
      <Route path="/forums" component={Forums} />
      <Route path="/mentor" component={MentorConnect} />
      <Route path="/opportunities" component={Opportunities} />
      <Route path="/lost-found" component={LostFound} />
      <Route path="/bus" component={BusTracker} />
      <Route path="/linkedin" component={LinkedIn} />
      <Route path="/faculty" component={FacultyDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Router />
          </div>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
