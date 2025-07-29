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

    public void recordPointHistory(Point_History pointHistory) {
        pointHistoryRepository.insert(pointHistory);
    }

    public Point_History select(String userId) {
        return pointHistoryRepository.select(userId);
    }

    public List<Point_History> selectAll(String userId) {
        return pointHistoryRepository.selectAll(userId);
    }
}