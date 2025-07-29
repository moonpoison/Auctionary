package edu.sm.dto;
import java.util.Date;
import lombok.Data;

@Data
public class ActivityLog {
    private String productName;

    private int bidPrice;

    private Date bidDate;
}