package com.podcastapp.mobile;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.SeekBar;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import com.google.android.material.button.MaterialButton;

public class PlayerFragment extends Fragment {
    
    private ImageView albumArt;
    private TextView episodeTitle, podcastName, currentTime, totalTime;
    private SeekBar progressBar;
    private MaterialButton playPauseButton, previousButton, nextButton;
    private MaterialButton speed15Button, forward30Button;
    
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_player, container, false);
        
        initViews(view);
        setupControls();
        loadCurrentEpisode();
        
        return view;
    }
    
    private void initViews(View view) {
        albumArt = view.findViewById(R.id.album_art);
        episodeTitle = view.findViewById(R.id.episode_title);
        podcastName = view.findViewById(R.id.podcast_name);
        currentTime = view.findViewById(R.id.current_time);
        totalTime = view.findViewById(R.id.total_time);
        progressBar = view.findViewById(R.id.progress_bar);
        
        playPauseButton = view.findViewById(R.id.play_pause_button);
        previousButton = view.findViewById(R.id.previous_button);
        nextButton = view.findViewById(R.id.next_button);
        speed15Button = view.findViewById(R.id.speed_15_button);
        forward30Button = view.findViewById(R.id.forward_30_button);
    }
    
    private void setupControls() {
        playPauseButton.setOnClickListener(v -> togglePlayPause());
        previousButton.setOnClickListener(v -> playPrevious());
        nextButton.setOnClickListener(v -> playNext());
        speed15Button.setOnClickListener(v -> skipBackward());
        forward30Button.setOnClickListener(v -> skipForward());
        
        progressBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                if (fromUser) {
                    // TODO: Seek to position
                    updateCurrentTime(progress);
                }
            }
            
            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {}
            
            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {}
        });
    }
    
    private void loadCurrentEpisode() {
        // Sample data - replace with actual player state
        episodeTitle.setText("Introduction to Android Development");
        podcastName.setText("Tech Talk Daily");
        currentTime.setText("5:23");
        totalTime.setText("45:30");
        progressBar.setMax(2730); // 45:30 in seconds
        progressBar.setProgress(323); // 5:23 in seconds
    }
    
    private void togglePlayPause() {
        // TODO: Implement play/pause functionality
        String currentText = playPauseButton.getText().toString();
        if ("Play".equals(currentText)) {
            playPauseButton.setText("Pause");
        } else {
            playPauseButton.setText("Play");
        }
    }
    
    private void playPrevious() {
        // TODO: Implement previous episode
    }
    
    private void playNext() {
        // TODO: Implement next episode  
    }
    
    private void skipBackward() {
        // TODO: Skip backward 15 seconds
        int currentProgress = progressBar.getProgress();
        int newProgress = Math.max(0, currentProgress - 15);
        progressBar.setProgress(newProgress);
        updateCurrentTime(newProgress);
    }
    
    private void skipForward() {
        // TODO: Skip forward 30 seconds
        int currentProgress = progressBar.getProgress();
        int newProgress = Math.min(progressBar.getMax(), currentProgress + 30);
        progressBar.setProgress(newProgress);
        updateCurrentTime(newProgress);
    }
    
    private void updateCurrentTime(int seconds) {
        int minutes = seconds / 60;
        int secs = seconds % 60;
        currentTime.setText(String.format("%d:%02d", minutes, secs));
    }
}