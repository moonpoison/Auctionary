package edu.sm.repository;

import edu.sm.dto.Product;
import edu.sm.dto.Product_;
import edu.sm.exception.ProductNotFoundException;
import edu.sm.frame.SmRepository;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.Collections;
import java.util.List;

@Repository
@Mapper
public interface ProductRepository extends SmRepository<Product, Integer> {
    public Product createProduct(Product product) ;

    public List<Product> getAllProducts() ;

    Product getProductById(int productId);

    List<Product_> findByIds(List<String> ids);
}
