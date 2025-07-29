package edu.sm.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Collections;

public class LoginInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 인터셉터 비활성화 - 모든 요청을 통과시킴
        System.out.println("=== LoginInterceptor Disabled ===");
        System.out.println("Request URI: " + request.getRequestURI());
        System.out.println("Interceptor disabled, allowing all requests");
        return true; // 모든 요청을 통과시킴
    }
} 