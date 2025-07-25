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
public class Inquiry {
    private int inquiryId;
    private String inquiryUserId;
    private String inquiryTitle;
    private String inquiryContent;
    private LocalDateTime createDate;
}