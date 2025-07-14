import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const podcasts = pgTable("podcasts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  feedUrl: text("feed_url").notNull().unique(),
  website: text("website"),
  author: text("author"),
  language: text("language"),
  categories: text("categories").array().default([]),
  subscribed: boolean("subscribed").default(false),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const episodes = pgTable("episodes", {
  id: serial("id").primaryKey(),
  podcastId: integer("podcast_id").references(() => podcasts.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  audioUrl: text("audio_url").notNull(),
  imageUrl: text("image_url"),
  duration: integer("duration"), // in seconds
  fileSize: integer("file_size"), // in bytes
  episodeNumber: integer("episode_number"),
  season: integer("season"),
  pubDate: timestamp("pub_date"),
  guid: text("guid").unique(),
  downloaded: boolean("downloaded").default(false),
  downloadPath: text("download_path"),
  playbackPosition: integer("playback_position").default(0), // in seconds
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const playbackQueue = pgTable("playback_queue", {
  id: serial("id").primaryKey(),
  episodeId: integer("episode_id").references(() => episodes.id).notNull(),
  position: integer("position").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  theme: text("theme").default("dark"),
  playbackSpeed: text("playback_speed").default("1.0"),
  skipForwardSeconds: integer("skip_forward_seconds").default(30),
  skipBackwardSeconds: integer("skip_backward_seconds").default(30),
  autoDownload: boolean("auto_download").default(false),
  downloadQuality: text("download_quality").default("high"),
  sleepTimerMinutes: integer("sleep_timer_minutes").default(30),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPodcastSchema = createInsertSchema(podcasts).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

export const insertEpisodeSchema = createInsertSchema(episodes).omit({
  id: true,
  createdAt: true,
});

export const insertQueueItemSchema = createInsertSchema(playbackQueue).omit({
  id: true,
  createdAt: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Podcast = typeof podcasts.$inferSelect;
export type Episode = typeof episodes.$inferSelect;
export type QueueItem = typeof playbackQueue.$inferSelect;
export type UserSettings = typeof userSettings.$inferSelect;
export type InsertPodcast = z.infer<typeof insertPodcastSchema>;
export type InsertEpisode = z.infer<typeof insertEpisodeSchema>;
export type InsertQueueItem = z.infer<typeof insertQueueItemSchema>;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
