import { useQuery } from "@tanstack/react-query";
import { Podcast } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PodcastCard from "@/components/podcast-card";
import { Heart, Search, Plus } from "lucide-react";
import { useLocation } from "wouter";

export default function Subscriptions() {
  const [, setLocation] = useLocation();

  const { data: podcasts, isLoading, error } = useQuery<Podcast[]>({
    queryKey: ["/api/podcasts/subscribed"],
  });

  if (error) {
    return (
      <div className="min-h-screen pb-32">
        <header className="sticky top-0 z-50 bg-surface-dark dark:bg-surface-dark bg-surface-light border-b border-gray-700 dark:border-gray-700 border-gray-300">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-medium text-primary-white dark:text-primary-white text-primary-dark">
              Subscriptions
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/search")}
              className="p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-200 transition-colors"
            >
              <Search size={20} />
            </Button>
          </div>
        </header>

        <main className="p-4">
          <Card className="bg-surface-dark dark:bg-surface-dark bg-surface-light">
            <CardContent className="p-8 text-center">
              <p className="text-destructive">Failed to load subscriptions</p>
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
            Subscriptions
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/search")}
            className="p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-200 transition-colors"
          >
            <Search size={20} />
          </Button>
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
        ) : podcasts?.length === 0 ? (
          <Card className="bg-surface-dark dark:bg-surface-dark bg-surface-light">
            <CardContent className="p-8 text-center">
              <Heart className="mx-auto mb-4 text-secondary-gray dark:text-secondary-gray text-secondary-dark" size={64} />
              <h2 className="text-lg font-medium text-primary-white dark:text-primary-white text-primary-dark mb-2">
                No Subscriptions Yet
              </h2>
              <p className="text-secondary-gray dark:text-secondary-gray text-secondary-dark mb-6">
                Subscribe to podcasts to see them here. Search for your favorite shows to get started.
              </p>
              <Button
                onClick={() => setLocation("/search")}
                className="bg-primary-blue hover:bg-primary-dark-blue text-white"
              >
                <Plus size={16} className="mr-2" />
                Find Podcasts
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {podcasts?.map((podcast) => (
              <PodcastCard key={podcast.id} podcast={podcast} />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <Button
        onClick={() => setLocation("/search")}
        className="fixed bottom-20 right-4 bg-secondary-yellow hover:bg-yellow-600 text-white p-4 rounded-full shadow-lg transition-colors"
      >
        <Plus size={20} />
      </Button>
    </div>
  );
}
