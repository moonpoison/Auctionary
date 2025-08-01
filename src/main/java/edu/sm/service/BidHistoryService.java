package edu.sm.service;

import edu.sm.dto.Bid;
import edu.sm.dto.Product;
import edu.sm.repository.BidRepository;
import edu.sm.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * 마이페이지 '입찰 내역' 비즈니스 로직
 */
@Service
@RequiredArgsConstructor
public class BidHistoryService {

    private final BidRepository bidRepo;
    private final ProductRepository prodRepo;

    /* 프런트용 DTO (record) */
    public record BidHistoryView(
            String  productId,
            String  productName,
            String  imagePath,
            String  transactionStatus,
            int     myBid,
            int     highestBid,
            boolean isWinner,
            Timestamp bidDate
    ){}

    public List<BidHistoryView> getBidHistory(String userId) {

        // 1) 내 최고가 입찰들
        List<Bid> myBids = bidRepo.findByUserId(userId);
        if (myBids.isEmpty()) return List.of();

        // 2) 상품 정보 매핑
        List<Integer> ids = myBids.stream()
                .map(Bid::getProductId)
                .distinct()
                .toList();

        Map<Integer, Product> prodMap =
                prodRepo.findByIds(ids).stream()
                        .collect(Collectors.toMap(Product::getProductId, p -> p));

        // 3) 최고가 계산 (간단히: myBid가 이미 최고가라고 가정)
        return myBids.stream()
                .map(b -> {
                    Product p = prodMap.get(b.getProductId());
                    return new BidHistoryView(
                            String.valueOf(b.getProductId()),
                            p != null ? p.getProductName() : "(삭제됨)",
                            p != null ? p.getImagePath()   : "",
                            p != null ? p.getTransactionStatus() : "AUCTIONING",
                            b.getBidPrice(),
                            b.getBidPrice(),          // 샘플: 로컬 최고가
                            false,                    // winner 계산 생략
                            Timestamp.valueOf(b.getBidDate())
                    );
                })
                .sorted(Comparator.comparing(BidHistoryView::bidDate).reversed())
                .toList();
    }
}
