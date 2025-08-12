import React, {useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  Appbar,
  Card,
  Text,
  IconButton,
  useTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface QueueEpisode {
  id: string;
  title: string;
  podcast: string;
  duration: number;
  imageUrl: string;
  isPlaying: boolean;
}

const QueueScreen: React.FC = () => {
  const theme = useTheme();
  const [queue, setQueue] = useState<QueueEpisode[]>([
    {
      id: '1',
      title: 'Understanding React Native Navigation',
      podcast: 'Tech Talk Daily',
      duration: 1800,
      imageUrl: 'https://via.placeholder.com/60',
      isPlaying: true,
    },
    {
      id: '2',
      title: 'State Management Best Practices',
      podcast: 'Tech Talk Daily',
      duration: 2100,
      imageUrl: 'https://via.placeholder.com/60',
      isPlaying: false,
    },
    {
      id: '3',
      title: 'The Future of Mobile Development',
      podcast: 'Tech Talk Daily',
      duration: 1950,
      imageUrl: 'https://via.placeholder.com/60',
      isPlaying: false,
    },
  ]);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const removeFromQueue = (episodeId: string) => {
    setQueue(prev => prev.filter(episode => episode.id !== episodeId));
  };

  const moveEpisode = (episodeId: string, direction: 'up' | 'down') => {
    setQueue(prev => {
      const currentIndex = prev.findIndex(ep => ep.id === episodeId);
      if (currentIndex === -1) return prev;

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;

      const newQueue = [...prev];
      [newQueue[currentIndex], newQueue[newIndex]] = [newQueue[newIndex], newQueue[currentIndex]];
      return newQueue;
    });
  };

  const renderEpisode = ({item, index}: {item: QueueEpisode; index: number}) => (
    <Card style={[styles.episodeCard, item.isPlaying && styles.playingCard]}>
      <Card.Content>
        <View style={styles.episodeContent}>
          <View style={styles.episodeIcon}>
            {item.isPlaying ? (
              <Icon name="equalizer" size={40} color={theme.colors.primary} />
            ) : (
              <Icon name="podcasts" size={40} color={theme.colors.onSurfaceVariant} />
            )}
          </View>
          
          <View style={styles.episodeInfo}>
            <Text 
              variant="titleMedium" 
              style={[styles.episodeTitle, item.isPlaying && {color: theme.colors.primary}]}
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <Text variant="bodyMedium" style={styles.podcastName}>
              {item.podcast} • {formatDuration(item.duration)}
            </Text>
          </View>

          <View style={styles.episodeActions}>
            <IconButton
              icon="arrow-up"
              size={20}
              disabled={index === 0}
              onPress={() => moveEpisode(item.id, 'up')}
            />
            <IconButton
              icon="arrow-down"
              size={20}
              disabled={index === queue.length - 1}
              onPress={() => moveEpisode(item.id, 'down')}
            />
            <IconButton
              icon="close"
              size={20}
              onPress={() => removeFromQueue(item.id)}
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Queue" />
        <Appbar.Action icon="shuffle" onPress={() => {}} />
        <Appbar.Action icon="delete-sweep" onPress={() => setQueue([])} />
      </Appbar.Header>

      <View style={styles.content}>
        {queue.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="queue-music" size={64} color={theme.colors.onSurfaceVariant} />
            <Text variant="headlineSmall" style={styles.emptyTitle}>
              Queue is empty
            </Text>
            <Text variant="bodyMedium" style={styles.emptyMessage}>
              Add episodes to your queue to see them here
            </Text>
          </View>
        ) : (
          <FlatList
            data={queue}
            renderItem={renderEpisode}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
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
  },
  list: {
    paddingBottom: 16,
  },
  episodeCard: {
    marginBottom: 8,
  },
  playingCard: {
    borderWidth: 1,
    borderColor: '#6200EE',
  },
  episodeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  episodeIcon: {
    marginRight: 16,
  },
  episodeInfo: {
    flex: 1,
    marginRight: 8,
  },
  episodeTitle: {
    marginBottom: 4,
  },
  podcastName: {
    opacity: 0.7,
  },
  episodeActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default QueueScreen;