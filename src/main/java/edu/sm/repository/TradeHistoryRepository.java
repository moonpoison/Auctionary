package edu.sm.repository;

import edu.sm.dto.Product;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface TradeHistoryRepository {
    List<Product> findPurchasedProductsByUserId(String userId);
}