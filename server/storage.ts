import { podcasts, episodes, playbackQueue, userSettings, type Podcast, type Episode, type QueueItem, type UserSettings, type InsertPodcast, type InsertEpisode, type InsertQueueItem, type InsertUserSettings } from "@shared/schema";

export interface IStorage {
  // Podcasts
  getPodcast(id: number): Promise<Podcast | undefined>;
  getPodcastByFeedUrl(feedUrl: string): Promise<Podcast | undefined>;
  getAllPodcasts(): Promise<Podcast[]>;
  getSubscribedPodcasts(): Promise<Podcast[]>;
  createPodcast(podcast: InsertPodcast): Promise<Podcast>;
  updatePodcast(id: number, updates: Partial<InsertPodcast>): Promise<Podcast | undefined>;
  deletePodcast(id: number): Promise<boolean>;
  
  // Episodes
  getEpisode(id: number): Promise<Episode | undefined>;
  getEpisodesByPodcast(podcastId: number): Promise<Episode[]>;
  getRecentEpisodes(limit?: number): Promise<Episode[]>;
  getDownloadedEpisodes(): Promise<Episode[]>;
  createEpisode(episode: InsertEpisode): Promise<Episode>;
  updateEpisode(id: number, updates: Partial<InsertEpisode>): Promise<Episode | undefined>;
  deleteEpisode(id: number): Promise<boolean>;
  
  // Queue
  getQueue(): Promise<QueueItem[]>;
  addToQueue(item: InsertQueueItem): Promise<QueueItem>;
  removeFromQueue(id: number): Promise<boolean>;
  reorderQueue(items: { id: number; position: number }[]): Promise<QueueItem[]>;
  clearQueue(): Promise<boolean>;
  
  // Settings
  getUserSettings(): Promise<UserSettings | undefined>;
  updateUserSettings(settings: Partial<InsertUserSettings>): Promise<UserSettings>;
}

export class MemStorage implements IStorage {
  private podcasts: Map<number, Podcast> = new Map();
  private episodes: Map<number, Episode> = new Map();
  private queue: Map<number, QueueItem> = new Map();
  private settings: UserSettings | undefined;
  
  private podcastIdCounter = 1;
  private episodeIdCounter = 1;
  private queueIdCounter = 1;

  constructor() {
    // Initialize default settings
    this.settings = {
      id: 1,
      theme: "dark",
      playbackSpeed: "1.0",
      skipForwardSeconds: 30,
      skipBackwardSeconds: 30,
      autoDownload: false,
      downloadQuality: "high",
      sleepTimerMinutes: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  // Podcasts
  async getPodcast(id: number): Promise<Podcast | undefined> {
    return this.podcasts.get(id);
  }

  async getPodcastByFeedUrl(feedUrl: string): Promise<Podcast | undefined> {
    return Array.from(this.podcasts.values()).find(p => p.feedUrl === feedUrl);
  }

  async getAllPodcasts(): Promise<Podcast[]> {
    return Array.from(this.podcasts.values());
  }

  async getSubscribedPodcasts(): Promise<Podcast[]> {
    return Array.from(this.podcasts.values()).filter(p => p.subscribed);
  }

  async createPodcast(insertPodcast: InsertPodcast): Promise<Podcast> {
    const id = this.podcastIdCounter++;
    const podcast: Podcast = {
      ...insertPodcast,
      id,
      createdAt: new Date(),
      lastUpdated: new Date(),
    };
    this.podcasts.set(id, podcast);
    return podcast;
  }

  async updatePodcast(id: number, updates: Partial<InsertPodcast>): Promise<Podcast | undefined> {
    const podcast = this.podcasts.get(id);
    if (!podcast) return undefined;
    
    const updatedPodcast = { ...podcast, ...updates, lastUpdated: new Date() };
    this.podcasts.set(id, updatedPodcast);
    return updatedPodcast;
  }

  async deletePodcast(id: number): Promise<boolean> {
    return this.podcasts.delete(id);
  }

  // Episodes
  async getEpisode(id: number): Promise<Episode | undefined> {
    return this.episodes.get(id);
  }

  async getEpisodesByPodcast(podcastId: number): Promise<Episode[]> {
    return Array.from(this.episodes.values()).filter(e => e.podcastId === podcastId);
  }

  async getRecentEpisodes(limit = 20): Promise<Episode[]> {
    return Array.from(this.episodes.values())
      .sort((a, b) => (b.pubDate?.getTime() || 0) - (a.pubDate?.getTime() || 0))
      .slice(0, limit);
  }

  async getDownloadedEpisodes(): Promise<Episode[]> {
    return Array.from(this.episodes.values()).filter(e => e.downloaded);
  }

  async createEpisode(insertEpisode: InsertEpisode): Promise<Episode> {
    const id = this.episodeIdCounter++;
    const episode: Episode = {
      ...insertEpisode,
      id,
      createdAt: new Date(),
    };
    this.episodes.set(id, episode);
    return episode;
  }

  async updateEpisode(id: number, updates: Partial<InsertEpisode>): Promise<Episode | undefined> {
    const episode = this.episodes.get(id);
    if (!episode) return undefined;
    
    const updatedEpisode = { ...episode, ...updates };
    this.episodes.set(id, updatedEpisode);
    return updatedEpisode;
  }

  async deleteEpisode(id: number): Promise<boolean> {
    return this.episodes.delete(id);
  }

  // Queue
  async getQueue(): Promise<QueueItem[]> {
    return Array.from(this.queue.values()).sort((a, b) => a.position - b.position);
  }

  async addToQueue(item: InsertQueueItem): Promise<QueueItem> {
    const id = this.queueIdCounter++;
    const queueItem: QueueItem = {
      ...item,
      id,
      createdAt: new Date(),
    };
    this.queue.set(id, queueItem);
    return queueItem;
  }

  async removeFromQueue(id: number): Promise<boolean> {
    return this.queue.delete(id);
  }

  async reorderQueue(items: { id: number; position: number }[]): Promise<QueueItem[]> {
    items.forEach(({ id, position }) => {
      const item = this.queue.get(id);
      if (item) {
        this.queue.set(id, { ...item, position });
      }
    });
    return this.getQueue();
  }

  async clearQueue(): Promise<boolean> {
    this.queue.clear();
    return true;
  }

  // Settings
  async getUserSettings(): Promise<UserSettings | undefined> {
    return this.settings;
  }

  async updateUserSettings(updates: Partial<InsertUserSettings>): Promise<UserSettings> {
    if (!this.settings) {
      this.settings = {
        id: 1,
        theme: "dark",
        playbackSpeed: "1.0",
        skipForwardSeconds: 30,
        skipBackwardSeconds: 30,
        autoDownload: false,
        downloadQuality: "high",
        sleepTimerMinutes: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    
    this.settings = { ...this.settings, ...updates, updatedAt: new Date() };
    return this.settings;
  }
}

export const storage = new MemStorage();
