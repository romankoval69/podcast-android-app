import { useQuery } from "@tanstack/react-query";
import { Podcast, Episode } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import EpisodeCard from "@/components/episode-card";
import PodcastCard from "@/components/podcast-card";
import { Play, Clock, Heart, Download, Smartphone, Search, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useLocation } from "wouter";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [, setLocation] = useLocation();

  const { data: recentEpisodes, isLoading: loadingEpisodes } = useQuery<Episode[]>({
    queryKey: ["/api/episodes/recent"],
  });

  const { data: subscribedPodcasts, isLoading: loadingPodcasts } = useQuery<Podcast[]>({
    queryKey: ["/api/podcasts/subscribed"],
  });

  const { data: downloadedEpisodes, isLoading: loadingDownloads } = useQuery<Episode[]>({
    queryKey: ["/api/episodes/downloaded"],
  });

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const continueListeningEpisode = recentEpisodes?.find(episode => 
    episode.playbackPosition && episode.playbackPosition > 0 && !episode.completed
  );

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface-dark dark:bg-surface-dark bg-surface-light border-b border-gray-700 dark:border-gray-700 border-gray-300">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <h1 className="text-xl font-medium text-primary-white dark:text-primary-white text-primary-dark">
              PodcastApp
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/search")}
              className="p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-200 transition-colors"
            >
              <Search size={20} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-200 transition-colors"
            >
              <Moon size={20} />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-6">
        
        {/* Continue Listening Section */}
        {continueListeningEpisode && (
          <div className="space-y-3">
            <h2 className="text-lg font-medium flex items-center space-x-2 text-primary-white dark:text-primary-white text-primary-dark">
              <Play className="text-primary-blue" size={20} />
              <span>Continue Listening</span>
            </h2>
            <EpisodeCard episode={continueListeningEpisode} showPodcastInfo />
          </div>
        )}

        {/* New Episodes Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-medium flex items-center space-x-2 text-primary-white dark:text-primary-white text-primary-dark">
            <Clock className="text-secondary-yellow" size={20} />
            <span>New Episodes</span>
          </h2>
          <div className="space-y-3">
            {loadingEpisodes ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="bg-surface-dark dark:bg-surface-dark bg-surface-light">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Skeleton className="w-16 h-16 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : recentEpisodes?.length === 0 ? (
              <Card className="bg-surface-dark dark:bg-surface-dark bg-surface-light">
                <CardContent className="p-8 text-center">
                  <Clock className="mx-auto mb-4 text-secondary-gray dark:text-secondary-gray text-secondary-dark" size={48} />
                  <p className="text-secondary-gray dark:text-secondary-gray text-secondary-dark">
                    No new episodes available.
                  </p>
                  <p className="text-sm text-secondary-gray dark:text-secondary-gray text-secondary-dark mt-2">
                    Subscribe to podcasts to see new episodes here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              recentEpisodes?.slice(0, 3).map((episode) => (
                <EpisodeCard 
                  key={episode.id} 
                  episode={episode} 
                  showPodcastInfo 
                />
              ))
            )}
          </div>
        </div>

        {/* Subscriptions Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-medium flex items-center space-x-2 text-primary-white dark:text-primary-white text-primary-dark">
            <Heart className="text-red-500" size={20} />
            <span>Your Subscriptions</span>
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {loadingPodcasts ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="bg-surface-dark dark:bg-surface-dark bg-surface-light">
                  <CardContent className="p-3 text-center">
                    <Skeleton className="w-12 h-12 rounded-lg mx-auto mb-2" />
                    <Skeleton className="h-3 w-full mb-1" />
                    <Skeleton className="h-3 w-2/3 mx-auto" />
                  </CardContent>
                </Card>
              ))
            ) : subscribedPodcasts?.length === 0 ? (
              <div className="col-span-3">
                <Card className="bg-surface-dark dark:bg-surface-dark bg-surface-light">
                  <CardContent className="p-8 text-center">
                    <Heart className="mx-auto mb-4 text-secondary-gray dark:text-secondary-gray text-secondary-dark" size={48} />
                    <p className="text-secondary-gray dark:text-secondary-gray text-secondary-dark">
                      No subscriptions yet.
                    </p>
                    <p className="text-sm text-secondary-gray dark:text-secondary-gray text-secondary-dark mt-2">
                      Search for podcasts to get started.
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              subscribedPodcasts?.slice(0, 3).map((podcast) => (
                <PodcastCard key={podcast.id} podcast={podcast} compact />
              ))
            )}
          </div>
        </div>

        {/* Downloads Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-medium flex items-center space-x-2 text-primary-white dark:text-primary-white text-primary-dark">
            <Download className="text-green-500" size={20} />
            <span>Downloads</span>
          </h2>
          <Card className="bg-surface-dark dark:bg-surface-dark bg-surface-light shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className="text-primary-blue" size={32} />
                  <div>
                    <p className="text-sm font-medium text-primary-white dark:text-primary-white text-primary-dark">
                      Downloaded Episodes
                    </p>
                    <p className="text-xs text-secondary-gray dark:text-secondary-gray text-secondary-dark">
                      {loadingDownloads ? (
                        <Skeleton className="h-3 w-20" />
                      ) : (
                        `${downloadedEpisodes?.length || 0} episodes`
                      )}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation("/downloads")}
                  className="text-primary-blue text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-200"
                >
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
