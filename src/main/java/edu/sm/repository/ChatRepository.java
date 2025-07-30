package edu.sm.repository;

import edu.sm.dto.Chat;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface ChatRepository {

    // 사용자가 참여한 모든 채팅방 조회
    List<Chat> findBySenderIdOrReceiverId(@Param("userId") String userId);

    // 특정 조건의 채팅방 조회
    Optional<Chat> findBySenderIdAndReceiverIdAndProductId(@Param("senderId") String senderId, 
                                                          @Param("receiverId") String receiverId, 
                                                          @Param("productId") int productId);

    // 특정 상품의 채팅방 조회
    List<Chat> findByProductId(@Param("productId") int productId);

    // 채팅방 저장
    void save(Chat chat);

    // 채팅방 ID로 조회
    Optional<Chat> findById(@Param("chatId") int chatId);
} 