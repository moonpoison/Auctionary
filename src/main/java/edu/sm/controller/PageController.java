package edu.sm.controller;

import edu.sm.dto.*;
import edu.sm.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
public class PageController {

    private final UserService userService;
    private final BidService bidService;
    private final PointHistoryService pointHistoryService;
    private final ProductService productService;
    private final TradeHistoryService tradeHistoryService;
    private final WishlistService wishlistService;
    private final ReviewService reviewService;

    @GetMapping({"/", "/index"})
    public String home() {
        return "index";
    }

    @GetMapping("/login")
    public String login() {
        return "pages/login";
    }

    @GetMapping("/signup")
    public String signup() {
        return "pages/signup";
    }

    @GetMapping("/my-page")
    public String myPage(Model model) {
        String loggedInUserId = "user01"; // 임시 사용자 ID

        // 1. 사용자 프로필 정보 조회
        User user = userService.getUserById(loggedInUserId);
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
        // 리뷰 목록에서 작성자 ID들만 뽑아서, 각 ID에 해당하는 사용자 이름(name)을 Map 형태로 가져옵니다.
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
        model.addAttribute("reviewerNames", reviewerNames); // JSP에서 사용할 수 있도록 Model에 추가

        return "pages/my-page";
    }

    @GetMapping("/points")
    public String points() {
        return "pages/points";
    }

    @GetMapping("/sell")
    public String sell() {
        return "pages/sell";
    }
}