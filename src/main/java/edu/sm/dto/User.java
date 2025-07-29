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
public class User {
    private String userId;
    private String name;
    private String password;
    private String birthDate;
    private String phoneNumber;
    private String email;
    private String role;
    private Integer points; // 포인트 필드 추가
    private Timestamp createdAt;
    private Timestamp updatedAt;
}