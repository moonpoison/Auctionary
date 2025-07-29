package edu.sm.service;

import edu.sm.dto.Product;
import edu.sm.repository.TradeHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TradeHistoryService {

    private final TradeHistoryRepository tradeHistoryRepository;

    public List<Product> getPurchasedProducts(String userId) {
        return tradeHistoryRepository.findPurchasedProductsByUserId(userId);
    }
}