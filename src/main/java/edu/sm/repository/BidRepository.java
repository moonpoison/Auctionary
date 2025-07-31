package edu.sm.repository;

import edu.sm.dto.Bid;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface BidRepository {
    List<Bid> findByUserId(String userId);
    void insertBid(Bid bid);
    List<Bid> selectBidsByProductId(int productId);
}