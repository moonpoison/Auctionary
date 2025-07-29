package edu.sm.service;

import edu.sm.dto.Product;
import edu.sm.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;

    public List<Product> getWishlistProducts(String userId) {
        return wishlistRepository.findWishlistProductsByUserId(userId);
    }
}