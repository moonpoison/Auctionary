package edu.sm.service;

import edu.sm.dto.Point_History;
import edu.sm.repository.PointHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PointHistoryService {
    private final PointHistoryRepository pointHistoryRepository;

    public List<Point_History> getPointHistory(String userId) {
        return pointHistoryRepository.findByUserId(userId);
    }
}