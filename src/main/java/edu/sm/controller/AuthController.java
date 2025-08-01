package edu.sm.controller;

import edu.sm.dto.User;
import edu.sm.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jakarta.servlet.http.HttpServletRequest;

@Controller
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AccountService accountService;

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
    public Map<String, Object> signup(@RequestBody User user, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 중복 아이디 체크
            User existingUser = accountService.select(user.getUserId());
            if (existingUser != null) {
                response.put("success", false);
                response.put("message", "이미 존재하는 아이디입니다.");
                return response;
            }
            
            // 중복 이메일 체크
            List<User> allUsers = accountService.selectAll();
            for (User existing : allUsers) {
                if (existing.getEmail().equals(user.getEmail())) {
                    response.put("success", false);
                    response.put("message", "이미 존재하는 이메일입니다.");
                    return response;
                }
            }
            
            user.setRole("USER");
            user.setPoints(1000); // 기본 포인트 설정
            user.setCreatedAt(new Timestamp(System.currentTimeMillis()));
            user.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
            
            // 회원가입 처리
            accountService.insert(user);
            
            // 회원가입 성공 후 자동 로그인 처리
            session.setAttribute("user", user);
            
            response.put("success", true);
            response.put("message", "회원가입이 완료되었습니다. 자동으로 로그인되었습니다.");
            response.put("user", user);
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
            User user = accountService.select(userId);
            user.setPoints(0);
            
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
            
            // 세션 디버깅을 위한 로그
            System.out.println("=== Login Success Debug ===");
            System.out.println("Session ID: " + session.getId());
            System.out.println("User saved to session: " + user.getUserId());
            System.out.println("Session user attribute: " + session.getAttribute("user"));
            System.out.println("Session creation time: " + session.getCreationTime());
            System.out.println("Session last accessed time: " + session.getLastAccessedTime());
            System.out.println("Session max inactive interval: " + session.getMaxInactiveInterval());
            System.out.println("Session is new: " + session.isNew());
            System.out.println("All session attributes: " + java.util.Collections.list(session.getAttributeNames()));
            
            // 응답에 더 자세한 정보 포함
            response.put("success", true);
            response.put("message", "로그인되었습니다.");
            response.put("user", user);
            response.put("sessionId", session.getId());
            response.put("sessionIsNew", session.isNew());
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
    public Map<String, Object> getCurrentUser(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        // 세션이 없으면 새로 생성
        HttpSession session = request.getSession(true);
        
        System.out.println("=== getCurrentUser called ===");
        System.out.println("Session ID: " + session.getId());
        System.out.println("Session is new: " + session.isNew());
        System.out.println("All session attributes: " + java.util.Collections.list(session.getAttributeNames()));
        
        User user = (User) session.getAttribute("user");
        System.out.println("User in session: " + user);
        
        if (user != null) {
            System.out.println("User found, returning user data");
            response.put("success", true);
            response.put("user", user);
        } else {
            System.out.println("No user in session");
            response.put("success", false);
            response.put("message", "로그인되지 않았습니다.");
        }
        
        return response;
    }

    // 세션 확인 엔드포인트
    @GetMapping("/check")
    @ResponseBody
    public Map<String, Object> checkSession(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        HttpSession session = request.getSession(false);
        
        if (session != null) {
            User user = (User) session.getAttribute("user");
            if (user != null) {
                response.put("loggedIn", true);
                response.put("userId", user.getUserId());
                response.put("userName", user.getName());
                response.put("sessionId", session.getId());
            } else {
                response.put("loggedIn", false);
                response.put("message", "세션에 사용자 정보가 없습니다.");
            }
        } else {
            response.put("loggedIn", false);
            response.put("message", "세션이 없습니다.");
        }
        
        return response;
    }
} 