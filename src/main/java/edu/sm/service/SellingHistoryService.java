package edu.sm.service;

import edu.sm.dto.Product;
import edu.sm.repository.SellingHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Comparator;
import java.util.List;

/**
 * 마이페이지 '판매 내역' 비즈니스 로직
 */
@Service
@RequiredArgsConstructor
public class SellingHistoryService {

    private final SellingHistoryRepository repo;

    /* 프런트 전용 뷰‑모델 */
    public record SellingView(
            String  productId,
            String  productName,
            String  imagePath,
            String  transactionStatus,
            int     highestPrice,
            Timestamp auctionEndDate
    ){}

    public List<SellingView> getSellingHistory(String sellerId) {
        return repo.findBySellerId(sellerId).stream()
                .map(p -> new SellingView(
                        String.valueOf(p.getProductId()),
                        p.getProductName(),
                        p.getImagePath(),
                        p.getTransactionStatus(),
                        p.getStartingPrice(),   // ▶ 최고가 컬럼 별칭 쓰려면 매퍼에 별칭 추가
                        p.getAuctionEndDate()
                ))
                .sorted(Comparator.comparing(SellingView::auctionEndDate).reversed())
                .toList();
    }
}
