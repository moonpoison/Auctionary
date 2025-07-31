package edu.sm.dto;

import lombok.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
@Builder
@Data
public class Bid {
    private String bidUserId;
    private int productId;
    private int bidPrice;
    private LocalDateTime bidDate;
}