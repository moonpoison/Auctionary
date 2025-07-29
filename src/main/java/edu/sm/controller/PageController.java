
package edu.sm.controller;

import edu.sm.dto.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Controller
public class PageController {

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

    @GetMapping("/my-page")
    public String myPage(HttpServletRequest request) {
        // 세션이 없으면 새로 생성
        HttpSession session = request.getSession(true);
        System.out.println("=== MyPage Session Check ===");
        System.out.println("Session: " + session.getId());
        System.out.println("Session is new: " + session.isNew());
        System.out.println("Session creation time: " + session.getCreationTime());
        System.out.println("Session last accessed time: " + session.getLastAccessedTime());
        
        User user = (User) session.getAttribute("user");
        System.out.println("User in session: " + user);
        System.out.println("All session attributes: " + java.util.Collections.list(session.getAttributeNames()));
        
        if (user == null) {
            System.out.println("User not found in session, redirecting to login");
            return "redirect:/login";
        }
        System.out.println("User found, proceeding to my-page");
        return "pages/my-page";
    }

    @GetMapping("/sell")
    public String sell(HttpServletRequest request) {
        // 세션이 없으면 새로 생성
        HttpSession session = request.getSession(true);
        System.out.println("=== Sell Session Check ===");
        System.out.println("Session: " + session.getId());
        System.out.println("Session is new: " + session.isNew());
        
        User user = (User) session.getAttribute("user");
        System.out.println("User in session: " + user);
        
        if (user == null) {
            System.out.println("User not found in session, redirecting to login");
            return "redirect:/login";
        }
        System.out.println("User found, proceeding to sell");
        return "pages/sell";
    }

    @GetMapping("/auction-detail")
    public String detail(@RequestParam("id") String id, Model model, HttpServletRequest request) {
        // 세션이 없으면 새로 생성
        HttpSession session = request.getSession(true);
        System.out.println("=== Auction Detail Session Check ===");
        System.out.println("Session: " + session.getId());
        System.out.println("Session is new: " + session.isNew());
        
        User user = (User) session.getAttribute("user");
        System.out.println("User in session: " + user);
        
        if (user == null) {
            System.out.println("User not found in session, redirecting to login");
            return "redirect:/login";
        }
        System.out.println("User found, proceeding to auction-detail");
        model.addAttribute("id", id);
        return "pages/auction-detail";
    }
}
