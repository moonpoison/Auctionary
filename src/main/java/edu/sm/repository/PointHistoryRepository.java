package edu.sm.repository;

import edu.sm.dto.Point_History;
import edu.sm.dto.User;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PointHistoryRepository {
    
    void insert(User user) throws Exception;
    
    void update(User user) throws Exception;
    
    void delete(String userId) throws Exception;
    
    List<Point_History> selectAll(String userId) throws Exception;
    
    Integer select(String userId) throws Exception;
}
