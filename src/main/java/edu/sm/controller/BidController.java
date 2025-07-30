package edu.sm.controller;

import edu.sm.dto.Bid;
import edu.sm.dto.User;
import edu.sm.exception.AuctionClosedException;
import edu.sm.exception.InsufficientPointsException;
import edu.sm.exception.InvalidBidPriceException;
import edu.sm.exception.ProductNotFoundException;
import edu.sm.service.BidService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bids")
public class BidController {

    @Autowired
    private BidService bidService;

    @PostMapping
    public ResponseEntity<?> placeBid(@RequestBody Bid bid, HttpSession session) {
        User loggedInUser = (User) session.getAttribute("user");
        if (loggedInUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        try {
            int result = bidService.placeBid(bid, loggedInUser.getUserId());
            if (result > 0) {
                return ResponseEntity.ok("입찰 성공");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("입찰 실패");
            }
        } catch (ProductNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (AuctionClosedException | InvalidBidPriceException | InsufficientPointsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("입찰 처리 중 알 수 없는 오류가 발생했습니다: " + e.getMessage());
        }
    }
}
