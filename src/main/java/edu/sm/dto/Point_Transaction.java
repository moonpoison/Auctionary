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
public class Point_Transaction {
    private String userId;
    private String transactionType;
    private int amount;
    private LocalDateTime requestDate;
    private String status;
    private LocalDateTime processDate;
}