package edu.sm.repository;

import edu.sm.dto.Product;
import edu.sm.dto.Product_;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PurchasedHistoryRepository {
    /** 구매자 ID 로 Trade_History + Product 정보를 조회 */
    List<Product_> findByBuyer(@Param("buyerId") String buyerId);
}
