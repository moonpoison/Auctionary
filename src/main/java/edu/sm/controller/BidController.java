package edu.sm.controller;

import edu.sm.dto.Bid;
import edu.sm.dto.Point;
import edu.sm.dto.Point_History;
import edu.sm.dto.Product;
import edu.sm.dto.User;
import edu.sm.service.BidService;
import edu.sm.service.PointHistoryService;
import edu.sm.service.PointService;
import edu.sm.service.ProductService;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Date;

@RestController
@RequestMapping("/api/bids")
public class BidController {

    @Autowired
    private BidService bidService;

    @Autowired
    private ProductService productService;

    @Autowired
    private PointService pointService;

    @Autowired
    private PointHistoryService pointHistoryService;

    @Transactional
    @PostMapping
    public ResponseEntity<?> placeBid(@RequestBody Bid bid, HttpSession session) {
        User loggedInUser = (User) session.getAttribute("user");
        if (loggedInUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        Product product = productService.getProductById(bid.getProductId());
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("상품을 찾을 수 없습니다.");
        }

        if (product.getAuctionEndDate().before(new Date())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("경매가 종료된 상품입니다.");
        }

        Point userPoint = pointService.getPoint(loggedInUser.getUserId());
        if (userPoint == null || userPoint.getPoint() < bid.getBidPrice()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("포인트가 부족합니다.");
        }

        // 포인트 차감
        int oldPoint = userPoint.getPoint();
        userPoint.setPoint(userPoint.getPoint() - bid.getBidPrice());
        pointService.updatePoint(userPoint);

        // 포인트 내역 기록
        Point_History pointHistory = Point_History.builder()
                .userId(loggedInUser.getUserId())
                .actionType("입찰")
                .pointChange(-bid.getBidPrice())
                .finalPoint(userPoint.getPoint())
                .changeDate(LocalDateTime.now())
                .note("상품 입찰: " + product.getProductName() + " (ID: " + product.getProductId() + ")")
                .build();
        pointHistoryService.recordPointHistory(pointHistory);

        bid.setBidUserId(loggedInUser.getUserId());
        bid.setBidDate(LocalDateTime.now());

        try {
            int result = bidService.placeBid(bid);
            if (result > 0) {
                return ResponseEntity.ok("입찰 성공");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("입찰 실패");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
