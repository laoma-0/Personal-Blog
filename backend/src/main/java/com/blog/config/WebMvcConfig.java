package com.blog.config;

import com.blog.interceptor.JwtInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;
import java.nio.file.Paths;

/**
 * Web MVC 配置：跨域 + 拦截器 + 上传文件静态映射
 * 开发阶段前端 Vite 默认在 5173 端口，需允许跨域访问。
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    private final JwtInterceptor jwtInterceptor;
    private final UploadProperties uploadProperties;

    public WebMvcConfig(JwtInterceptor jwtInterceptor, UploadProperties uploadProperties) {
        this.jwtInterceptor = jwtInterceptor;
        this.uploadProperties = uploadProperties;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 只拦截后台管理接口，前台接口（文章、登录）放行
        registry.addInterceptor(jwtInterceptor)
                .addPathPatterns("/api/admin/**");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 把物理上传目录映射为可访问的 URL：/uploads/** -> 本地目录
        // 生产环境由 Nginx 直接托管该目录时，此映射可作为兜底（本地开发主要靠它）
        String location = Paths.get(uploadProperties.getPath()).toAbsolutePath().toString() + File.separator;
        registry.addResourceHandler(uploadProperties.getUrlPrefix() + "**")
                .addResourceLocations("file:" + location);
    }
}
