import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "@/pages/home";
import Subscriptions from "@/pages/subscriptions";
import Queue from "@/pages/queue";
import Downloads from "@/pages/downloads";
import Settings from "@/pages/settings";
import Search from "@/pages/search";
import NotFound from "@/pages/not-found";
import AudioPlayer from "@/components/audio-player";
import BottomNavigation from "@/components/bottom-navigation";
import FullPlayerModal from "@/components/full-player-modal";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/subscriptions" component={Subscriptions} />
      <Route path="/queue" component={Queue} />
      <Route path="/downloads" component={Downloads} />
      <Route path="/settings" component={Settings} />
      <Route path="/search" component={Search} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="podcast-app-theme">
        <TooltipProvider>
          <div className="max-w-md mx-auto bg-app-dark dark:bg-app-dark bg-app-light min-h-screen relative text-primary-white dark:text-primary-white text-primary-dark">
            <Router />
            <AudioPlayer />
            <BottomNavigation />
            <FullPlayerModal />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
