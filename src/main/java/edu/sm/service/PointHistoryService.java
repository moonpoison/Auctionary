package edu.sm.service;

import edu.sm.dto.Point_History;
import edu.sm.dto.User;
import edu.sm.repository.PointHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PointHistoryService {

    final PointHistoryRepository pointHitoryRepository;

    public void insert(User user) throws Exception {
        pointHitoryRepository.insert(user);
    }

    public void update(User user) throws Exception {
        pointHitoryRepository.update(user);
    }

    public void delete(String userId) throws Exception {
        pointHitoryRepository.delete(userId);
    }

    public List<Point_History> selectAll() throws Exception {
        return pointHitoryRepository.selectAll();
    }

    public int select(String userId) throws Exception {
        return pointHitoryRepository.select(userId);
    }
}
