package edu.sm.repository;

import edu.sm.dto.Point;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Repository
@Mapper
public interface PointRepository {
    Point getPoint(String userId);
    void updatePoint(Point point);
}