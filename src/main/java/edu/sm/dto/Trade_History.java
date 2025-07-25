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
public class Trade_History {
    private String userId;
    private int productId;
    private LocalDateTime tradeDate;
    private String tradeType;
    private String tradeStatus;
}