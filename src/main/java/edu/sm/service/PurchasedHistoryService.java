package edu.sm.service;

import edu.sm.dto.Product;
import edu.sm.repository.PurchasedHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchasedHistoryService {

    private final PurchasedHistoryRepository repo;

    /** 프런트에 내려줄 뷰‑모델 */
    public record PurchasedView(
            String  productId,
            String  productName,
            String  imagePath,
            int     finalPrice,
            Timestamp auctionEndDate
    ) {}

    public List<PurchasedView> getPurchased(String buyerId) {
        return repo.findByBuyer(buyerId).stream()
                .map(p -> new PurchasedView(
                        String.valueOf(p.getProductId()),
                        p.getProductName(),
                        p.getImagePath(),
                        /* final_price 별칭은 MyBatis가 알 수 없어 ResultSet에서 startingPrice에 담김 */
                        p.getStartingPrice(),    // => mapper에서 AS starting_price 로 alias 주면 편함
                        p.getAuctionEndDate()
                ))
                .sorted(Comparator.comparing(PurchasedView::auctionEndDate).reversed())
                .toList();
    }
}
