package edu.sm.dto;

import lombok.*;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
@Builder
@Data
public class Point_History {
    private int historyId;
    private String userId;
    private String actionType;
    private int pointChange;
    private int finalPoint;
    private Date changeDate;
    private String note;
}