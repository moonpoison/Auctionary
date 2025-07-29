package edu.sm.dto;

import lombok.*;
import java.util.Date; // LocalDateTime 대신 Date를 import 합니다.

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
@Builder
@Data
public class Review {
    // [수정] DDL에 맞게 필드를 조정합니다.
    private int reviewId;
    private int tradeId;
    private String reviewerId;
//    private String revieweeId; // [추가] 리뷰 받는 사람 ID
    private int rating;
    private String content;
    private Date reviewDate; // [수정] 타입을 Date로 변경합니다.
}