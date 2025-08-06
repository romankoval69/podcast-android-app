package com.podcastapp.mobile;

public class Episode {
    private String id;
    private String title;
    private String podcastName;
    private String duration;
    private String audioUrl;
    private boolean isDownloaded;
    private boolean isPlayed;
    private int playbackPosition;
    
    public Episode(String id, String title, String podcastName, String duration, boolean isDownloaded) {
        this.id = id;
        this.title = title;
        this.podcastName = podcastName;
        this.duration = duration;
        this.isDownloaded = isDownloaded;
        this.isPlayed = false;
        this.playbackPosition = 0;
    }
    
    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getPodcastName() { return podcastName; }
    public void setPodcastName(String podcastName) { this.podcastName = podcastName; }
    
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    
    public String getAudioUrl() { return audioUrl; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }
    
    public boolean isDownloaded() { return isDownloaded; }
    public void setDownloaded(boolean downloaded) { isDownloaded = downloaded; }
    
    public boolean isPlayed() { return isPlayed; }
    public void setPlayed(boolean played) { isPlayed = played; }
    
    public int getPlaybackPosition() { return playbackPosition; }
    public void setPlaybackPosition(int playbackPosition) { this.playbackPosition = playbackPosition; }
}