
package edu.sm.service;

import edu.sm.dto.Product;
import edu.sm.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public Product createProduct(Product product) {
        try {
            productRepository.insert(product);
            return product;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("상품 등록 실패: " + e.getMessage(), e);
        }
    }

    public List<Product> getAllProducts() {
        try {
            return productRepository.selectAll();
        } catch (Exception e) {
            e.printStackTrace(); // 또는 logger.error("상품 조회 실패", e);
            return Collections.emptyList();
        }
    }

    public Product getProductById(int productId) { // 단일 상품 조회 메서드 추가
        try {
            return productRepository.select(productId);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("상품 조회 실패: " + e.getMessage(), e);
        }
    }
}
