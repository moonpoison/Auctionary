package edu.sm.service;

import edu.sm.dto.Bid;
import edu.sm.repository.BidRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BidService {
    @Autowired
    private BidRepository bidRepository;

    public void placeBid(Bid bid) {
        bid.setBidDate(LocalDateTime.now());
        bidRepository.insertBid(bid);
    }

    public List<Bid> getBidsByProductId(int productId) {
        return bidRepository.selectBidsByProductId(productId);
    }
    
    public List<Bid> getUserBids(String userId) {
        return bidRepository.findByUserId(userId);
    }
    
    public int getCurrentMaxBid(int productId) {
        List<Bid> bids = getBidsByProductId(productId);
        if (bids.isEmpty()) {
            return 0;
        }
        return bids.stream()
                .mapToInt(Bid::getBidPrice)
                .max()
                .orElse(0);
    }
    
    public Bid getHighestBid(int productId) {
        List<Bid> bids = getBidsByProductId(productId);
        if (bids.isEmpty()) {
            return null;
        }
        return bids.stream()
                .max((b1, b2) -> Integer.compare(b1.getBidPrice(), b2.getBidPrice()))
                .orElse(null);
    }
}
