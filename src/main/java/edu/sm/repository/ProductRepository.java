package edu.sm.repository;

import edu.sm.dto.Product;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface ProductRepository {
    // 입찰한 상품 목록 조회를 위한 메소드
    List<Product> findBiddingProductsByUserId(String userId);

    // [추가] 판매 중인 상품 목록 조회를 위한 메소드
    List<Product> findSellingProductsByUserId(String userId);
}