package edu.sm.repository;

import edu.sm.dto.Product;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ProductRepository {
    List<Product> findByIds(List<Integer> ids);
    void insertProduct(Product product);

    List<Product> selectAll();

    Product select(int productId);
}