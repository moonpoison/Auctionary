package edu.sm.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    // 인터셉터 제거 - 컨트롤러에서 세션 체크

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/**") // 클라이언트가 접근할 URL
                .addResourceLocations("file:src/main/resources/static/images/"); // 실제 파일 경로
    }
}