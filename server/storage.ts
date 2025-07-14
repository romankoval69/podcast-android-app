import { podcasts, episodes, playbackQueue, userSettings, type Podcast, type Episode, type QueueItem, type UserSettings, type InsertPodcast, type InsertEpisode, type InsertQueueItem, type InsertUserSettings } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

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
      description: insertPodcast.description ?? null,
      imageUrl: insertPodcast.imageUrl ?? null,
      website: insertPodcast.website ?? null,
      author: insertPodcast.author ?? null,
      language: insertPodcast.language ?? null,
      categories: insertPodcast.categories ?? null,
      subscribed: insertPodcast.subscribed ?? null,
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
      description: insertEpisode.description ?? null,
      imageUrl: insertEpisode.imageUrl ?? null,
      duration: insertEpisode.duration ?? null,
      fileSize: insertEpisode.fileSize ?? null,
      episodeNumber: insertEpisode.episodeNumber ?? null,
      season: insertEpisode.season ?? null,
      pubDate: insertEpisode.pubDate ?? null,
      guid: insertEpisode.guid ?? null,
      downloaded: insertEpisode.downloaded ?? null,
      downloadPath: insertEpisode.downloadPath ?? null,
      playbackPosition: insertEpisode.playbackPosition ?? null,
      completed: insertEpisode.completed ?? null,
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

export class DatabaseStorage implements IStorage {
  // Podcasts
  async getPodcast(id: number): Promise<Podcast | undefined> {
    const result = await db.select().from(podcasts).where(eq(podcasts.id, id));
    return result[0] || undefined;
  }

  async getPodcastByFeedUrl(feedUrl: string): Promise<Podcast | undefined> {
    const result = await db.select().from(podcasts).where(eq(podcasts.feedUrl, feedUrl));
    return result[0] || undefined;
  }

  async getAllPodcasts(): Promise<Podcast[]> {
    return await db.select().from(podcasts);
  }

  async getSubscribedPodcasts(): Promise<Podcast[]> {
    return await db.select().from(podcasts).where(eq(podcasts.subscribed, true));
  }

  async createPodcast(insertPodcast: InsertPodcast): Promise<Podcast> {
    const result = await db.insert(podcasts).values(insertPodcast).returning();
    return result[0];
  }

  async updatePodcast(id: number, updates: Partial<InsertPodcast>): Promise<Podcast | undefined> {
    const result = await db.update(podcasts)
      .set({ ...updates, lastUpdated: new Date() })
      .where(eq(podcasts.id, id))
      .returning();
    return result[0] || undefined;
  }

  async deletePodcast(id: number): Promise<boolean> {
    const result = await db.delete(podcasts).where(eq(podcasts.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Episodes
  async getEpisode(id: number): Promise<Episode | undefined> {
    const result = await db.select().from(episodes).where(eq(episodes.id, id));
    return result[0] || undefined;
  }

  async getEpisodesByPodcast(podcastId: number): Promise<Episode[]> {
    return await db.select().from(episodes)
      .where(eq(episodes.podcastId, podcastId))
      .orderBy(desc(episodes.pubDate));
  }

  async getRecentEpisodes(limit = 20): Promise<Episode[]> {
    return await db.select().from(episodes)
      .orderBy(desc(episodes.pubDate))
      .limit(limit);
  }

  async getDownloadedEpisodes(): Promise<Episode[]> {
    return await db.select().from(episodes).where(eq(episodes.downloaded, true));
  }

  async createEpisode(insertEpisode: InsertEpisode): Promise<Episode> {
    const result = await db.insert(episodes).values(insertEpisode).returning();
    return result[0];
  }

  async updateEpisode(id: number, updates: Partial<InsertEpisode>): Promise<Episode | undefined> {
    const result = await db.update(episodes)
      .set(updates)
      .where(eq(episodes.id, id))
      .returning();
    return result[0] || undefined;
  }

  async deleteEpisode(id: number): Promise<boolean> {
    const result = await db.delete(episodes).where(eq(episodes.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Queue
  async getQueue(): Promise<QueueItem[]> {
    return await db.select().from(playbackQueue).orderBy(playbackQueue.position);
  }

  async addToQueue(item: InsertQueueItem): Promise<QueueItem> {
    const result = await db.insert(playbackQueue).values(item).returning();
    return result[0];
  }

  async removeFromQueue(id: number): Promise<boolean> {
    const result = await db.delete(playbackQueue).where(eq(playbackQueue.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async reorderQueue(items: { id: number; position: number }[]): Promise<QueueItem[]> {
    // Update positions for all items
    for (const item of items) {
      await db.update(playbackQueue)
        .set({ position: item.position })
        .where(eq(playbackQueue.id, item.id));
    }
    
    // Return the updated queue
    return await this.getQueue();
  }

  async clearQueue(): Promise<boolean> {
    const result = await db.delete(playbackQueue);
    return (result.rowCount ?? 0) >= 0;
  }

  // Settings
  async getUserSettings(): Promise<UserSettings | undefined> {
    const result = await db.select().from(userSettings).limit(1);
    return result[0] || undefined;
  }

  async updateUserSettings(updates: Partial<InsertUserSettings>): Promise<UserSettings> {
    // First check if settings exist
    const existing = await this.getUserSettings();
    
    if (existing) {
      // Update existing settings
      const result = await db.update(userSettings)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(userSettings.id, existing.id))
        .returning();
      return result[0];
    } else {
      // Create new settings
      const result = await db.insert(userSettings).values(updates).returning();
      return result[0];
    }
  }
}

export const storage = new DatabaseStorage();
