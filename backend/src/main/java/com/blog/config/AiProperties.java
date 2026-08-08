package com.blog.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * AI 配置属性（对应 application.yml 的 blog.ai.*）
 */
@Data
@Component
@ConfigurationProperties(prefix = "blog.ai")
public class AiProperties {

    /** DeepSeek API Key（从环境变量注入） */
    private String apiKey;

    /** 接口地址（OpenAI 兼容） */
    private String baseUrl;

    /** 模型名称 */
    private String model;

    /** 系统提示词 */
    private String systemPrompt;
}
