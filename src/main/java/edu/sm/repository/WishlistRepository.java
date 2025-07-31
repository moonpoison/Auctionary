package edu.sm.repository;

import edu.sm.dto.Product;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface WishlistRepository {
    /** user_id 로 찜한 상품 리스트 */
    List<Product> findWishlist(@Param("userId") String userId);
    
    /** 찜 추가 */
    void addToWishlist(@Param("userId") String userId, @Param("productId") int productId);
    
    /** 찜 제거 */
    void removeFromWishlist(@Param("userId") String userId, @Param("productId") int productId);
    
    /** 찜 여부 확인 */
    boolean isWishlisted(@Param("userId") String userId, @Param("productId") int productId);
    
    /** 상품별 찜 개수 조회 */
    int getWishlistCount(@Param("productId") int productId);
}
