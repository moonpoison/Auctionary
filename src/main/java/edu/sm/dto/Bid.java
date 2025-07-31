package edu.sm.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bid {
    private String bidUserId;
    private int productId;
    private int bidPrice;
    private LocalDateTime bidDate;
}
