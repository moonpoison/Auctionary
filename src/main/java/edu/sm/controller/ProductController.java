package edu.sm.controller;

import edu.sm.dto.Product;
import edu.sm.dto.User;
import edu.sm.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpSession;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    // Resolve the absolute path to the static/images directory
    private final Path imageStorageDir = Paths.get("src/main/resources/static/images").toAbsolutePath();

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        try {
            List<Product> products = productService.selectAll();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping
    public ResponseEntity<?> registerProduct(@RequestBody Product product, HttpSession session) {
        // ✅ 로그인된 유저 정보 추출
        User loggedInUser = (User) session.getAttribute("user");

        if (loggedInUser == null) {
            return ResponseEntity.status(401).body("로그인된 사용자만 상품을 등록할 수 있습니다.");
        }

        try {
            // ✅ DB에 저장할 때 로그인한 유저의 ID로 등록자 설정
            product.setRegisterUserId(loggedInUser.getUserId());

            productService.saveProduct(product);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("상품 등록 실패: " + e.getMessage());
        }
    }

    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile image) {
        if (image.isEmpty()) {
            return ResponseEntity.badRequest().body("Image file is empty");
        }

        try {
            // Ensure the storage directory exists
            File storageDir = imageStorageDir.toFile();
            if (!storageDir.exists()) {
                storageDir.mkdirs();
            }

            // Create a unique filename to avoid collisions
            String originalFilename = image.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

            // Save the file
            File destFile = new File(storageDir, uniqueFilename);
            image.transferTo(destFile);

            // Return the web-accessible path
            String imageUrl = "/images/" + uniqueFilename;
            return ResponseEntity.ok().body(imageUrl);

        } catch (IOException e) {
            // Log the exception
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to upload image: " + e.getMessage());
        }
    }
}
