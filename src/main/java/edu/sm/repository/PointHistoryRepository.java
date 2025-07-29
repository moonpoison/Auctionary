package edu.sm.repository;

import edu.sm.dto.Point_History;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface PointHistoryRepository {
    void insert(Point_History pointHistory);
    Point_History select(String userId);
    List<Point_History> selectAll(String userId);
}