package edu.sm.service;

import edu.sm.dto.Review;
import edu.sm.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public List<Review> getReceivedReviews(String userId) {
        return reviewRepository.findReceivedReviewsByUserId(userId);
    }
}