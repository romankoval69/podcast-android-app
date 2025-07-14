import { Podcast } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, HeartOff, MoreVertical } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PodcastCardProps {
  podcast: Podcast;
  compact?: boolean;
}

export default function PodcastCard({ podcast, compact = false }: PodcastCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const toggleSubscriptionMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PATCH", `/api/podcasts/${podcast.id}`, {
        subscribed: !podcast.subscribed,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/podcasts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/podcasts/subscribed"] });
      toast({
        title: podcast.subscribed ? "Unsubscribed" : "Subscribed",
        description: podcast.subscribed 
          ? `Unsubscribed from ${podcast.title}`
          : `Subscribed to ${podcast.title}`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive",
      });
    },
  });

  if (compact) {
    return (
      <Card className="bg-surface-dark dark:bg-surface-dark bg-surface-light">
        <CardContent className="p-3 text-center">
          <img 
            src={podcast.imageUrl || "/placeholder-podcast.jpg"} 
            alt={podcast.title}
            className="w-12 h-12 rounded-lg mx-auto mb-2 object-cover"
          />
          <p className="text-xs font-medium text-primary-white dark:text-primary-white text-primary-dark truncate">
            {podcast.title}
          </p>
          <p className="text-xs text-secondary-gray dark:text-secondary-gray text-secondary-dark truncate">
            {podcast.author}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-surface-dark dark:bg-surface-dark bg-surface-light shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <img 
            src={podcast.imageUrl || "/placeholder-podcast.jpg"} 
            alt={podcast.title}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm text-primary-white dark:text-primary-white text-primary-dark line-clamp-2">
              {podcast.title}
            </h3>
            <p className="text-xs text-secondary-gray dark:text-secondary-gray text-secondary-dark mt-1">
              {podcast.author}
            </p>
            <p className="text-xs text-secondary-gray dark:text-secondary-gray text-secondary-dark mt-1 line-clamp-2">
              {podcast.description}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              {podcast.categories && podcast.categories.map((category, index) => (
                <span 
                  key={index}
                  className="text-xs bg-gray-700 dark:bg-gray-700 bg-gray-200 text-primary-white dark:text-primary-white text-primary-dark px-2 py-1 rounded"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSubscriptionMutation.mutate()}
              disabled={toggleSubscriptionMutation.isPending}
              className="p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-200 transition-colors"
            >
              {podcast.subscribed ? (
                <Heart size={16} className="text-red-500" />
              ) : (
                <HeartOff size={16} />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-200 transition-colors"
            >
              <MoreVertical size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
