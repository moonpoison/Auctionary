package edu.sm.service;

import edu.sm.dto.Product;
import edu.sm.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public void saveProduct(Product product) {
        productRepository.insertProduct(product);
    }

    public List<Product> selectAll() {
        return productRepository.selectAll();
    }

    public Product select(int productId) {
        return productRepository.select(productId);
    }
}