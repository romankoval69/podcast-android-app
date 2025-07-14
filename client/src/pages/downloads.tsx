import { useQuery } from "@tanstack/react-query";
import { Episode } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import EpisodeCard from "@/components/episode-card";
import { Download, Trash2, HardDrive } from "lucide-react";
import { formatFileSize } from "@/lib/audio-utils";

export default function Downloads() {
  const { data: episodes, isLoading, error } = useQuery<Episode[]>({
    queryKey: ["/api/episodes/downloaded"],
  });

  const totalSize = episodes?.reduce((sum, episode) => sum + (episode.fileSize || 0), 0) || 0;

  if (error) {
    return (
      <div className="min-h-screen pb-32">
        <header className="sticky top-0 z-50 bg-surface-dark dark:bg-surface-dark bg-surface-light border-b border-gray-700 dark:border-gray-700 border-gray-300">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-medium text-primary-white dark:text-primary-white text-primary-dark">
              Downloads
            </h1>
          </div>
        </header>

        <main className="p-4">
          <Card className="bg-surface-dark dark:bg-surface-dark bg-surface-light">
            <CardContent className="p-8 text-center">
              <p className="text-destructive">Failed to load downloads</p>
              <p className="text-sm text-secondary-gray dark:text-secondary-gray text-secondary-dark mt-2">
                Please check your connection and try again.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface-dark dark:bg-surface-dark bg-surface-light border-b border-gray-700 dark:border-gray-700 border-gray-300">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-medium text-primary-white dark:text-primary-white text-primary-dark">
            Downloads
          </h1>
          {episodes && episodes.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-200 transition-colors"
            >
              <Trash2 size={20} />
            </Button>
          )}
        </div>
      </header>

      {/* Storage Info */}
      {episodes && episodes.length > 0 && (
        <div className="p-4 border-b border-gray-700 dark:border-gray-700 border-gray-300">
          <Card className="bg-surface-dark dark:bg-surface-dark bg-surface-light">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <HardDrive className="text-primary-blue" size={24} />
                  <div>
                    <p className="text-sm font-medium text-primary-white dark:text-primary-white text-primary-dark">
                      Storage Used
                    </p>
                    <p className="text-xs text-secondary-gray dark:text-secondary-gray text-secondary-dark">
                      {episodes.length} episodes • {formatFileSize(totalSize)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:bg-red-100 dark:hover:bg-red-900"
                >
                  Clean Up
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <main className="p-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
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
            ))}
          </div>
        ) : episodes?.length === 0 ? (
          <Card className="bg-surface-dark dark:bg-surface-dark bg-surface-light">
            <CardContent className="p-8 text-center">
              <Download className="mx-auto mb-4 text-secondary-gray dark:text-secondary-gray text-secondary-dark" size={64} />
              <h2 className="text-lg font-medium text-primary-white dark:text-primary-white text-primary-dark mb-2">
                No Downloads Yet
              </h2>
              <p className="text-secondary-gray dark:text-secondary-gray text-secondary-dark mb-6">
                Download episodes to listen offline. Downloads are saved to your device and can be played without an internet connection.
              </p>
              <Button
                onClick={() => window.history.back()}
                className="bg-primary-blue hover:bg-primary-dark-blue text-white"
              >
                <Download size={16} className="mr-2" />
                Browse Episodes
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {episodes?.map((episode) => (
              <div key={episode.id} className="relative">
                <EpisodeCard episode={episode} showPodcastInfo />
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  Downloaded
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
