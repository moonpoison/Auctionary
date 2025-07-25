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
public class Review {
    private String reviewerId;
    private int productId;
    private int rating;
    private String content;
    private LocalDateTime reviewDate;
}