package edu.sm.service;

import edu.sm.dto.Review;
import edu.sm.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository repo;

    public record ReviewView(
            int reviewId,
            String reviewerId,
            String reviewerName,
            String productName,
            int rating,
            String content,
            LocalDateTime reviewDate
    ) {}

    public List<ReviewRepository.ReviewVO> getReceivedReviews(String userId){
        return repo.findReceived(userId);
    }
    
    public List<ReviewView> getReceivedReviewsAsReviewView(String userId) {
        return repo.findReceived(userId).stream()
                .map(vo -> new ReviewView(
                        vo.getReviewId(),
                        vo.getReviewerId(),
                        vo.getReviewerName(),
                        vo.getProductName(),
                        vo.getRating(),
                        vo.getContent(),
                        vo.getReviewDate()
                ))
                .toList();
    }
    
    public void createReview(Review review) {
        review.setReviewDate(LocalDateTime.now());
        repo.insertReview(review);
    }
    
    public List<Review> getProductReviews(int productId) {
        return repo.findByProductId(productId);
    }
    
    public List<ReviewView> getWrittenReviews(String userId) {
        return repo.findWritten(userId).stream()
                .map(vo -> new ReviewView(
                        vo.getReviewId(),
                        vo.getReviewerId(),
                        vo.getReviewerName(),
                        vo.getProductName(),
                        vo.getRating(),
                        vo.getContent(),
                        vo.getReviewDate()
                ))
                .toList();
    }
    
    public void deleteReview(int reviewId, String userId) {
        // 리뷰 작성자만 삭제 가능
        Review review = repo.findById(reviewId);
        if (review == null || !review.getReviewerId().equals(userId)) {
            throw new RuntimeException("삭제 권한이 없습니다.");
        }
        repo.deleteReview(reviewId);
    }
}
