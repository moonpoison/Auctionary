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
    private String password;
    private Timestamp birthDate;
    private String phoneNumber;
    private String email;
    private String role;
}