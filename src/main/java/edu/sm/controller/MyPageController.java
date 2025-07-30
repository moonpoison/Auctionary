package edu.sm.controller;

import edu.sm.dto.Point_History;
import edu.sm.dto.User;
import edu.sm.service.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import edu.sm.repository.ReviewRepository;
import java.util.List;

@RestController
@RequestMapping("/api/my-page")
@RequiredArgsConstructor
public class MyPageController {

    private final MyPageService          myPageService;
    private final BidHistoryService      bidHistoryService;
    private final SellingHistoryService  sellingHistoryService;
    private final PurchasedHistoryService purchasedHistoryService;
    private final WishlistService wishlistService;
    private final ReviewService reviewService;
    /* ── 최근 활동 ── */
    @GetMapping("/recent-activities")
    public ResponseEntity<List<Point_History>> recentActivities(HttpServletRequest req) throws Exception {
        User user = getUser(req);
        return user == null ? unauthorized()
                : ResponseEntity.ok(myPageService.getRecentActivities(user.getUserId()));
    }

    /* ── 포인트 내역 ── */
    @GetMapping("/point-history")
    public ResponseEntity<MyPageService.PagingResponse<Point_History>> pointHistory(
            HttpServletRequest req,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) throws Exception {

        User user = getUser(req);
        return user == null ? unauthorized()
                : ResponseEntity.ok(myPageService.getPointHistory(user.getUserId(), page, size));
    }

    /* ── 입찰 내역 ── */
    @GetMapping("/bid-history")
    public ResponseEntity<List<BidHistoryService.BidHistoryView>> bidHistory(HttpServletRequest req) {
        User user = getUser(req);
        return user == null ? unauthorized()
                : ResponseEntity.ok(bidHistoryService.getBidHistory(user.getUserId()));
    }

    /* ── 판매 내역 ── */
    @GetMapping("/selling-history")
    public ResponseEntity<List<SellingHistoryService.SellingView>> sellingHistory(HttpServletRequest req) {
        User user = getUser(req);
        return user == null ? unauthorized()
                : ResponseEntity.ok(sellingHistoryService.getSellingHistory(user.getUserId()));
    }

    /* ── 구매 내역 ── */
    @GetMapping("/purchased-history")
    public ResponseEntity<List<PurchasedHistoryService.PurchasedView>> purchasedHistory(HttpServletRequest req) {
        User user = getUser(req);
        return user == null ? unauthorized()
                : ResponseEntity.ok(purchasedHistoryService.getPurchased(user.getUserId()));
    }

    /* ── 찜한 상품 ── */
    @GetMapping("/wishlist")
    public ResponseEntity<List<WishlistService.WishView>> wishlist(HttpServletRequest req) {
        User user = getUser(req);
        return user == null ? unauthorized()
                : ResponseEntity.ok(wishlistService.getWishlist(user.getUserId()));
    }

    @GetMapping("/reviews")
    public ResponseEntity<List<ReviewRepository.ReviewVO>> reviews(HttpServletRequest req) {
        User user = getUser(req);
        return user == null ? unauthorized()
                : ResponseEntity.ok(reviewService.getReceivedReviews(user.getUserId()));
    }

    /* ── 공통 헬퍼 ── */
    private static <T> ResponseEntity<T> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    private static User getUser(HttpServletRequest req) {
        HttpSession s = req.getSession(false);
        return s == null ? null : (User) s.getAttribute("user");
    }
}
