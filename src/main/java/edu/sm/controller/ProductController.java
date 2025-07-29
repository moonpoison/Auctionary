
package edu.sm.controller;

import edu.sm.dto.Product;
import edu.sm.dto.User;
import edu.sm.service.ProductService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Enumeration;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping
    public Product createProduct(@RequestBody Product product, HttpSession session) {
        // 디버깅 로그 추가
        System.out.println("=== ProductController Session Check ===");
        System.out.println("Session ID: " + session.getId());
        System.out.println("Session is new: " + session.isNew());
        Enumeration<String> attributeNames = session.getAttributeNames();
        while (attributeNames.hasMoreElements()) {
            String name = attributeNames.nextElement();
            System.out.println("Session Attribute: " + name + " = " + session.getAttribute(name));
        }
        System.out.println("=====================================");

        User loggedInUser = (User) session.getAttribute("user");
        if (loggedInUser != null) {
            product.setUserId(loggedInUser.getUserId());
        } else {
            throw new RuntimeException("로그인된 사용자만 상품을 등록할 수 있습니다.");
        }
        return productService.createProduct(product);
    }
}
