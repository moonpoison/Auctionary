package edu.sm.service;

import edu.sm.dto.ActivityLog;
import edu.sm.repository.BidRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BidService {

    private final BidRepository bidRepository;

    public List<ActivityLog> getRecentActivities(String userId) {
        return bidRepository.findRecentActivitiesByUserId(userId);
    }
}