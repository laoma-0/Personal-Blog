package com.blog.tool;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * 一次性工具：生成 BCrypt 密码哈希。
 * 用法：java -cp ... com.blog.tool.PasswordHashGenerator 你的明文密码
 */
public class PasswordHashGenerator {
    public static void main(String[] args) {
        String raw = args.length > 0 ? args[0] : "123456";
        String hash = new BCryptPasswordEncoder().encode(raw);
        System.out.println("RAW=" + raw);
        System.out.println("HASH=" + hash);
    }
}
