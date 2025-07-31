package edu.sm.service;

import edu.sm.dto.Product;
import edu.sm.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository repo;

    public record WishView(
            String productId,
            String productName,
            String imagePath,
            double startingPrice,
            String transactionStatus
    ) {}

    public List<WishView> getWishlist(String userId) {
        return repo.findWishlist(userId).stream()
                .map(p -> new WishView(
                        p.getProductId(),
                        p.getProductName(),
                        p.getImagePath(),
                        p.getStartingPrice(),
                        p.getTransactionStatus()
                ))
                .toList();
    }
}
