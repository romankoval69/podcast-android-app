import { apiRequest } from "./queryClient";

export interface PodcastSearchResult {
  id: number;
  title: string;
  description: string;
  image: string;
  url: string;
  author: string;
  language: string;
  categories: string[];
}

export interface RSSFeedParseResult {
  podcast: {
    title: string;
    description: string;
    image: string;
    website: string;
    author: string;
    language: string;
    categories: string[];
  };
  episodes: {
    title: string;
    description: string;
    audioUrl: string;
    imageUrl?: string;
    duration?: number;
    fileSize?: number;
    pubDate: string;
    guid: string;
    episodeNumber?: number;
    season?: number;
  }[];
}

export async function searchPodcasts(query: string): Promise<PodcastSearchResult[]> {
  const response = await apiRequest("GET", `/api/search/podcasts?q=${encodeURIComponent(query)}`);
  return response.json();
}

export async function parseFeedUrl(feedUrl: string): Promise<RSSFeedParseResult> {
  const response = await apiRequest("POST", "/api/feeds/parse", { feedUrl });
  return response.json();
}

export async function subscribeToPodcast(feedUrl: string): Promise<void> {
  const { podcast, episodes } = await parseFeedUrl(feedUrl);
  
  // Create the podcast
  const podcastResponse = await apiRequest("POST", "/api/podcasts", {
    title: podcast.title,
    description: podcast.description,
    imageUrl: podcast.image,
    feedUrl,
    website: podcast.website,
    author: podcast.author,
    language: podcast.language,
    categories: podcast.categories,
    subscribed: true,
  });
  
  const createdPodcast = await podcastResponse.json();
  
  // Create episodes
  for (const episode of episodes) {
    await apiRequest("POST", "/api/episodes", {
      podcastId: createdPodcast.id,
      title: episode.title,
      description: episode.description,
      audioUrl: episode.audioUrl,
      imageUrl: episode.imageUrl,
      duration: episode.duration,
      fileSize: episode.fileSize,
      pubDate: new Date(episode.pubDate),
      guid: episode.guid,
      episodeNumber: episode.episodeNumber,
      season: episode.season,
    });
  }
}
