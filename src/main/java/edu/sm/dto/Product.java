package edu.sm.dto;

import lombok.*;

import java.util.Date;

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
    private Date auctionStartDate;
    private Date auctionEndDate;
    private int startingPrice;
    private int bidUnit;
    private String transactionStatus;
}
