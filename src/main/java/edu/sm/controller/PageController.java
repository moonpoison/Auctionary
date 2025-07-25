
package edu.sm.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

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
}
