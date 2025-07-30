package edu.sm.repository;

import edu.sm.dto.Chat_History;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface ChatHistoryRepository {

    // 채팅방의 메시지를 시간순으로 조회
    List<Chat_History> findByChatIdOrderBySendDateAsc(@Param("chatId") int chatId);

    // 채팅방의 메시지를 최신순으로 조회
    List<Chat_History> findByChatIdOrderBySendDateDesc(@Param("chatId") int chatId);

    // 읽지 않은 메시지 수 조회
    long countByChatIdAndSenderIdNotAndReadFalse(@Param("chatId") int chatId, @Param("userId") String userId);

    // 특정 채팅방의 읽지 않은 메시지 조회
    List<Chat_History> findByChatIdAndReadFalse(@Param("chatId") int chatId);

    // 메시지 저장
    void save(Chat_History message);

    // 메시지 ID로 조회
    Optional<Chat_History> findById(@Param("messageId") int messageId);
} 