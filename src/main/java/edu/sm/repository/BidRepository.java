package edu.sm.repository;

import edu.sm.dto.Bid;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface BidRepository {
    int insert(Bid bid);
    Bid getHighestBid(int productId); // (이미 존재할 경우)
    Integer findHighestBidPriceByProductId(int productId);
    List<Bid> findByUserId(String userId);
}