package edu.sm.service;

import edu.sm.dto.Point_History;
import edu.sm.dto.User;
import edu.sm.repository.AccountRepository;
import edu.sm.repository.PointHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PointHistoryService {

    final PointHistoryRepository pointHistoryRepository;

    public void insert(Point_History pointHistory) throws Exception {
        pointHistoryRepository.insert(pointHistory);
    }

    public void update(User user) throws Exception {
        pointHistoryRepository.update(user);
    }

    public void delete(String userId) throws Exception {
        pointHistoryRepository.delete(userId);
    }

    public List<Point_History> selectAll(String userId) throws Exception {
        return pointHistoryRepository.selectAll(userId);
    }

    public int select(String userId) throws Exception {
        Integer point = pointHistoryRepository.select(userId);
        return point != null ? point : 0; // null인 경우 기본값 0 반환
    }
}
