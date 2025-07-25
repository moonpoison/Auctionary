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
public class Answer {
    private int inquiryId;
    private String adminId;
    private String replyTitle;
    private String replyContent;
    private LocalDateTime replyCreateDate;
}