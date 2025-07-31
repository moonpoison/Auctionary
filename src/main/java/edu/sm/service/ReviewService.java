package edu.sm.service;

import edu.sm.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository repo;

    public List<ReviewRepository.ReviewVO> getReceivedReviews(String userId){
        return repo.findReceived(userId);
    }
}
