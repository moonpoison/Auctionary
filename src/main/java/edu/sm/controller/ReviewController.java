package edu.sm.controller;

import edu.sm.dto.Review;
import edu.sm.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    
    @Autowired
    private ReviewService reviewService;
    
    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody Review review, HttpSession session) {
        try {
            String userId = (String) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(401).body("로그인이 필요합니다.");
            }
            
            review.setReviewerId(userId);
            reviewService.createReview(review);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "리뷰가 작성되었습니다.");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("리뷰 작성 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getProductReviews(@PathVariable int productId) {
        try {
            List<Review> reviews = reviewService.getProductReviews(productId);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    @GetMapping("/user/received")
    public ResponseEntity<List<ReviewService.ReviewView>> getReceivedReviews(HttpSession session) {
        try {
            String userId = (String) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(401).body(null);
            }
            
            List<ReviewService.ReviewView> reviews = reviewService.getReceivedReviewsAsReviewView(userId);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    @GetMapping("/user/written")
    public ResponseEntity<List<ReviewService.ReviewView>> getWrittenReviews(HttpSession session) {
        try {
            String userId = (String) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(401).body(null);
            }
            
            List<ReviewService.ReviewView> reviews = reviewService.getWrittenReviews(userId);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable int reviewId, HttpSession session) {
        try {
            String userId = (String) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(401).body("로그인이 필요합니다.");
            }
            
            reviewService.deleteReview(reviewId, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "리뷰가 삭제되었습니다.");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("리뷰 삭제 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
} 