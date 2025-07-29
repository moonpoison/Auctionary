package edu.sm.repository;

import edu.sm.dto.Review; // ReviewInfo 대신 Review를 import
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface ReviewRepository {
    List<Review> findReceivedReviewsByUserId(String userId);
}