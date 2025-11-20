package com.example.practiceBack.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 환경변수나 시스템 속성에서 경로 가져오기
        String root = System.getProperty("app.upload-dir",
                System.getenv().getOrDefault("APP_UPLOAD_DIR", "C:/myapp/uploads"));

        // 경로 문자열 다듬기
        String location = "file:///" + root.replace("\\", "/") + "/";

        // /uploads/** 요청이 오면 위 로컬 경로와 매핑
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(location);
    }
}