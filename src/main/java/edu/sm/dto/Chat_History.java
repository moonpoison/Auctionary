package edu.sm.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Chat_History {
    private int messageId;
    private int chatId;
    private String senderId;
    private String content;
    private LocalDateTime sendDate;

    @Builder.Default
    private boolean read = false;
}
