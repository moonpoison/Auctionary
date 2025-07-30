package edu.sm.service;

import edu.sm.dto.*;
import edu.sm.exception.*;
import edu.sm.repository.BidRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class BidService {

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private PointHistoryService pointHistoryService;

    @Transactional
    public int placeBid(Bid bid, String userId) {
        Product product = productService.getProductById(bid.getProductId());
        if (product == null) {
            throw new ProductNotFoundException("상품을 찾을 수 없습니다.");
        }

        if (product.getAuctionEndDate().isBefore(LocalDateTime.now())) {
            throw new AuctionClosedException("경매가 종료된 상품입니다.");
        }

        Bid highestBid = bidRepository.getHighestBid(bid.getProductId());
        if (highestBid != null) {
            if (bid.getBidPrice() <= highestBid.getBidPrice()) {
                throw new InvalidBidPriceException("현재 최고 입찰가(" + highestBid.getBidPrice() + ")보다 높게 입찰해야 합니다.");
            }
        } else {
            if (bid.getBidPrice() < product.getStartingPrice()) {
                throw new InvalidBidPriceException("입찰 가격은 시작 가격(" + product.getStartingPrice() + ")보다 높아야 합니다.");
            }
        }

        if (bid.getBidPrice() % product.getBidUnit() != 0) {
            throw new InvalidBidPriceException("입찰 가격은 입찰 단위(" + product.getBidUnit() + ")의 배수여야 합니다.");
        }

        // ✅ 현재 포인트 조회 (Point_History 기반)
        int currentPoint;
        try {
            currentPoint = pointHistoryService.select(userId);
        } catch (Exception e) {
            throw new RuntimeException("현재 포인트 조회 실패", e);
        }

        int remainingPoint = currentPoint - bid.getBidPrice();
        if (remainingPoint < 0) {
            throw new InsufficientPointsException("포인트가 부족합니다.");
        }

        // ✅ 포인트 차감 이력 기록
        Point_History history = Point_History.builder()
                .userId(userId)
                .actionType("bid_place")
                .pointChange(-bid.getBidPrice())
                .finalPoint(remainingPoint)
                .changeDate(LocalDateTime.now())
                .note("상품 ID: " + product.getProductId() + " 입찰")
                .build();

        try {
            pointHistoryService.insert(history);
        } catch (Exception e) {
            throw new RuntimeException("포인트 이력 저장 실패", e);
        }

        // ✅ 입찰 정보 저장
        bid.setBidUserId(userId);
        bid.setBidDate(LocalDateTime.now());

        int result = bidRepository.insert(bid);
        System.out.println("Bid insert result: " + result);
        return result;
    }
}
