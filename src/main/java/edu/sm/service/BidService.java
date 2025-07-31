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
}
