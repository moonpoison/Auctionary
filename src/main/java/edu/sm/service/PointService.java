package edu.sm.service;

import edu.sm.dto.Point;
import edu.sm.repository.PointRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PointService {

    private final PointRepository pointRepository;

    public Point getPoint(String userId) {
        return pointRepository.getPoint(userId);
    }

    public void updatePoint(Point point) {
        pointRepository.updatePoint(point);
    }
}