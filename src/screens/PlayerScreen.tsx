import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
} from 'react-native';
import {
  Appbar,
  Card,
  Text,
  IconButton,
  ProgressBar,
  useTheme,
} from 'react-native-paper';
// Note: react-native-track-player requires additional setup
// For now, we'll mock these imports
const State = {
  Playing: 'playing',
  Paused: 'paused',
};

const Capability = {
  Play: 'play',
  Pause: 'pause',
  SkipToNext: 'next',
  SkipToPrevious: 'prev',
  Stop: 'stop',
};

interface Episode {
  id: string;
  title: string;
  podcast: string;
  duration: number;
  imageUrl: string;
  audioUrl: string;
}

const PlayerScreen: React.FC = () => {
  const theme = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState({ position: 0, duration: 0 });
  
  const [currentEpisode, setCurrentEpisode] = useState<Episode>({
    id: '1',
    title: 'Understanding React Native Navigation',
    podcast: 'Tech Talk Daily',
    duration: 1800, // 30 minutes
    imageUrl: 'https://via.placeholder.com/300',
    audioUrl: 'https://example.com/audio/episode1.mp3',
  });

  useEffect(() => {
    setupPlayer();
  }, []);

  const setupPlayer = async () => {
    // Setup for react-native-track-player would go here
    console.log('Player setup');
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkipForward = () => {
    setProgress(prev => ({
      ...prev,
      position: Math.min(prev.position + 30, currentEpisode.duration)
    }));
  };

  const handleSkipBackward = () => {
    setProgress(prev => ({
      ...prev,
      position: Math.max(prev.position - 15, 0)
    }));
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = currentEpisode.duration > 0 ? progress.position / currentEpisode.duration : 0;

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Now Playing" />
        <Appbar.Action icon="more-vert" onPress={() => {}} />
      </Appbar.Header>

      <View style={styles.content}>
        <Card style={styles.playerCard}>
          <View style={styles.artwork}>
            <View style={styles.artworkImage}>
              <Icon name="podcasts" size={120} color={theme.colors.primary} />
            </View>
          </View>

          <Card.Content style={styles.episodeInfo}>
            <Text variant="headlineSmall" style={styles.episodeTitle}>
              {currentEpisode.title}
            </Text>
            <Text variant="bodyLarge" style={styles.podcastName}>
              {currentEpisode.podcast}
            </Text>
          </Card.Content>

          <View style={styles.progressContainer}>
            <ProgressBar 
              progress={progressPercent} 
              color={theme.colors.primary}
              style={styles.progressBar}
            />
            <View style={styles.timeContainer}>
              <Text variant="bodySmall">
                {formatTime(progress.position)}
              </Text>
              <Text variant="bodySmall">
                {formatTime(currentEpisode.duration)}
              </Text>
            </View>
          </View>

          <View style={styles.controls}>
            <IconButton
              icon="replay-15"
              size={32}
              onPress={handleSkipBackward}
            />
            <IconButton
              icon={isPlaying ? 'pause' : 'play'}
              size={56}
              mode="contained"
              onPress={handlePlayPause}
            />
            <IconButton
              icon="forward-30"
              size={32}
              onPress={handleSkipForward}
            />
          </View>

          <View style={styles.secondaryControls}>
            <IconButton icon="shuffle" size={24} />
            <IconButton icon="repeat" size={24} />
            <IconButton icon="bookmark-outline" size={24} />
            <IconButton icon="share" size={24} />
          </View>
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  playerCard: {
    padding: 24,
  },
  artwork: {
    alignItems: 'center',
    marginBottom: 24,
  },
  artworkImage: {
    width: 250,
    height: 250,
    borderRadius: 12,
  },
  episodeInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  episodeTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  podcastName: {
    textAlign: 'center',
    opacity: 0.7,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 4,
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  secondaryControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default PlayerScreen;