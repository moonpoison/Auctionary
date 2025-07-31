package edu.sm.controller;

import edu.sm.dto.Bid;
import edu.sm.service.BidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bids")
public class BidController {
    @Autowired
    private BidService bidService;

    @PostMapping
    public ResponseEntity<?> placeBid(@RequestBody Bid bid) {
        bidService.placeBid(bid);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Bid>> getBidsByProductId(@RequestParam int productId) {
        List<Bid> bids = bidService.getBidsByProductId(productId);
        return ResponseEntity.ok(bids);
    }
}
