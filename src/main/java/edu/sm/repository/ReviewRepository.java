package edu.sm.repository;

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
}
