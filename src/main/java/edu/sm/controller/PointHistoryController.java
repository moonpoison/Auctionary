package edu.sm.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.sm.dto.Point_History;
import edu.sm.dto.User;
import edu.sm.service.AccountService;
import edu.sm.service.PointHistoryService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.Console;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Controller
@RequestMapping("/points")
public class PointHistoryController {

    @Autowired
    private PointHistoryService pointHistoryService;
    @Autowired
    private ObjectMapper objectMapper;


    @GetMapping("")
    public String points(Model model, HttpServletRequest request) {
        // 세션이 없으면 새로 생성
        HttpSession session = request.getSession(true);
        System.out.println("=== Points Session Check ===");
        System.out.println("Session: " + session.getId());
        System.out.println("Session is new: " + session.isNew());

        User user = (User) session.getAttribute("user");
        System.out.println("User in session: " + user);

        if (user == null) {
            System.out.println("User not found in session, redirecting to login");
            return "redirect:/login";
        }
        System.out.println("User found, proceeding to points");

        //현재 포인트 추출
        String userId = user.getUserId();
        int finalPoint = 0;
        try{
            Point_History latestHistory = pointHistoryService.select(userId);
            if (latestHistory != null) {
                finalPoint = latestHistory.getFinalPoint();
            }
        }catch(Exception e){
            e.printStackTrace();
        }
        model.addAttribute("finalPoint", finalPoint);

        //포인트 내역 추출
        List<Point_History> list = null;
        try{
            list = pointHistoryService.selectAll(userId);
        }catch (Exception e){
            e.printStackTrace();
        }
        try {
            String jsonList = objectMapper.writeValueAsString(list);
            model.addAttribute("list", jsonList);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return "pages/points";
    }

}