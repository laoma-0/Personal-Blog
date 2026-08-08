package com.blog.controller;

import com.blog.common.Result;
import com.blog.config.AiProperties;
import com.blog.dto.ChatDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

/**
 * AI 聊天接口（前台，访客可用，无需登录）
 *
 * 调用 DeepSeek（OpenAI 兼容格式）。API Key 从 blog.ai.api-key 读取，
 * 该值来自环境变量 DEEPSEEK_API_KEY，绝不写死在代码里。
 * 未配置 Key 或调用异常时，退回 mockReply 兜底，助手不会直接崩。
 */
@RestController
@RequestMapping("/api/ai")
public class AiController {

    private static final Logger log = LoggerFactory.getLogger(AiController.class);

    private final AiProperties aiProperties;
    private final RestClient restClient;

    public AiController(AiProperties aiProperties) {
        this.aiProperties = aiProperties;
        this.restClient = RestClient.create();
    }

    /**
     * 发送一条消息，返回 AI 回复
     * POST /api/ai/chat   body: { "message": "你好" }
     */
    @PostMapping("/chat")
    public Result<String> chat(@RequestBody ChatDTO dto) {
        String message = dto.getMessage() == null ? "" : dto.getMessage().trim();
        if (message.isEmpty()) {
            return Result.fail("消息不能为空");
        }
        // 未配置 Key：退回演示回复
        if (!StringUtils.hasText(aiProperties.getApiKey())) {
            log.warn("未配置 DEEPSEEK_API_KEY，返回演示回复");
            return Result.success(mockReply(message));
        }
        try {
            return Result.success(callDeepSeek(message));
        } catch (Exception e) {
            log.error("调用 DeepSeek 失败：{}", e.getMessage(), e);
            return Result.fail("AI 服务暂时不可用，请稍后再试");
        }
    }

    /**
     * 调用 DeepSeek 的 chat/completions 接口（OpenAI 兼容格式）
     */
    @SuppressWarnings("unchecked")
    private String callDeepSeek(String message) {
        // 组装请求体：model + messages(system 设定角色 + user 用户消息)
        Map<String, Object> body = Map.of(
                "model", aiProperties.getModel(),
                "messages", List.of(
                        Map.of("role", "system", "content", aiProperties.getSystemPrompt()),
                        Map.of("role", "user", "content", message)
                ),
                "stream", false
        );

        Map<String, Object> resp = restClient.post()
                .uri(aiProperties.getBaseUrl() + "/chat/completions")
                .header("Authorization", "Bearer " + aiProperties.getApiKey())
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(Map.class);

        // 解析 choices[0].message.content
        if (resp != null && resp.get("choices") instanceof List<?> choices && !choices.isEmpty()) {
            Object first = choices.get(0);
            if (first instanceof Map<?, ?> choice && choice.get("message") instanceof Map<?, ?> msg) {
                Object content = msg.get("content");
                if (content != null) {
                    return content.toString();
                }
            }
        }
        return "抱歉，我没有理解你的问题，可以换个说法吗？";
    }

    /**
     * 模拟回复：未配置 Key 时的兜底，保证界面可用。
     */
    private String mockReply(String message) {
        if (message.contains("你好") || message.contains("hi") || message.contains("hello")) {
            return "你好呀！我是这个博客的 AI 助手（当前为演示模式）。接入真实模型后，我就能认真回答你的问题啦～";
        }
        if (message.contains("博主") || message.contains("作者") || message.contains("你是谁")) {
            return "这是假小光的个人博客，主要分享软件工程学习笔记与生活随笔。等接入 DeepSeek 后，我还能基于文章内容为你解答。";
        }
        return "（演示回复）我收到了你的消息：「" + message + "」。目前还没接入真实大模型，接入 DeepSeek 后这里会返回真正的智能回答。";
    }
}
