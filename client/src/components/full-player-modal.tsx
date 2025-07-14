import { useAudioPlayer } from "@/hooks/use-audio-player";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  RotateCw,
  ChevronDown,
  MoreVertical,
  Clock,
  Volume2
} from "lucide-react";
import { formatPlaybackSpeed, generatePlaybackSpeeds } from "@/lib/audio-utils";

export default function FullPlayerModal() {
  const {
    currentEpisode,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    volume,
    sleepTimer,
    isFullPlayerOpen,
    togglePlayPause,
    skipForward,
    skipBackward,
    seek,
    setPlaybackRate,
    setVolume,
    setSleepTimer,
    clearSleepTimer,
    toggleFullPlayer,
    formatTime,
  } = useAudioPlayer();

  if (!currentEpisode) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const playbackSpeeds = generatePlaybackSpeeds();

  return (
    <Dialog open={isFullPlayerOpen} onOpenChange={toggleFullPlayer}>
      <DialogContent className="max-w-md w-full h-full bg-app-dark dark:bg-app-dark bg-app-light p-0 border-0">
        <div className="h-full flex flex-col">
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b border-gray-700 dark:border-gray-700 border-gray-300">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullPlayer}
              className="p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-200 transition-colors"
            >
              <ChevronDown size={20} />
            </Button>
            <h2 className="text-lg font-medium text-primary-white dark:text-primary-white text-primary-dark">
              Now Playing
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-200 transition-colors"
            >
              <MoreVertical size={20} />
            </Button>
          </header>
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center px-8 py-8">
            <img 
              src={currentEpisode.imageUrl || "/placeholder-podcast.jpg"} 
              alt={currentEpisode.title}
              className="w-64 h-64 rounded-2xl mx-auto mb-8 object-cover shadow-2xl"
            />
            
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold mb-2 text-primary-white dark:text-primary-white text-primary-dark">
                {currentEpisode.title}
              </h3>
              <p className="text-lg text-secondary-gray dark:text-secondary-gray text-secondary-dark">
                Episode {currentEpisode.episodeNumber || ""}
              </p>
            </div>
            
            {/* Controls */}
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-8">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => skipBackward(15)}
                  className="p-3 rounded-full hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <RotateCcw size={24} />
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => skipBackward()}
                  className="p-3 rounded-full hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <SkipBack size={24} />
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={togglePlayPause}
                  className="p-6 rounded-full bg-primary-blue hover:bg-primary-dark-blue transition-colors"
                >
                  {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => skipForward()}
                  className="p-3 rounded-full hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <SkipForward size={24} />
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => skipForward(15)}
                  className="p-3 rounded-full hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <RotateCw size={24} />
                </Button>
              </div>
              
              {/* Progress and Time */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-secondary-gray dark:text-secondary-gray text-secondary-dark">
                  <span>{formatTime(currentTime)}</span>
                  <div className="flex items-center space-x-2">
                    <select
                      value={playbackRate}
                      onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                      className="text-xs bg-gray-700 dark:bg-gray-700 bg-gray-200 text-primary-white dark:text-primary-white text-primary-dark px-2 py-1 rounded"
                    >
                      {playbackSpeeds.map(speed => (
                        <option key={speed} value={speed}>
                          {formatPlaybackSpeed(speed)}
                        </option>
                      ))}
                    </select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSleepTimer(30)}
                      className="p-1 rounded hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-200"
                    >
                      <Clock size={14} />
                    </Button>
                  </div>
                  <span>{formatTime(duration)}</span>
                </div>
                <Slider
                  value={[progress]}
                  onValueChange={(value) => {
                    const newTime = (value[0] / 100) * duration;
                    seek(newTime);
                  }}
                  className="w-full"
                  max={100}
                />
              </div>

              {/* Volume Control */}
              <div className="flex items-center space-x-4">
                <Volume2 size={16} className="text-secondary-gray dark:text-secondary-gray text-secondary-dark" />
                <Slider
                  value={[volume * 100]}
                  onValueChange={(value) => setVolume(value[0] / 100)}
                  className="flex-1"
                  max={100}
                />
              </div>

              {/* Sleep Timer */}
              {sleepTimer && (
                <div className="text-center p-2 bg-gray-700 dark:bg-gray-700 bg-gray-200 rounded-lg">
                  <p className="text-sm text-secondary-gray dark:text-secondary-gray text-secondary-dark">
                    Sleep timer: {sleepTimer} minutes
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSleepTimer}
                    className="mt-1 text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
