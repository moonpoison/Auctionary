package edu.sm.repository;

import edu.sm.dto.Review;
import lombok.Data;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.util.List;

/** 리뷰 + 상품명 + 리뷰어 이름을 한 번에 묶어서 반환 */
@Mapper
public interface ReviewRepository {

    /* 조회 결과를 담을 VO */
    @Data
    class ReviewVO {
        private int    reviewId;
        private String reviewerId;
        private String reviewerName;
        private String productName;
        private int    rating;
        private String content;
        private LocalDateTime reviewDate;
    }

    /** 로그인 사용자가 받은 모든 리뷰 */
    List<ReviewVO> findReceived(@Param("userId") String userId);
    
    /** 리뷰 작성 */
    void insertReview(Review review);
    
    /** 상품별 리뷰 조회 */
    List<Review> findByProductId(@Param("productId") int productId);
    
    /** 사용자가 작성한 리뷰 조회 */
    List<ReviewVO> findWritten(@Param("userId") String userId);
    
    /** 리뷰 ID로 조회 */
    Review findById(@Param("reviewId") int reviewId);
    
    /** 리뷰 삭제 */
    void deleteReview(@Param("reviewId") int reviewId);
}
