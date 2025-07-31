package edu.sm.repository;

import edu.sm.dto.Product;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface WishlistRepository {
    /** user_id 로 찜한 상품 리스트 */
    List<Product> findWishlist(@Param("userId") String userId);
}
