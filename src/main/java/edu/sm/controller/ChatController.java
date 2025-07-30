package edu.sm.controller;

import edu.sm.dto.Chat;
import edu.sm.dto.Chat_History;
import edu.sm.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    // 채팅방 목록 조회
    @GetMapping("/conversations")
    public ResponseEntity<List<Map<String, Object>>> getConversations(@RequestParam String userId) {
        try {
            System.out.println("=== Chat API Debug ===");
            System.out.println("Requested userId: " + userId);
            
            List<Map<String, Object>> conversations = chatService.getConversationsByUserId(userId);
            System.out.println("Found conversations: " + conversations.size());
            
            return ResponseEntity.ok(conversations);
        } catch (Exception e) {
            System.err.println("=== Chat API Error ===");
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 특정 채팅방의 메시지 조회
    @GetMapping("/conversations/{chatId}/messages")
    public ResponseEntity<List<Chat_History>> getMessages(@PathVariable int chatId) {
        try {
            List<Chat_History> messages = chatService.getMessagesByChatId(chatId);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 메시지 전송
    @PostMapping("/send")
    public ResponseEntity<Chat_History> sendMessage(@RequestBody Map<String, Object> request) {
        try {
            String senderId = (String) request.get("senderId");
            String receiverId = (String) request.get("receiverId");
            int productId = (Integer) request.get("productId");
            String content = (String) request.get("content");

            Chat_History message = chatService.sendMessage(senderId, receiverId, productId, content);
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 채팅방 생성 또는 조회
    @PostMapping("/conversations")
    public ResponseEntity<Chat> createOrGetConversation(@RequestBody Map<String, Object> request) {
        try {
            System.out.println("=== Create Chat Room Debug ===");
            System.out.println("Request: " + request);
            
            String senderId = (String) request.get("senderId");
            String receiverId = (String) request.get("receiverId");
            int productId = (Integer) request.get("productId");
            
            System.out.println("senderId: " + senderId);
            System.out.println("receiverId: " + receiverId);
            System.out.println("productId: " + productId);

            Chat conversation = chatService.createOrGetConversation(senderId, receiverId, productId);
            System.out.println("Created conversation: " + conversation);
            
            return ResponseEntity.ok(conversation);
        } catch (Exception e) {
            System.err.println("=== Create Chat Room Error ===");
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 메시지 읽음 처리
    @PutMapping("/messages/{messageId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable int messageId) {
        try {
            chatService.markMessageAsRead(messageId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 채팅방 정보 조회
    @GetMapping("/conversations/{chatId}/info")
    public ResponseEntity<Map<String, Object>> getChatInfo(@PathVariable int chatId) {
        try {
            Map<String, Object> chatInfo = chatService.getChatInfo(chatId);
            return ResponseEntity.ok(chatInfo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 