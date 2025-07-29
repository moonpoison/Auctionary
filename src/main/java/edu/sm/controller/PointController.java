package edu.sm.controller;

import edu.sm.dto.Point_History;
import edu.sm.dto.User;
import edu.sm.service.AccountService;
import edu.sm.service.PointHistoryService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.awt.*;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/points")
public class PointController {

    @Autowired
    private PointHistoryService pointHistoryService;

    @GetMapping("/getHistory")
    public String getHistory(Model model) throws Exception{
        List<Point_History> list = pointHistoryService.selectAll();
        model.addAttribute("history", list);
        return "pages/points";
    }
    @GetMapping("/getFinalPoint")
    public String getFinalPoint(Model model, HttpSession session) throws Exception{
        User user = (User) session.getAttribute("user");
        String userId = user.getUserId();
        int finalPoint = pointHistoryService.select(userId);
        model.addAttribute("finalPoint", finalPoint);
        return "pages/points";
    }
} 