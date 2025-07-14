import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserSettings } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Settings as SettingsIcon, 
  Palette, 
  Download, 
  Volume2, 
  Clock, 
  Smartphone,
  Info
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/use-theme";

export default function Settings() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery<UserSettings>({
    queryKey: ["/api/settings"],
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (updates: Partial<UserSettings>) => 
      apiRequest("PATCH", "/api/settings", updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings updated",
        description: "Your preferences have been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  const handleSettingChange = (key: keyof UserSettings, value: any) => {
    updateSettingsMutation.mutate({ [key]: value });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pb-32">
        <header className="sticky top-0 z-50 bg-surface-dark dark:bg-surface-dark bg-surface-light border-b border-gray-700 dark:border-gray-700 border-gray-300">
          <div className="p-4">
            <h1 className="text-xl font-medium text-primary-white dark:text-primary-white text-primary-dark">
              Settings
            </h1>
          </div>
        </header>
        <main className="p-4">
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="bg-surface-dark dark:bg-surface-dark bg-surface-light">
                <CardContent className="p-4">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface-dark dark:bg-surface-dark bg-surface-light border-b border-gray-700 dark:border-gray-700 border-gray-300">
        <div className="p-4">
          <h1 className="text-xl font-medium text-primary-white dark:text-primary-white text-primary-dark">
            Settings
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-6">
        
        {/* Appearance */}
        <Card className="bg-surface-dark dark:bg-surface-dark bg-surface-light">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-primary-white dark:text-primary-white text-primary-dark">
              <Palette size={20} />
              <span>Appearance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-primary-white dark:text-primary-white text-primary-dark">
                  Theme
                </Label>
                <p className="text-xs text-secondary-gray dark:text-secondary-gray text-secondary-dark">
                  Choose your preferred color scheme
                </p>
              </div>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Playback */}
        <Card className="bg-surface-dark dark:bg-surface-dark bg-surface-light">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-primary-white dark:text-primary-white text-primary-dark">
              <Volume2 size={20} />
              <span>Playback</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-primary-white dark:text-primary-white text-primary-dark">
                  Default Playback Speed
                </Label>
                <p className="text-xs text-secondary-gray dark:text-secondary-gray text-secondary-dark">
                  Default speed for new episodes
                </p>
              </div>
              <Select
                value={settings?.playbackSpeed || "1.0"}
                onValueChange={(value) => handleSettingChange("playbackSpeed", value)}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">0.5x</SelectItem>
                  <SelectItem value="0.75">0.75x</SelectItem>
                  <SelectItem value="1.0">1.0x</SelectItem>
                  <SelectItem value="1.25">1.25x</SelectItem>
                  <SelectItem value="1.5">1.5x</SelectItem>
                  <SelectItem value="1.75">1.75x</SelectItem>
                  <SelectItem value="2.0">2.0x</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-primary-white dark:text-primary-white text-primary-dark">
                  Skip Forward: {settings?.skipForwardSeconds || 30} seconds
                </Label>
                <Slider
                  value={[settings?.skipForwardSeconds || 30]}
                  onValueChange={(value) => handleSettingChange("skipForwardSeconds", value[0])}
                  max={60}
                  min={5}
                  step={5}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-primary-white dark:text-primary-white text-primary-dark">
                  Skip Backward: {settings?.skipBackwardSeconds || 30} seconds
                </Label>
                <Slider
                  value={[settings?.skipBackwardSeconds || 30]}
                  onValueChange={(value) => handleSettingChange("skipBackwardSeconds", value[0])}
                  max={60}
                  min={5}
                  step={5}
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Downloads */}
        <Card className="bg-surface-dark dark:bg-surface-dark bg-surface-light">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-primary-white dark:text-primary-white text-primary-dark">
              <Download size={20} />
              <span>Downloads</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-primary-white dark:text-primary-white text-primary-dark">
                  Auto Download
                </Label>
                <p className="text-xs text-secondary-gray dark:text-secondary-gray text-secondary-dark">
                  Automatically download new episodes
                </p>
              </div>
              <Switch
                checked={settings?.autoDownload || false}
                onCheckedChange={(checked) => handleSettingChange("autoDownload", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-primary-white dark:text-primary-white text-primary-dark">
                  Download Quality
                </Label>
                <p className="text-xs text-secondary-gray dark:text-secondary-gray text-secondary-dark">
                  Audio quality for downloads
                </p>
              </div>
              <Select
                value={settings?.downloadQuality || "high"}
                onValueChange={(value) => handleSettingChange("downloadQuality", value)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Sleep Timer */}
        <Card className="bg-surface-dark dark:bg-surface-dark bg-surface-light">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-primary-white dark:text-primary-white text-primary-dark">
              <Clock size={20} />
              <span>Sleep Timer</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-primary-white dark:text-primary-white text-primary-dark">
                Default Duration: {settings?.sleepTimerMinutes || 30} minutes
              </Label>
              <Slider
                value={[settings?.sleepTimerMinutes || 30]}
                onValueChange={(value) => handleSettingChange("sleepTimerMinutes", value[0])}
                max={120}
                min={5}
                step={5}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="bg-surface-dark dark:bg-surface-dark bg-surface-light">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-primary-white dark:text-primary-white text-primary-dark">
              <Info size={20} />
              <span>About</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-primary-white dark:text-primary-white text-primary-dark">
                  Version
                </Label>
                <p className="text-xs text-secondary-gray dark:text-secondary-gray text-secondary-dark">
                  PodcastApp v1.0.0
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-primary-white dark:text-primary-white text-primary-dark">
                  Storage
                </Label>
                <p className="text-xs text-secondary-gray dark:text-secondary-gray text-secondary-dark">
                  Manage app data and cache
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Smartphone size={14} className="mr-2" />
                Manage
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
