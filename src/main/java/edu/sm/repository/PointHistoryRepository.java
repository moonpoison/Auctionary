package edu.sm.repository;

import edu.sm.dto.Point_History;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
@Mapper
public interface PointHistoryRepository {
    List<Point_History> findByUserId(String userId);

    Integer findLatestPointsByUserId(String userId);

}