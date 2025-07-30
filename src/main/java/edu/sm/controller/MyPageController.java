package edu.sm.controller;

import edu.sm.dto.*;
import edu.sm.service.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/my-page") // "/my-page"로 시작하는 모든 요청을 이 컨트롤러가 처리하도록 설정
@RequiredArgsConstructor
public class MyPageController {

    // 마이페이지에서만 사용하는 서비스들을 주입받습니다.
    private final UserService userService;
    private final BidService bidService;
    private final PointHistoryService pointHistoryService;
    private final ProductService productService;
    private final TradeHistoryService tradeHistoryService;
    private final WishlistService wishlistService;
    private final ReviewService reviewService;

    @GetMapping // "/my-page" 경로에 대한 GET 요청을 처리
    public String myPage(HttpServletRequest request, Model model) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            return "redirect:/login";
        }
        User user = (User) session.getAttribute("user");
        String loggedInUserId = user.getUserId();

        // 1. 사용자 프로필 정보 조회
        model.addAttribute("userProfile", user);

        // 2. 최근 활동 내역 조회
        List<ActivityLog> recentActivities = bidService.getRecentActivities(loggedInUserId);
        model.addAttribute("recentActivities", recentActivities);

        // 3. 포인트 내역 조회
        List<Point_History> pointHistory = pointHistoryService.getPointHistory(loggedInUserId);
        model.addAttribute("pointHistory", pointHistory);

        // 4. 입찰 내역 조회
        List<Product> biddingList = productService.getBiddingProducts(loggedInUserId);
        model.addAttribute("biddingList", biddingList);

        // 5. 판매 내역 조회
        List<Product> sellingList = productService.getSellingProducts(loggedInUserId);
        model.addAttribute("sellingList", sellingList);

        // 6. 구매 내역 조회
        List<Product> purchasedList = tradeHistoryService.getPurchasedProducts(loggedInUserId);
        model.addAttribute("purchasedList", purchasedList);

        // 7. 찜한 상품 목록 조회
        List<Product> wishlist = wishlistService.getWishlistProducts(loggedInUserId);
        model.addAttribute("wishlist", wishlist);

        // 8. 받은 리뷰 목록 및 작성자 이름 조회
        List<Review> reviews = reviewService.getReceivedReviews(loggedInUserId);
        Map<String, String> reviewerNames = reviews.stream()
                .map(Review::getReviewerId)
                .distinct()
                .collect(Collectors.toMap(
                        id -> id,
                        id -> {
                            User reviewer = userService.getUserById(id);
                            return reviewer != null ? reviewer.getName() : "알 수 없는 사용자";
                        }
                ));
        model.addAttribute("reviews", reviews);
        model.addAttribute("reviewerNames", reviewerNames);

        // 9. 현재 포인트 조회
        int userPoints = pointHistoryService.getUserPoints(loggedInUserId);
        model.addAttribute("userPoints", userPoints);

        // 10. 찜한 상품 개수 조회
        int wishlistCount = wishlistService.getWishlistCount(loggedInUserId);
        model.addAttribute("wishlistCount", wishlistCount);

        return "pages/my-page";
    }
}