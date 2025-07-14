import { useAudioPlayer } from "@/hooks/use-audio-player";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

export default function AudioPlayer() {
  const {
    currentEpisode,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    skipForward,
    skipBackward,
    seek,
    formatTime,
    toggleFullPlayer,
  } = useAudioPlayer();

  if (!currentEpisode) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto bg-surface-dark dark:bg-surface-dark bg-surface-light border-t border-gray-700 dark:border-gray-700 border-gray-300 px-4 py-3">
      <div className="flex items-center space-x-3" onClick={toggleFullPlayer}>
        <img 
          src={currentEpisode.imageUrl || "/placeholder-podcast.jpg"} 
          alt={currentEpisode.title}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-primary-white dark:text-primary-white text-primary-dark truncate">
            {currentEpisode.title}
          </p>
          <p className="text-xs text-secondary-gray dark:text-secondary-gray text-secondary-dark truncate">
            Episode {currentEpisode.episodeNumber || ""}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              skipBackward();
            }}
            className="p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-200 transition-colors"
          >
            <SkipBack size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            className="p-3 rounded-full bg-primary-blue hover:bg-primary-dark-blue transition-colors"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              skipForward();
            }}
            className="p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-200 transition-colors"
          >
            <SkipForward size={16} />
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-2 mt-2">
        <span className="text-xs text-secondary-gray dark:text-secondary-gray text-secondary-dark">
          {formatTime(currentTime)}
        </span>
        <Slider
          value={[progress]}
          onValueChange={(value) => {
            const newTime = (value[0] / 100) * duration;
            seek(newTime);
          }}
          className="flex-1"
          max={100}
        />
        <span className="text-xs text-secondary-gray dark:text-secondary-gray text-secondary-dark">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}
