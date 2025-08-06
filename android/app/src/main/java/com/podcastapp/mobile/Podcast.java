package com.podcastapp.mobile;

public class Podcast {
    private String id;
    private String title;
    private String description;
    private String imageUrl;
    private String feedUrl;
    private boolean isSubscribed;
    
    public Podcast(String id, String title, String description, String imageUrl) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.isSubscribed = false;
    }
    
    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public String getFeedUrl() { return feedUrl; }
    public void setFeedUrl(String feedUrl) { this.feedUrl = feedUrl; }
    
    public boolean isSubscribed() { return isSubscribed; }
    public void setSubscribed(boolean subscribed) { isSubscribed = subscribed; }
}