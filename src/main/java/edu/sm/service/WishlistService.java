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
                        String.valueOf(p.getProductId()),
                        p.getProductName(),
                        p.getImagePath(),
                        p.getStartingPrice(),
                        p.getTransactionStatus()
                ))
                .toList();
    }
    
    public void addToWishlist(String userId, int productId) {
        repo.addToWishlist(userId, productId);
    }
    
    public void removeFromWishlist(String userId, int productId) {
        repo.removeFromWishlist(userId, productId);
    }
    
    public boolean isWishlisted(String userId, int productId) {
        return repo.isWishlisted(userId, productId);
    }

    // 상품별 찜 개수 조회
    public int getWishlistCount(int productId) {
        return repo.getWishlistCount(productId);
    }
}
