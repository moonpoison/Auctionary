package edu.sm.repository;

import edu.sm.dto.Product;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SellingHistoryRepository {
    /** 판매자 ID 로 내가 올린 모든 상품 + 최고 입찰가 조회 */
    List<Product> findBySellerId(@Param("sellerId") String sellerId);
}
