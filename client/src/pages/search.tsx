import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, ArrowLeft, Rss, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { searchPodcasts, subscribeToPodcast, PodcastSearchResult } from "@/lib/podcast-api";
import { useQueryClient } from "@tanstack/react-query";

export default function SearchPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PodcastSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchMutation = useMutation({
    mutationFn: async (query: string) => {
      setIsSearching(true);
      setHasSearched(true);
      return searchPodcasts(query);
    },
    onSuccess: (results) => {
      setSearchResults(results);
      setIsSearching(false);
    },
    onError: (error) => {
      console.error("Search error:", error);
      setSearchResults([]);
      setIsSearching(false);
      toast({
        title: "Search failed",
        description: "Unable to search for podcasts. Please check your connection and try again.",
        variant: "destructive",
      });
    },
  });

  const subscribeMutation = useMutation({
    mutationFn: async (feedUrl: string) => {
      return subscribeToPodcast(feedUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/podcasts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/podcasts/subscribed"] });
      toast({
        title: "Subscribed successfully",
        description: "The podcast has been added to your subscriptions.",
      });
    },
    onError: (error) => {
      console.error("Subscribe error:", error);
      toast({
        title: "Subscription failed",
        description: "Unable to subscribe to this podcast. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchMutation.mutate(searchQuery.trim());
    }
  };

  const handleSubscribe = (podcast: PodcastSearchResult) => {
    subscribeMutation.mutate(podcast.url);
  };

  const handleRssSubscribe = () => {
    const feedUrl = prompt("Enter RSS feed URL:");
    if (feedUrl) {
      subscribeMutation.mutate(feedUrl);
    }
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface-dark dark:bg-surface-dark bg-surface-light border-b border-gray-700 dark:border-gray-700 border-gray-300">
        <div className="flex items-center p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-200 transition-colors mr-3"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-medium text-primary-white dark:text-primary-white text-primary-dark">
            Search Podcasts
          </h1>
        </div>
      </header>

      {/* Search Form */}
      <div className="p-4 border-b border-gray-700 dark:border-gray-700 border-gray-300">
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-gray dark:text-secondary-gray text-secondary-dark" size={20} />
            <Input
              type="text"
              placeholder="Search for podcasts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-surface-dark dark:bg-surface-dark bg-surface-light border-gray-700 dark:border-gray-700 border-gray-300 text-primary-white dark:text-primary-white text-primary-dark placeholder:text-secondary-gray dark:placeholder:text-secondary-gray placeholder:text-secondary-dark"
            />
          </div>
          <Button
            type="submit"
            disabled={!searchQuery.trim() || isSearching}
            className="bg-primary-blue hover:bg-primary-dark-blue text-white"
          >
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </form>
        
        {/* RSS Feed Subscription */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleRssSubscribe}
          className="mt-3 w-full border-gray-700 dark:border-gray-700 border-gray-300 text-primary-white dark:text-primary-white text-primary-dark hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-200"
        >
          <Rss size={16} className="mr-2" />
          Subscribe via RSS URL
        </Button>
      </div>

      {/* Main Content */}
      <main className="p-4">
        {/* Loading State */}
        {isSearching && (
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
        )}

        {/* Search Results */}
        {!isSearching && searchResults.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-secondary-gray dark:text-secondary-gray text-secondary-dark">
              Found {searchResults.length} podcast{searchResults.length !== 1 ? 's' : ''}
            </p>
            {searchResults.map((podcast) => (
              <Card key={podcast.id} className="bg-surface-dark dark:bg-surface-dark bg-surface-light shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <img 
                      src={podcast.image || "/placeholder-podcast.jpg"} 
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
                        {podcast.categories?.slice(0, 2).map((category, index) => (
                          <span 
                            key={index}
                            className="text-xs bg-gray-700 dark:bg-gray-700 bg-gray-200 text-primary-white dark:text-primary-white text-primary-dark px-2 py-1 rounded"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSubscribe(podcast)}
                      disabled={subscribeMutation.isPending}
                      className="p-2 rounded-full bg-primary-blue hover:bg-primary-dark-blue text-white transition-colors"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State - No Search Yet */}
        {!hasSearched && !isSearching && (
          <Card className="bg-surface-dark dark:bg-surface-dark bg-surface-light">
            <CardContent className="p-8 text-center">
              <Search className="mx-auto mb-4 text-secondary-gray dark:text-secondary-gray text-secondary-dark" size={64} />
              <h2 className="text-lg font-medium text-primary-white dark:text-primary-white text-primary-dark mb-2">
                Discover New Podcasts
              </h2>
              <p className="text-secondary-gray dark:text-secondary-gray text-secondary-dark mb-6">
                Search for podcasts by name, author, or topic. You can also subscribe directly using an RSS feed URL.
              </p>
              <div className="space-y-2 text-sm text-secondary-gray dark:text-secondary-gray text-secondary-dark">
                <p>• Enter keywords to find podcasts</p>
                <p>• Browse by category or author</p>
                <p>• Subscribe with RSS feed URLs</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State - No Results */}
        {!isSearching && hasSearched && searchResults.length === 0 && (
          <Card className="bg-surface-dark dark:bg-surface-dark bg-surface-light">
            <CardContent className="p-8 text-center">
              <AlertCircle className="mx-auto mb-4 text-secondary-gray dark:text-secondary-gray text-secondary-dark" size={64} />
              <h2 className="text-lg font-medium text-primary-white dark:text-primary-white text-primary-dark mb-2">
                No Results Found
              </h2>
              <p className="text-secondary-gray dark:text-secondary-gray text-secondary-dark mb-6">
                We couldn't find any podcasts matching "{searchQuery}". Try different keywords or check your spelling.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                    setHasSearched(false);
                  }}
                  variant="outline"
                  className="border-gray-700 dark:border-gray-700 border-gray-300 text-primary-white dark:text-primary-white text-primary-dark hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-200"
                >
                  Clear Search
                </Button>
                <div className="text-sm text-secondary-gray dark:text-secondary-gray text-secondary-dark">
                  <p>Try searching for:</p>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center">
                    {["Technology", "Comedy", "News", "Education", "Business"].map(topic => (
                      <Button
                        key={topic}
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSearchQuery(topic);
                          searchMutation.mutate(topic);
                        }}
                        className="text-xs bg-gray-700 dark:bg-gray-700 bg-gray-200 text-primary-white dark:text-primary-white text-primary-dark px-2 py-1 rounded"
                      >
                        {topic}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
