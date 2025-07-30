package edu.sm.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.sm.dto.Point_History;
import edu.sm.dto.Point_Transaction;
import edu.sm.dto.User;
import edu.sm.service.PointHistoryService;
import edu.sm.service.PointTransactionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Controller
public class PointTransactionController {

    @Autowired
    private PointHistoryService pointHistoryService;
    @Autowired
    private PointTransactionService pointTransactionService;
    @Autowired
    private ObjectMapper objectMapper;


    @PostMapping("/InsertCharge")
    @ResponseBody
    public Map<String, Object> insertCharge(@RequestBody Map<String, Object> request, Model model, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        User user = (User) session.getAttribute("user");
        String userId = user.getUserId();
        int amount = (int) request.get("amount");
        String method = (String) request.get("method");
        int finalPoint = 0;
        try{
            finalPoint = pointHistoryService.select(userId);
        }catch(Exception e){
            e.printStackTrace();
        }
        System.out.println("User in session: " + userId);
        try{
            Point_History pointHistory = Point_History.builder()
                                            .userId(userId)
                                            .actionType("charge")
                                            .pointChange(amount)
                                            .finalPoint(finalPoint+amount)
                                            .note(method+" 충전")
                                            .build();
            Point_Transaction pointTransaction = Point_Transaction.builder()
                                                    .userId(userId)
                                                    .amount(amount)
                                                    .transactionType("CHARGE")
                                                    .status("REQUESTED")
                                                    .build();
            System.out.println("Point Transaction: " + pointTransaction);
            pointTransactionService.insert(pointTransaction);
            pointHistoryService.insert(pointHistory);
            int finalPointAfterCharge = pointHistoryService.select(userId);
            response.put("status", "success");
            response.put("finalPointAfterCharge", finalPointAfterCharge);
        }catch(Exception e){
            e.printStackTrace();
            response.put("status", "fail");
        }
        return response;
    }

    @PostMapping("/InsertWithdraw")
    @ResponseBody
    public Map<String, Object> insertWithdraw(@RequestBody Map<String, Object> request, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        try {
            User user = (User) session.getAttribute("user");
            String userId = user.getUserId();
            int amount = (int) request.get("amount");
            String account = (String) request.get("account");

            // 현재 포인트 조회
            int finalPoint = pointHistoryService.select(userId);
            if (finalPoint < amount) {
                response.put("status", "fail");
                response.put("message", "포인트가 부족합니다.");
                return response;
            }

            // 히스토리 & 트랜잭션 기록
            Point_History pointHistory = Point_History.builder()
                    .userId(userId)
                    .actionType("withdraw")
                    .pointChange(-amount)
                    .finalPoint(finalPoint - amount)
                    .note("출금 신청 - 계좌: " + account)
                    .build();

            Point_Transaction pointTransaction = Point_Transaction.builder()
                    .userId(userId)
                    .amount(amount)
                    .transactionType("REFUND")
                    .status("REQUESTED")
                    .build();

            pointTransactionService.insert(pointTransaction);
            pointHistoryService.insert(pointHistory);

            // 최신 포인트 조회
            int finalPointAfterWithdraw = pointHistoryService.select(userId);

            response.put("status", "success");
            response.put("finalPointAfterWithdraw", finalPointAfterWithdraw);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("status", "fail");
            response.put("message", "출금 처리 중 오류 발생");
        }
        return response;
    }

}