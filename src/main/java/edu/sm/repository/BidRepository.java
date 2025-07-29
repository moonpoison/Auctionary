package edu.sm.repository;

import edu.sm.dto.Bid;
import edu.sm.frame.SmRepository;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Repository
@Mapper
public interface BidRepository {
    int insert(Bid bid); // void → int 로 수정
}
