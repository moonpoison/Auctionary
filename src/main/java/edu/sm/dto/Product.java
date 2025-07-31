package edu.sm.dto;

import lombok.*;

import java.sql.Timestamp;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
@Builder
@Data
public class Product {
    private int productId;
    private String productName;
    private String description;
    private String imagePath;
    private int categoryId;
    private Timestamp auctionStartDate;
    private Timestamp auctionEndDate;
    private int startingPrice;
    private int bidUnit;
    private String registerUserId;
    private String registerUserName;
    private String transactionStatus;
}
//product_id, product_name, description, image_path, category_id, auction_start_date, acution_end_date, starting_price, bid_unit, register_user_id(user_id), transaction_status