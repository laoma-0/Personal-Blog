package com.blog;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 个人博客系统 启动类
 */
@SpringBootApplication
@MapperScan("com.blog.mapper")
public class PersonalBlogApplication {

    public static void main(String[] args) {
        SpringApplication.run(PersonalBlogApplication.class, args);
        System.out.println("""

                ==========================================
                  个人博客系统后端启动成功！
                  接口地址: http://localhost:8080
                ==========================================
                """);
    }
}
