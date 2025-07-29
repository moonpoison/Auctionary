package edu.sm.repository;

import edu.sm.dto.ActivityLog;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface BidRepository {
    List<ActivityLog> findRecentActivitiesByUserId(String userId);
}