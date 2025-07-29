
package edu.sm.service;

import edu.sm.dto.Product;
import edu.sm.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
