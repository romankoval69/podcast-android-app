import React, {useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Appbar,
  Card,
  Text,
  Searchbar,
  FAB,
  Button,
  useTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Podcast {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  feedUrl: string;
  subscribed: boolean;
}

const PodcastsScreen: React.FC = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [podcasts, setPodcasts] = useState<Podcast[]>([
    {
      id: '1',
      title: 'Tech Talk Daily',
      description: 'Daily discussions about the latest in technology',
      imageUrl: 'https://via.placeholder.com/150',
      feedUrl: 'https://example.com/tech-talk.rss',
      subscribed: true,
    },
    {
      id: '2',
      title: 'Science Stories',
      description: 'Fascinating stories from the world of science',
      imageUrl: 'https://via.placeholder.com/150',
      feedUrl: 'https://example.com/science-stories.rss',
      subscribed: false,
    },
  ]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement actual search functionality
  };

  const toggleSubscription = (podcastId: string) => {
    setPodcasts(prev =>
      prev.map(podcast =>
        podcast.id === podcastId
          ? {...podcast, subscribed: !podcast.subscribed}
          : podcast,
      ),
    );
  };

  const renderPodcast = ({item}: {item: Podcast}) => (
    <Card style={styles.podcastCard}>
      <Card.Content>
        <View style={styles.podcastContent}>
          <View style={styles.podcastIcon}>
            <Icon name="podcasts" size={48} color={theme.colors.primary} />
          </View>
          <View style={styles.podcastInfo}>
            <Text variant="titleMedium" style={styles.podcastTitle}>
              {item.title}
            </Text>
            <Text variant="bodyMedium" numberOfLines={2}>
              {item.description}
            </Text>
          </View>
        </View>
      </Card.Content>
      <Card.Actions>
        <Button
          mode={item.subscribed ? 'contained' : 'outlined'}
          onPress={() => toggleSubscription(item.id)}
          icon={item.subscribed ? 'check' : 'plus'}>
          {item.subscribed ? 'Subscribed' : 'Subscribe'}
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Podcasts" />
        <Appbar.Action icon="magnify" onPress={() => {}} />
      </Appbar.Header>

      <View style={styles.content}>
        <Searchbar
          placeholder="Search podcasts"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchbar}
        />

        <FlatList
          data={podcasts.filter(podcast =>
            podcast.title.toLowerCase().includes(searchQuery.toLowerCase()),
          )}
          renderItem={renderPodcast}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => Alert.alert('Add Podcast', 'Feature coming soon!')}
      />
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
  searchbar: {
    marginBottom: 16,
  },
  list: {
    paddingBottom: 80,
  },
  podcastCard: {
    marginBottom: 12,
  },
  podcastContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  podcastIcon: {
    marginRight: 16,
  },
  podcastInfo: {
    flex: 1,
  },
  podcastTitle: {
    marginBottom: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default PodcastsScreen;