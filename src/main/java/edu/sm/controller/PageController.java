package edu.sm.controller;

import edu.sm.dto.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequiredArgsConstructor
public class PageController {

    // [수정] 마이페이지 관련 서비스 의존성을 모두 MyPageController로 이동시켰습니다.

    @GetMapping({"/", "/index"})
    public String home() {
        return "index";
    }

    @GetMapping("/login")
    public String login() {
        return "pages/login";
    }

    @GetMapping("/signup")
    public String signup() {
        return "pages/signup";
    }

    // [수정] /my-page 매핑을 MyPageController로 이동시켰습니다.

    @GetMapping("/points")
    public String points(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            return "redirect:/login";
        }
        return "pages/points";
    }

    @GetMapping("/sell")
    public String sell(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            return "redirect:/login";
        }
        return "pages/sell";
    }

    @GetMapping("/auction-detail")
    public String detail(@RequestParam("id") String id, Model model, HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            return "redirect:/login";
        }
        model.addAttribute("id", id);
        return "pages/auction-detail";
    }
}