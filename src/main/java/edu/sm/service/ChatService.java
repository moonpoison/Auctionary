package edu.sm.service;

import edu.sm.dto.Chat;
import edu.sm.dto.Chat_History;
import edu.sm.repository.ChatRepository;
import edu.sm.repository.ChatHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final ChatHistoryRepository chatHistoryRepository;

    // 사용자의 채팅방 목록 조회
    public List<Map<String, Object>> getConversationsByUserId(String userId) {
        try {
            System.out.println("=== ChatService Debug ===");
            System.out.println("Looking for conversations for userId: " + userId);
            
            List<Chat> conversations = chatRepository.findBySenderIdOrReceiverId(userId);
            System.out.println("Found " + conversations.size() + " conversations");
            
            return conversations.stream().map(chat -> {
                Map<String, Object> conversation = new HashMap<>();
                conversation.put("chatId", chat.getChatId());
                conversation.put("productId", chat.getProductId());
                conversation.put("senderId", chat.getSenderId());
                conversation.put("receiverId", chat.getReceiverId());
                
                // 마지막 메시지 조회
                List<Chat_History> messages = chatHistoryRepository.findByChatIdOrderBySendDateDesc(chat.getChatId());
                if (!messages.isEmpty()) {
                    Chat_History lastMessage = messages.get(0);
                    conversation.put("lastMessage", lastMessage.getContent());
                    conversation.put("lastMessageTime", lastMessage.getSendDate());
                }
                
                // 읽지 않은 메시지 수
                long unreadCount = chatHistoryRepository.countByChatIdAndSenderIdNotAndReadFalse(chat.getChatId(), userId);
                conversation.put("unreadCount", unreadCount);
                
                return conversation;
            }).collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("=== ChatService Error ===");
            e.printStackTrace();
            throw e;
        }
    }

    // 채팅방의 메시지 조회
    public List<Chat_History> getMessagesByChatId(int chatId) {
        return chatHistoryRepository.findByChatIdOrderBySendDateAsc(chatId);
    }

    // 메시지 전송
    public Chat_History sendMessage(String senderId, String receiverId, int productId, String content) {
        // 채팅방 생성 또는 조회
        Chat chat = createOrGetConversation(senderId, receiverId, productId);
        
        // 메시지 저장
        Chat_History message = Chat_History.builder()
                .chatId(chat.getChatId())
                .senderId(senderId)
                .content(content)
                .sendDate(LocalDateTime.now())
                .read(false)
                .build();
        
        chatHistoryRepository.save(message);
        return message;
    }

    // 채팅방 생성 또는 조회
    public Chat createOrGetConversation(String senderId, String receiverId, int productId) {
        try {
            System.out.println("=== ChatService Debug ===");
            System.out.println("Creating/Getting conversation for:");
            System.out.println("senderId: " + senderId);
            System.out.println("receiverId: " + receiverId);
            System.out.println("productId: " + productId);
            
            // 기존 채팅방 조회
            Optional<Chat> existingChatOpt = chatRepository.findBySenderIdAndReceiverIdAndProductId(senderId, receiverId, productId);
            if (existingChatOpt.isPresent()) {
                System.out.println("Found existing chat: " + existingChatOpt.get());
                return existingChatOpt.get();
            }
            
            // 반대 방향으로도 조회
            existingChatOpt = chatRepository.findBySenderIdAndReceiverIdAndProductId(receiverId, senderId, productId);
            if (existingChatOpt.isPresent()) {
                System.out.println("Found existing chat (reverse): " + existingChatOpt.get());
                return existingChatOpt.get();
            }
            
            // 새 채팅방 생성
            Chat newChat = Chat.builder()
                    .senderId(senderId)
                    .receiverId(receiverId)
                    .productId(productId)
                    .build();
            
            System.out.println("Creating new chat: " + newChat);
            chatRepository.save(newChat);
            System.out.println("Chat saved successfully");
            
            return newChat;
        } catch (Exception e) {
            System.err.println("=== ChatService Error ===");
            e.printStackTrace();
            throw e;
        }
    }

    // 메시지 읽음 처리
    public void markMessageAsRead(int messageId) {
        Optional<Chat_History> messageOpt = chatHistoryRepository.findById(messageId);
        if (messageOpt.isPresent()) {
            Chat_History message = messageOpt.get();
            // 읽음 처리 로직 구현 (Chat_History에 read 필드가 있다면)
            // message.setRead(true);
            // chatHistoryRepository.save(message);
        }
    }
    
    // 채팅방 정보 조회
    public Map<String, Object> getChatInfo(int chatId) {
        Optional<Chat> chatOpt = chatRepository.findById(chatId);
        if (!chatOpt.isPresent()) {
            throw new RuntimeException("Chat room not found");
        }
        
        Chat chat = chatOpt.get();
        Map<String, Object> chatInfo = new HashMap<>();
        chatInfo.put("chatId", chat.getChatId());
        chatInfo.put("senderId", chat.getSenderId());
        chatInfo.put("receiverId", chat.getReceiverId());
        chatInfo.put("productId", chat.getProductId());
        
        return chatInfo;
    }
} 