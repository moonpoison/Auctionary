
package edu.sm.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

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
    public String myPage() {
        return "pages/my-page";
    }

    @GetMapping("/points")
    public String points() {
        return "pages/points";
    }

    @GetMapping("/sell")
    public String sell() {
        return "pages/sell";
    }

    @GetMapping("/auction-detail")
    public String detail(@RequestParam("id") String id, Model model) {
        model.addAttribute("id", id);
        return "pages/auction-detail";
    }
}
