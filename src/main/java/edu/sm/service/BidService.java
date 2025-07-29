package edu.sm.service;

import edu.sm.dto.Bid;
import edu.sm.repository.BidRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BidService {

    @Autowired
    private BidRepository bidRepository;

    public int placeBid(Bid bid) {
        Bid highestBid = bidRepository.getHighestBid(bid.getProductId());
        if (highestBid != null && bid.getBidPrice() <= highestBid.getBidPrice()) {
            throw new RuntimeException("현재 최고 입찰가보다 높게 입찰해야 합니다.");
        }
        int result = bidRepository.insert(bid);
        return result;
    }
}
