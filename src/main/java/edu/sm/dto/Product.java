package edu.sm.dto;

import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
@Builder
public class Product {
    private int productId;
    private String userId;
    private String productName;
    private String description;
    private String imagePath;
    private int categoryId;
    private LocalDateTime auctionStartDate;
    private LocalDateTime auctionEndDate;
    private int startingPrice;
    private int bidUnit;
    private String transactionStatus;
}
