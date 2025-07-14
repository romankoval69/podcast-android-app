import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QueueItem, Episode } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import EpisodeCard from "@/components/episode-card";
import { List, Play, Trash2, GripVertical } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Queue() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: queueItems, isLoading, error } = useQuery<QueueItem[]>({
    queryKey: ["/api/queue"],
  });

  const { data: episodes } = useQuery<Episode[]>({
    queryKey: ["/api/episodes"],
  });

  const clearQueueMutation = useMutation({
    mutationFn: () => apiRequest("DELETE", "/api/queue"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/queue"] });
      toast({
        title: "Queue cleared",
        description: "All episodes have been removed from the queue.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to clear queue",
        variant: "destructive",
      });
    },
  });

  const removeFromQueueMutation = useMutation({
    mutationFn: (queueItemId: number) => apiRequest("DELETE", `/api/queue/${queueItemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/queue"] });
      toast({
        title: "Removed from queue",
        description: "Episode has been removed from the queue.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove from queue",
        variant: "destructive",
      });
    },
  });

  // Get episodes with queue information
  const queueEpisodes = queueItems?.map(queueItem => {
    const episode = episodes?.find(e => e.id === queueItem.episodeId);
    return episode ? { ...episode, queueId: queueItem.id, queuePosition: queueItem.position } : null;
  }).filter(Boolean).sort((a, b) => (a?.queuePosition || 0) - (b?.queuePosition || 0));

  if (error) {
    return (
      <div className="min-h-screen pb-32">
        <header className="sticky top-0 z-50 bg-surface-dark dark:bg-surface-dark bg-surface-light border-b border-gray-700 dark:border-gray-700 border-gray-300">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-medium text-primary-white dark:text-primary-white text-primary-dark">
              Queue
            </h1>
          </div>
        </header>

        <main className="p-4">
          <Card className="bg-surface-dark dark:bg-surface-dark bg-surface-light">
            <CardContent className="p-8 text-center">
              <p className="text-destructive">Failed to load queue</p>
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
            Queue
          </h1>
          {queueEpisodes && queueEpisodes.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearQueueMutation.mutate()}
              disabled={clearQueueMutation.isPending}
              className="p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-200 transition-colors"
            >
              <Trash2 size={20} />
            </Button>
          )}
        </div>
      </header>

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
        ) : queueEpisodes?.length === 0 ? (
          <Card className="bg-surface-dark dark:bg-surface-dark bg-surface-light">
            <CardContent className="p-8 text-center">
              <List className="mx-auto mb-4 text-secondary-gray dark:text-secondary-gray text-secondary-dark" size={64} />
              <h2 className="text-lg font-medium text-primary-white dark:text-primary-white text-primary-dark mb-2">
                Queue is Empty
              </h2>
              <p className="text-secondary-gray dark:text-secondary-gray text-secondary-dark mb-6">
                Add episodes to your queue to listen to them in order. You can add episodes from any podcast.
              </p>
              <Button
                onClick={() => window.history.back()}
                className="bg-primary-blue hover:bg-primary-dark-blue text-white"
              >
                <Play size={16} className="mr-2" />
                Browse Episodes
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {queueEpisodes?.map((episode) => (
              <Card key={episode.id} className="bg-surface-dark dark:bg-surface-dark bg-surface-light shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center space-x-2">
                      <GripVertical className="text-secondary-gray dark:text-secondary-gray text-secondary-dark" size={16} />
                      <span className="text-sm font-medium text-primary-blue min-w-[24px] text-center">
                        {episode.queuePosition}
                      </span>
                    </div>
                    <img 
                      src={episode.imageUrl || "/placeholder-podcast.jpg"} 
                      alt={episode.title}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-primary-white dark:text-primary-white text-primary-dark line-clamp-2">
                        {episode.title}
                      </h3>
                      <p className="text-xs text-secondary-gray dark:text-secondary-gray text-secondary-dark mt-1 line-clamp-2">
                        {episode.description}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromQueueMutation.mutate(episode.queueId)}
                      disabled={removeFromQueueMutation.isPending}
                      className="p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
