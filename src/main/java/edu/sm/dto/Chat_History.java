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
public class Chat_History {
    private int messageId;
    private int chatId;
    private String senderId;
    private String content;
    private LocalDateTime sendDate;
    private boolean read;
}