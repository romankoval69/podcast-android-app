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
import java.util.ArrayList;
import java.util.List;

public class QueueFragment extends Fragment {
    
    private RecyclerView recyclerView;
    private EpisodeAdapter adapter;
    private List<Episode> queueList;
    
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_queue, container, false);
        
        recyclerView = view.findViewById(R.id.queue_recycler_view);
        setupRecyclerView();
        
        return view;
    }
    
    private void setupRecyclerView() {
        queueList = new ArrayList<>();
        adapter = new EpisodeAdapter(queueList);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        recyclerView.setAdapter(adapter);
        
        // Load sample queue
        loadSampleQueue();
    }
    
    private void loadSampleQueue() {
        // Sample data - replace with database loading
        queueList.add(new Episode("1", "Episode 1: Getting Started", "Tech Talk Daily", "25:30", false));
        queueList.add(new Episode("2", "Episode 2: Advanced Topics", "Tech Talk Daily", "32:15", false));
        queueList.add(new Episode("3", "The Science of Sleep", "Science Explained", "41:20", false));
        adapter.notifyDataSetChanged();
    }
}