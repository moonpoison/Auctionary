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
public class Point_History {
    private String userId;
    private String actionType;
    private int pointChange;
    private int finalPoint;
    private LocalDateTime changeDate;
    private String note;
}
