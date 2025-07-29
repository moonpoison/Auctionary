package edu.sm.service;

import edu.sm.dto.Product;
import edu.sm.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    // 사용자가 입찰한 상품 목록을 가져오는 메소드
    public List<Product> getBiddingProducts(String userId) {
        return productRepository.findBiddingProductsByUserId(userId);
    }

    // [추가] 사용자가 판매하는 상품 목록을 가져오는 메소드
    public List<Product> getSellingProducts(String userId) {
        return productRepository.findSellingProductsByUserId(userId);
    }
}