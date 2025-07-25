package edu.sm.dto;

import lombok.*;

import java.sql.Timestamp;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
@Builder
@Data
public class Category {
    private int categoryId;
    private String categoryName;
    private Integer parentId;
}
