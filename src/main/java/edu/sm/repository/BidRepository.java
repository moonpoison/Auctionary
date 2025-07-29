package edu.sm.repository;

import edu.sm.dto.Bid;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Repository
@Mapper
public interface BidRepository {
    int insert(Bid bid);
    Bid getHighestBid(int productId);
}
