package edu.sm.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 기존 uploads 경로
        registry.addResourceHandler("/uploads/**") // 웹에서 접근할 경로
                .addResourceLocations("file:src/main/resources/static/uploads/"); // 실제 파일 시스템 경로

        // 기본 정적 리소스 경로 추가
        registry.addResourceHandler("/**") // 모든 요청에 대해
                .addResourceLocations("classpath:/static/", "classpath:/public/", "classpath:/resources/", "classpath:/META-INF/resources/");
    }
}