package com.blog.controller;

import com.blog.common.Result;
import com.blog.dto.MessageDTO;
import com.blog.entity.Message;
import com.blog.service.MessageService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 留言接口（前台）
 */
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    /**
     * 留言列表（审核通过的）
     * GET /api/messages
     */
    @GetMapping
    public Result<List<Message>> list() {
        return Result.success(messageService.listApproved());
    }

    /**
     * 提交留言
     * POST /api/messages
     */
    @PostMapping
    public Result<Void> submit(@Valid @RequestBody MessageDTO dto, HttpServletRequest request) {
        messageService.submit(dto, getClientIp(request));
        return Result.success();
    }

    /** 获取客户端真实 IP */
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (StringUtils.hasText(ip) && !"unknown".equalsIgnoreCase(ip)) {
            // 多级代理取第一个
            return ip.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
