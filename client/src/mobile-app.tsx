import React, { useEffect, useState } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Device } from '@capacitor/device';
import { Network } from '@capacitor/network';
import { Preferences } from '@capacitor/preferences';
import { Filesystem, Directory } from '@capacitor/filesystem';
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

export default function MobileApp() {
  const [isReady, setIsReady] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [networkStatus, setNetworkStatus] = useState<any>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Set status bar style
        await StatusBar.setStyle({ style: Style.Dark });
        
        // Get device info
        const info = await Device.getInfo();
        setDeviceInfo(info);
        
        // Get network status
        const status = await Network.getStatus();
        setNetworkStatus(status);
        
        // Listen for network changes
        Network.addListener('networkStatusChange', (status) => {
          setNetworkStatus(status);
        });
        
        // Handle app state changes
        CapacitorApp.addListener('appStateChange', ({ isActive }) => {
          if (isActive) {
            // App resumed - refresh content
            queryClient.invalidateQueries();
          }
        });
        
        // Handle back button
        CapacitorApp.addListener('backButton', ({ canGoBack }) => {
          if (!canGoBack) {
            CapacitorApp.exitApp();
          } else {
            window.history.back();
          }
        });
        
        // Create downloads directory
        try {
          await Filesystem.mkdir({
            path: 'downloads',
            directory: Directory.Data,
            recursive: true
          });
        } catch (error) {
          console.log('Downloads directory already exists');
        }
        
        // Hide splash screen
        await SplashScreen.hide();
        
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize mobile app:', error);
        setIsReady(true); // Continue anyway
      }
    };

    initializeApp();
  }, []);

  // Haptic feedback helper
  const vibrate = (style: ImpactStyle = ImpactStyle.Light) => {
    Haptics.impact({ style });
  };

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-app-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary-white">Loading PodcastApp...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="podcast-app-theme">
        <TooltipProvider>
          <div className="max-w-md mx-auto bg-app-dark dark:bg-app-dark bg-app-light min-h-screen relative text-primary-white dark:text-primary-white text-primary-dark">
            {/* Network status indicator */}
            {networkStatus && !networkStatus.connected && (
              <div className="bg-red-500 text-white text-center py-2 text-sm">
                Offline Mode - Some features may be limited
              </div>
            )}
            
            {/* Device info for debugging */}
            {deviceInfo && process.env.NODE_ENV === 'development' && (
              <div className="bg-blue-500 text-white text-center py-1 text-xs">
                {deviceInfo.platform} {deviceInfo.osVersion}
              </div>
            )}
            
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