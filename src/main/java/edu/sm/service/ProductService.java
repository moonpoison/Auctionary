
package edu.sm.service;

import edu.sm.dto.Product;
import edu.sm.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import edu.sm.exception.ProductNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.List;

@Service
public class ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    @Autowired
    private ProductRepository productRepository;

    public Product createProduct(Product product) {
        try {
            productRepository.insert(product);
            return product;
        } catch (Exception e) {
            logger.error("상품 등록 실패: ", e);
            throw new RuntimeException("상품 등록 실패: " + e.getMessage(), e);
        }
    }

    public List<Product> getAllProducts() {
        try {
            return productRepository.selectAll();
        } catch (Exception e) {
            logger.error("상품 조회 실패: ", e);
            return Collections.emptyList();
        }
    }

    public Product getProductById(int productId) { // 단일 상품 조회 메서드 추가
        try {
            Product product = productRepository.select(productId);
            if (product == null) {
                throw new ProductNotFoundException("상품을 찾을 수 없습니다: " + productId);
            }
            return product;
        } catch (Exception e) {
            logger.error("상품 조회 실패: ", e);
            throw new RuntimeException("상품 조회 실패: " + e.getMessage(), e);
        }
    }
}
