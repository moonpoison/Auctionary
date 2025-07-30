package edu.sm.service;

import edu.sm.dto.Bid;
import edu.sm.dto.Point;
import edu.sm.dto.Point_History;
import edu.sm.dto.Product;
import edu.sm.exception.AuctionClosedException;
import edu.sm.exception.InsufficientPointsException;
import edu.sm.exception.InvalidBidPriceException;
import edu.sm.exception.ProductNotFoundException;
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
    private PointService pointService;

    @Autowired
    private PointHistoryService pointHistoryService;

    @Transactional
    public int placeBid(Bid bid, String userId) {
        Product product = productService.getProductById(bid.getProductId());
        if (product == null) {
            throw new ProductNotFoundException("상품을 찾을 수 없습니다.");
        }

        // 경매 종료일 확인
        if (product.getAuctionEndDate().isBefore(LocalDateTime.now())) {
            throw new AuctionClosedException("경매가 종료된 상품입니다.");
        }

        // 현재 최고 입찰가 확인
        Bid highestBid = bidRepository.getHighestBid(bid.getProductId());
        if (highestBid != null) {
            if (bid.getBidPrice() <= highestBid.getBidPrice()) {
                throw new InvalidBidPriceException("현재 최고 입찰가(" + highestBid.getBidPrice() + ")보다 높게 입찰해야 합니다.");
            }
        } else { // 첫 입찰인 경우 시작 가격보다 높아야 함
            if (bid.getBidPrice() < product.getStartingPrice()) {
                throw new InvalidBidPriceException("입찰 가격은 시작 가격(" + product.getStartingPrice() + ")보다 높아야 합니다.");
            }
        }

        // 입찰 단위 확인
        if (bid.getBidPrice() % product.getBidUnit() != 0) {
            throw new InvalidBidPriceException("입찰 가격은 입찰 단위(" + product.getBidUnit() + ")의 배수여야 합니다.");
        }

        Point userPoint = pointService.getPoint(userId);
        if (userPoint == null || userPoint.getPoint() < bid.getBidPrice()) {
            throw new InsufficientPointsException("포인트가 부족합니다.");
        }

        // 포인트 차감
        userPoint.setPoint(userPoint.getPoint() - bid.getBidPrice());
        pointService.updatePoint(userPoint);

        // 포인트 내역 기록
        Point_History pointHistory = Point_History.builder()
                .userId(userId)
                .actionType("입찰")
                .pointChange(-bid.getBidPrice())
                .finalPoint(userPoint.getPoint())
                .changeDate(LocalDateTime.now())
                .note("상품 입찰: " + product.getProductName() + " (ID: " + product.getProductId() + ")")
                .build();
        pointHistoryService.recordPointHistory(pointHistory);

        bid.setBidUserId(userId);
        bid.setBidDate(LocalDateTime.now());

        int result = bidRepository.insert(bid);
        return result;
    }
}
