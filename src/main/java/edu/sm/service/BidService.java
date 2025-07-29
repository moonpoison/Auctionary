package edu.sm.service;

import edu.sm.dto.Bid;
import edu.sm.repository.BidRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BidService {

    @Autowired
    private BidRepository bidRepository;

    public Bid createBid(Bid bid) {
        try {
            bidRepository.insert(bid);
            return bid;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("입찰 등록 실패: " + e.getMessage(), e);
        }
    }

    public int placeBid(Bid bid) {
        try {
            int result = bidRepository.insert(bid); // 이제 오류 없음
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("입찰 실패: " + e.getMessage(), e);
        }
    }
}
