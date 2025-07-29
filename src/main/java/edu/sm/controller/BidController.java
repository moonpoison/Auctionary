package edu.sm.controller;

import edu.sm.dto.Bid;
import edu.sm.dto.User;
import edu.sm.service.BidService;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
@RestController
@RequestMapping("/api/bids")
public class BidController {

    @Autowired
    private BidService bidService;

    @PostMapping
    public ResponseEntity<?> placeBid(@RequestBody Bid bid, HttpSession session) {
        User loggedInUser = (User) session.getAttribute("user"); // "loggedInUser" -> "user"로 변경
        if (loggedInUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        // 🔍 productId 로그 출력
        System.out.println("▶ 입찰 요청 productId: " + bid.getProductId());

        bid.setBidUserId(loggedInUser.getUserId());
        bid.setBidDate(LocalDateTime.now());

        int result = bidService.placeBid(bid);
        if (result > 0) {
            return ResponseEntity.ok("입찰 성공");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("입찰 실패");
        }
    }
}
