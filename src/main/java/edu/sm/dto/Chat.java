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
public class Chat {
    private int chatId;
    private String senderId;
    private String receiverId;
    private int productId;
}