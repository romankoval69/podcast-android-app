import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPodcastSchema, insertEpisodeSchema, insertQueueItemSchema, insertUserSettingsSchema } from "@shared/schema";
import { z } from "zod";

// External API types
interface PodcastIndexSearchResult {
  id: number;
  title: string;
  description: string;
  image: string;
  url: string;
  author: string;
  language: string;
  categories: string[];
}

interface RSSFeedItem {
  title: string;
  description: string;
  enclosure: {
    url: string;
    length: number;
    type: string;
  };
  pubDate: Date;
  guid: string;
  duration?: number;
  image?: string;
  episodeNumber?: number;
  season?: number;
}

// Mock external API functions (replace with real implementations)
async function searchPodcasts(query: string): Promise<PodcastIndexSearchResult[]> {
  // This would integrate with Podcast Index API
  // For now, return empty array to avoid mock data
  return [];
}

async function parseFeedUrl(feedUrl: string): Promise<{ podcast: any; episodes: RSSFeedItem[] }> {
  // This would use RSS parser to fetch and parse feed
  // For now, return empty structure to avoid mock data
  return { podcast: null, episodes: [] };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Podcast routes
  app.get("/api/podcasts", async (req, res) => {
    try {
      const podcasts = await storage.getAllPodcasts();
      res.json(podcasts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch podcasts" });
    }
  });

  app.get("/api/podcasts/subscribed", async (req, res) => {
    try {
      const podcasts = await storage.getSubscribedPodcasts();
      res.json(podcasts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subscribed podcasts" });
    }
  });

  app.get("/api/podcasts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const podcast = await storage.getPodcast(id);
      if (!podcast) {
        return res.status(404).json({ message: "Podcast not found" });
      }
      res.json(podcast);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch podcast" });
    }
  });

  app.post("/api/podcasts", async (req, res) => {
    try {
      const podcastData = insertPodcastSchema.parse(req.body);
      const podcast = await storage.createPodcast(podcastData);
      res.status(201).json(podcast);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid podcast data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create podcast" });
    }
  });

  app.patch("/api/podcasts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const podcast = await storage.updatePodcast(id, updates);
      if (!podcast) {
        return res.status(404).json({ message: "Podcast not found" });
      }
      res.json(podcast);
    } catch (error) {
      res.status(500).json({ message: "Failed to update podcast" });
    }
  });

  app.delete("/api/podcasts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePodcast(id);
      if (!success) {
        return res.status(404).json({ message: "Podcast not found" });
      }
      res.json({ message: "Podcast deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete podcast" });
    }
  });

  // Episode routes
  app.get("/api/episodes", async (req, res) => {
    try {
      const episodes = await storage.getRecentEpisodes(20);
      res.json(episodes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch episodes" });
    }
  });

  app.get("/api/episodes/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const episodes = await storage.getRecentEpisodes(limit);
      res.json(episodes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent episodes" });
    }
  });

  app.get("/api/episodes/downloaded", async (req, res) => {
    try {
      const episodes = await storage.getDownloadedEpisodes();
      res.json(episodes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch downloaded episodes" });
    }
  });

  app.get("/api/podcasts/:podcastId/episodes", async (req, res) => {
    try {
      const podcastId = parseInt(req.params.podcastId);
      const episodes = await storage.getEpisodesByPodcast(podcastId);
      res.json(episodes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch podcast episodes" });
    }
  });

  app.get("/api/episodes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const episode = await storage.getEpisode(id);
      if (!episode) {
        return res.status(404).json({ message: "Episode not found" });
      }
      res.json(episode);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch episode" });
    }
  });

  app.post("/api/episodes", async (req, res) => {
    try {
      const episodeData = insertEpisodeSchema.parse(req.body);
      const episode = await storage.createEpisode(episodeData);
      res.status(201).json(episode);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid episode data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create episode" });
    }
  });

  app.patch("/api/episodes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const episode = await storage.updateEpisode(id, updates);
      if (!episode) {
        return res.status(404).json({ message: "Episode not found" });
      }
      res.json(episode);
    } catch (error) {
      res.status(500).json({ message: "Failed to update episode" });
    }
  });

  // Queue routes
  app.get("/api/queue", async (req, res) => {
    try {
      const queue = await storage.getQueue();
      res.json(queue);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch queue" });
    }
  });

  app.post("/api/queue", async (req, res) => {
    try {
      const queueItemData = insertQueueItemSchema.parse(req.body);
      const queueItem = await storage.addToQueue(queueItemData);
      res.status(201).json(queueItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid queue item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add to queue" });
    }
  });

  app.delete("/api/queue/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.removeFromQueue(id);
      if (!success) {
        return res.status(404).json({ message: "Queue item not found" });
      }
      res.json({ message: "Removed from queue successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove from queue" });
    }
  });

  app.patch("/api/queue/reorder", async (req, res) => {
    try {
      const items = req.body.items;
      const reorderedQueue = await storage.reorderQueue(items);
      res.json(reorderedQueue);
    } catch (error) {
      res.status(500).json({ message: "Failed to reorder queue" });
    }
  });

  app.delete("/api/queue", async (req, res) => {
    try {
      const success = await storage.clearQueue();
      res.json({ message: "Queue cleared successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear queue" });
    }
  });

  // Settings routes
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getUserSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.patch("/api/settings", async (req, res) => {
    try {
      const updates = req.body;
      const settings = await storage.updateUserSettings(updates);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // Search routes
  app.get("/api/search/podcasts", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const results = await searchPodcasts(query);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to search podcasts" });
    }
  });

  // RSS feed parsing route
  app.post("/api/feeds/parse", async (req, res) => {
    try {
      const { feedUrl } = req.body;
      if (!feedUrl) {
        return res.status(400).json({ message: "Feed URL is required" });
      }
      
      const { podcast, episodes } = await parseFeedUrl(feedUrl);
      res.json({ podcast, episodes });
    } catch (error) {
      res.status(500).json({ message: "Failed to parse RSS feed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
