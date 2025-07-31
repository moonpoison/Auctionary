package edu.sm.controller;

import edu.sm.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {
    
    @Autowired
    private WishlistService wishlistService;
    
    // 세션에서 userId 추출하는 헬퍼 메서드
    private String getUserIdFromSession(HttpSession session) {
        var user = session.getAttribute("user");
        if (user == null) {
            return null;
        }
        
        if (user instanceof edu.sm.dto.User) {
            return ((edu.sm.dto.User) user).getUserId();
        } else {
            // Map 형태로 저장된 경우
            @SuppressWarnings("unchecked")
            Map<String, Object> userMap = (Map<String, Object>) user;
            return (String) userMap.get("userId");
        }
    }
    
    @PostMapping("/{productId}")
    public ResponseEntity<?> addToWishlist(@PathVariable int productId, HttpSession session) {
        try {
            String userId = getUserIdFromSession(session);
            if (userId == null) {
                return ResponseEntity.status(401).body("로그인이 필요합니다.");
            }
            
            // 이미 찜했는지 확인
            boolean isWishlisted = wishlistService.isWishlisted(userId, productId);
            if (isWishlisted) {
                // 이미 찜했다면 제거
                wishlistService.removeFromWishlist(userId, productId);
                Map<String, Object> response = new HashMap<>();
                response.put("message", "찜 목록에서 제거되었습니다.");
                response.put("action", "removed");
                return ResponseEntity.ok(response);
            } else {
                // 찜하지 않았다면 추가
                wishlistService.addToWishlist(userId, productId);
                Map<String, Object> response = new HashMap<>();
                response.put("message", "찜 목록에 추가되었습니다.");
                response.put("action", "added");
                return ResponseEntity.ok(response);
            }
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("찜 처리 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable int productId, HttpSession session) {
        try {
            String userId = getUserIdFromSession(session);
            if (userId == null) {
                return ResponseEntity.status(401).body("로그인이 필요합니다.");
            }
            
            wishlistService.removeFromWishlist(userId, productId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "찜 목록에서 제거되었습니다.");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("찜 제거 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    @GetMapping
    public ResponseEntity<List<WishlistService.WishView>> getWishlist(HttpSession session) {
        try {
            String userId = getUserIdFromSession(session);
            if (userId == null) {
                return ResponseEntity.status(401).body(null);
            }
            
            List<WishlistService.WishView> wishlist = wishlistService.getWishlist(userId);
            return ResponseEntity.ok(wishlist);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    @GetMapping("/check/{productId}")
    public ResponseEntity<Map<String, Boolean>> checkWishlist(@PathVariable int productId, HttpSession session) {
        try {
            String userId = getUserIdFromSession(session);
            if (userId == null) {
                return ResponseEntity.status(401).body(null);
            }
            
            boolean isWishlisted = wishlistService.isWishlisted(userId, productId);
            Map<String, Boolean> response = new HashMap<>();
            response.put("isWishlisted", isWishlisted);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // 상품별 찜 개수 조회
    @GetMapping("/product/{productId}/count")
    public ResponseEntity<Map<String, Integer>> getWishlistCount(@PathVariable int productId) {
        try {
            int count = wishlistService.getWishlistCount(productId);
            Map<String, Integer> response = new HashMap<>();
            response.put("count", count);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
} 