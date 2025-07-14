import { Episode } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Download, MoreVertical } from "lucide-react";
import { formatDuration, formatTimeAgo } from "@/lib/audio-utils";
import { useAudioPlayer } from "@/hooks/use-audio-player";

interface EpisodeCardProps {
  episode: Episode;
  podcast?: { title: string; imageUrl?: string };
  showPodcastInfo?: boolean;
}

export default function EpisodeCard({ episode, podcast, showPodcastInfo = false }: EpisodeCardProps) {
  const { loadEpisode, play } = useAudioPlayer();

  const handlePlay = () => {
    loadEpisode(episode);
    play();
  };

  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log("Download episode:", episode.id);
  };

  return (
    <Card className="bg-surface-dark dark:bg-surface-dark bg-surface-light shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <img 
            src={episode.imageUrl || podcast?.imageUrl || "/placeholder-podcast.jpg"} 
            alt={episode.title}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            {showPodcastInfo && podcast && (
              <p className="text-xs text-secondary-gray dark:text-secondary-gray text-secondary-dark mb-1">
                {podcast.title}
              </p>
            )}
            <h3 className="font-medium text-sm text-primary-white dark:text-primary-white text-primary-dark line-clamp-2">
              {episode.title}
            </h3>
            <p className="text-xs text-secondary-gray dark:text-secondary-gray text-secondary-dark mt-1 line-clamp-2">
              {episode.description}
            </p>
            <div className="flex items-center space-x-4 mt-2 text-xs text-secondary-gray dark:text-secondary-gray text-secondary-dark">
              {episode.duration && (
                <span>{formatDuration(episode.duration)}</span>
              )}
              {episode.pubDate && (
                <span>{formatTimeAgo(episode.pubDate)}</span>
              )}
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePlay}
              className="p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-200 transition-colors"
            >
              <Play size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-200 transition-colors"
            >
              <Download size={16} />
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
        
        {/* Progress bar if episode is partially played */}
        {episode.playbackPosition && episode.playbackPosition > 0 && episode.duration && (
          <div className="mt-3">
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-700 dark:bg-gray-700 bg-gray-300 rounded-full h-1">
                <div 
                  className="bg-primary-blue h-1 rounded-full" 
                  style={{ width: `${(episode.playbackPosition / episode.duration) * 100}%` }}
                />
              </div>
              <span className="text-xs text-secondary-gray dark:text-secondary-gray text-secondary-dark">
                {formatDuration(episode.playbackPosition)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
