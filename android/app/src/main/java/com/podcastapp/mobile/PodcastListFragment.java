package com.podcastapp.mobile;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import java.util.ArrayList;
import java.util.List;

public class PodcastListFragment extends Fragment {
    
    private RecyclerView recyclerView;
    private PodcastAdapter adapter;
    private List<Podcast> podcastList;
    
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_podcast_list, container, false);
        
        recyclerView = view.findViewById(R.id.podcast_recycler_view);
        FloatingActionButton fabAdd = view.findViewById(R.id.fab_add_podcast);
        
        setupRecyclerView();
        setupFab(fabAdd);
        
        return view;
    }
    
    private void setupRecyclerView() {
        podcastList = new ArrayList<>();
        adapter = new PodcastAdapter(podcastList);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        recyclerView.setAdapter(adapter);
        
        // TODO: Load podcasts from database
        loadSamplePodcasts();
    }
    
    private void setupFab(FloatingActionButton fab) {
        fab.setOnClickListener(v -> {
            // TODO: Open add podcast dialog
            // For now, add a sample podcast
            addSamplePodcast();
        });
    }
    
    private void loadSamplePodcasts() {
        // Sample data - replace with database loading
        podcastList.add(new Podcast("1", "Tech Talk Daily", "Latest technology news and insights", "https://example.com/tech.jpg"));
        podcastList.add(new Podcast("2", "Science Explained", "Complex science made simple", "https://example.com/science.jpg"));
        adapter.notifyDataSetChanged();
    }
    
    private void addSamplePodcast() {
        String id = String.valueOf(podcastList.size() + 1);
        podcastList.add(new Podcast(id, "New Podcast " + id, "Description for new podcast", "https://example.com/default.jpg"));
        adapter.notifyItemInserted(podcastList.size() - 1);
    }
}