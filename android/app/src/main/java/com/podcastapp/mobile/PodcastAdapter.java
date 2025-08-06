package com.podcastapp.mobile;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.bumptech.glide.Glide;
import java.util.List;

public class PodcastAdapter extends RecyclerView.Adapter<PodcastAdapter.PodcastViewHolder> {
    
    private List<Podcast> podcasts;
    private OnPodcastClickListener listener;
    
    public interface OnPodcastClickListener {
        void onPodcastClick(Podcast podcast);
    }
    
    public PodcastAdapter(List<Podcast> podcasts) {
        this.podcasts = podcasts;
    }
    
    public void setOnPodcastClickListener(OnPodcastClickListener listener) {
        this.listener = listener;
    }
    
    @NonNull
    @Override
    public PodcastViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_podcast, parent, false);
        return new PodcastViewHolder(view);
    }
    
    @Override
    public void onBindViewHolder(@NonNull PodcastViewHolder holder, int position) {
        Podcast podcast = podcasts.get(position);
        holder.bind(podcast);
    }
    
    @Override
    public int getItemCount() {
        return podcasts.size();
    }
    
    class PodcastViewHolder extends RecyclerView.ViewHolder {
        private ImageView podcastImage;
        private TextView podcastTitle;
        private TextView podcastDescription;
        
        public PodcastViewHolder(@NonNull View itemView) {
            super(itemView);
            podcastImage = itemView.findViewById(R.id.podcast_image);
            podcastTitle = itemView.findViewById(R.id.podcast_title);
            podcastDescription = itemView.findViewById(R.id.podcast_description);
            
            itemView.setOnClickListener(v -> {
                if (listener != null) {
                    int position = getAdapterPosition();
                    if (position != RecyclerView.NO_POSITION) {
                        listener.onPodcastClick(podcasts.get(position));
                    }
                }
            });
        }
        
        public void bind(Podcast podcast) {
            podcastTitle.setText(podcast.getTitle());
            podcastDescription.setText(podcast.getDescription());
            
            // Load image with Glide
            Glide.with(itemView.getContext())
                    .load(podcast.getImageUrl())
                    .placeholder(R.drawable.ic_podcast_placeholder)
                    .error(R.drawable.ic_podcast_placeholder)
                    .into(podcastImage);
        }
    }
}