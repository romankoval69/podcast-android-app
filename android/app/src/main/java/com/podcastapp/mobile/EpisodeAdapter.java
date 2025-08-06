package com.podcastapp.mobile;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import java.util.List;

public class EpisodeAdapter extends RecyclerView.Adapter<EpisodeAdapter.EpisodeViewHolder> {
    
    private List<Episode> episodes;
    private OnEpisodeClickListener listener;
    
    public interface OnEpisodeClickListener {
        void onEpisodePlay(Episode episode);
        void onEpisodeDownload(Episode episode);
    }
    
    public EpisodeAdapter(List<Episode> episodes) {
        this.episodes = episodes;
    }
    
    public void setOnEpisodeClickListener(OnEpisodeClickListener listener) {
        this.listener = listener;
    }
    
    @NonNull
    @Override
    public EpisodeViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_episode, parent, false);
        return new EpisodeViewHolder(view);
    }
    
    @Override
    public void onBindViewHolder(@NonNull EpisodeViewHolder holder, int position) {
        Episode episode = episodes.get(position);
        holder.bind(episode);
    }
    
    @Override
    public int getItemCount() {
        return episodes.size();
    }
    
    class EpisodeViewHolder extends RecyclerView.ViewHolder {
        private TextView episodeTitle;
        private TextView podcastName;
        private TextView duration;
        private ImageButton playButton;
        private ImageButton downloadButton;
        
        public EpisodeViewHolder(@NonNull View itemView) {
            super(itemView);
            episodeTitle = itemView.findViewById(R.id.episode_title);
            podcastName = itemView.findViewById(R.id.podcast_name);
            duration = itemView.findViewById(R.id.duration);
            playButton = itemView.findViewById(R.id.play_button);
            downloadButton = itemView.findViewById(R.id.download_button);
            
            playButton.setOnClickListener(v -> {
                if (listener != null) {
                    int position = getAdapterPosition();
                    if (position != RecyclerView.NO_POSITION) {
                        listener.onEpisodePlay(episodes.get(position));
                    }
                }
            });
            
            downloadButton.setOnClickListener(v -> {
                if (listener != null) {
                    int position = getAdapterPosition();
                    if (position != RecyclerView.NO_POSITION) {
                        listener.onEpisodeDownload(episodes.get(position));
                    }
                }
            });
        }
        
        public void bind(Episode episode) {
            episodeTitle.setText(episode.getTitle());
            podcastName.setText(episode.getPodcastName());
            duration.setText(episode.getDuration());
            
            // Update button states
            downloadButton.setImageResource(episode.isDownloaded() ? 
                R.drawable.ic_downloaded : R.drawable.ic_download);
        }
    }
}