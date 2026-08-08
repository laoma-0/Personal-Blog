package com.blog.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * JWT 配置属性（对应 application.yml 的 blog.jwt.*）
 */
@Data
@Component
@ConfigurationProperties(prefix = "blog.jwt")
public class JwtProperties {

    /** 签名密钥 */
    private String secret;

    /** 过期时间（毫秒） */
    private Long expire;

    /** 请求头名称 */
    private String header;

    /** token 前缀 */
    private String prefix;
}
