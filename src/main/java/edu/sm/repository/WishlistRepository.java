package edu.sm.repository;

import edu.sm.dto.Product;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface WishlistRepository {
    List<Product> findWishlistProductsByUserId(String userId);

    int countByUserId(String userId);
}