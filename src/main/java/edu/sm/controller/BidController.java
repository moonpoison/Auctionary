package edu.sm.controller;

import edu.sm.dto.Bid;
import edu.sm.service.BidService;
import edu.sm.service.PointTransactionService;
import edu.sm.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bids")
public class BidController {
    @Autowired
    private BidService bidService;
    
    @Autowired
    private PointTransactionService pointService;
    
    @Autowired
    private ProductService productService;

    @PostMapping
    public ResponseEntity<?> placeBid(@RequestBody Bid bid, HttpSession session) {
        try {
            // 로그인 확인 - 세션에서 user 객체를 가져와서 userId 추출
            var user = session.getAttribute("user");
            if (user == null) {
                return ResponseEntity.status(401).body("로그인이 필요합니다.");
            }
            
            // User 객체에서 userId 추출
            String userId;
            if (user instanceof edu.sm.dto.User) {
                userId = ((edu.sm.dto.User) user).getUserId();
            } else {
                // Map 형태로 저장된 경우
                @SuppressWarnings("unchecked")
                Map<String, Object> userMap = (Map<String, Object>) user;
                userId = (String) userMap.get("userId");
            }
            
            if (userId == null) {
                return ResponseEntity.status(401).body("사용자 정보가 올바르지 않습니다.");
            }
            
            bid.setBidUserId(userId);
            
            // 상품 정보 확인
            var product = productService.getProductById(bid.getProductId());
            if (product == null) {
                return ResponseEntity.badRequest().body("존재하지 않는 상품입니다.");
            }
            
            // 경매 종료 확인
            if ("ENDED".equals(product.getTransactionStatus()) || "SOLD".equals(product.getTransactionStatus())) {
                return ResponseEntity.badRequest().body("종료된 경매입니다.");
            }
            
            // 최소 입찰가 확인
            int currentMaxBid = bidService.getCurrentMaxBid(bid.getProductId());
            int minBidPrice = Math.max(product.getStartingPrice(), currentMaxBid + product.getBidUnit());
            
            if (bid.getBidPrice() < minBidPrice) {
                return ResponseEntity.badRequest().body("최소 입찰가(" + minBidPrice + "원)보다 높게 입찰해주세요.");
            }
            
            // 포인트 확인
            int userPoints = pointService.getUserPoints(userId);
            if (userPoints < bid.getBidPrice()) {
                return ResponseEntity.badRequest().body("포인트가 부족합니다. 현재 포인트: " + userPoints + "원");
            }
            
            // 입찰 처리
            bidService.placeBid(bid);
            
            // 포인트 차감
            pointService.deductPoints(userId, bid.getBidPrice(), "입찰: " + product.getProductName());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "입찰이 완료되었습니다.");
            response.put("bidPrice", bid.getBidPrice());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("입찰 처리 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Bid>> getBidsByProductId(@PathVariable int productId) {
        List<Bid> bids = bidService.getBidsByProductId(productId);
        return ResponseEntity.ok(bids);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Bid>> getUserBids(@PathVariable String userId) {
        List<Bid> bids = bidService.getUserBids(userId);
        return ResponseEntity.ok(bids);
    }
    
    @GetMapping("/product/{productId}/max")
    public ResponseEntity<Map<String, Object>> getCurrentMaxBid(@PathVariable int productId) {
        int maxBid = bidService.getCurrentMaxBid(productId);
        Map<String, Object> response = new HashMap<>();
        response.put("maxBid", maxBid);
        return ResponseEntity.ok(response);
    }
}
