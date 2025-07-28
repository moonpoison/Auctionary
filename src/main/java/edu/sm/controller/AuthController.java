package edu.sm.controller;

import edu.sm.dto.User;
import edu.sm.service.CustService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private CustService custService;

    // 회원가입 페이지
    @GetMapping("/signup")
    public String signupPage() {
        return "pages/signup";
    }

    // 로그인 페이지
    @GetMapping("/login")
    public String loginPage() {
        return "pages/login";
    }

    // 회원가입 처리
    @PostMapping("/signup")
    @ResponseBody
    public Map<String, Object> signup(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 중복 아이디 체크
            User existingUser = custService.select(user.getUserId());
            if (existingUser != null) {
                response.put("success", false);
                response.put("message", "이미 존재하는 아이디입니다.");
                return response;
            }
            
            // 중복 이메일 체크
            List<User> allUsers = custService.selectAll();
            for (User existing : allUsers) {
                if (existing.getEmail().equals(user.getEmail())) {
                    response.put("success", false);
                    response.put("message", "이미 존재하는 이메일입니다.");
                    return response;
                }
            }
            
            user.setRole("USER");
            user.setCreatedAt(new Timestamp(System.currentTimeMillis()));
            user.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
            
            // 회원가입 처리
            custService.insert(user);
            
            response.put("success", true);
            response.put("message", "회원가입이 완료되었습니다.");
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "회원가입 중 오류가 발생했습니다: " + e.getMessage());
        }
        
        return response;
    }

    // 로그인 처리
    @PostMapping("/login")
    @ResponseBody
    public Map<String, Object> login(@RequestBody Map<String, String> loginData, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String userId = loginData.get("userId");
            String password = loginData.get("password");
            
            // 사용자 조회
            User user = custService.select(userId);
            
            if (user == null) {
                response.put("success", false);
                response.put("message", "존재하지 않는 아이디입니다.");
                return response;
            }
            
            // 비밀번호 확인
            if (!user.getPassword().equals(password)) {
                response.put("success", false);
                response.put("message", "비밀번호가 일치하지 않습니다.");
                return response;
            }
            
            // 세션에 사용자 정보 저장
            session.setAttribute("user", user);
            
            response.put("success", true);
            response.put("message", "로그인되었습니다.");
            response.put("user", user);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "로그인 중 오류가 발생했습니다: " + e.getMessage());
        }
        
        return response;
    }

    // 로그아웃
    @PostMapping("/logout")
    @ResponseBody
    public Map<String, Object> logout(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        
        session.invalidate();
        
        response.put("success", true);
        response.put("message", "로그아웃되었습니다.");
        
        return response;
    }

    // 현재 로그인된 사용자 정보 조회
    @GetMapping("/current-user")
    @ResponseBody
    public Map<String, Object> getCurrentUser(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        
        User user = (User) session.getAttribute("user");
        if (user != null) {
            response.put("success", true);
            response.put("user", user);
        } else {
            response.put("success", false);
            response.put("message", "로그인되지 않았습니다.");
        }
        
        return response;
    }
} 