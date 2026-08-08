package com.blog.controller;

import com.blog.common.Result;
import com.blog.dto.CommentDTO;
import com.blog.entity.Comment;
import com.blog.service.CommentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 评论接口（前台）
 */
@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    /**
     * 最新评论（默认取 5 条）
     * GET /api/comments/recent
     */
    @GetMapping("/recent")
    public Result<List<Comment>> recent(@RequestParam(defaultValue = "5") int limit) {
        return Result.success(commentService.recent(limit));
    }

    /**
     * 某篇文章的评论列表（审核通过的）
     * GET /api/comments?articleId=x
     */
    @GetMapping
    public Result<List<Comment>> listByArticle(@RequestParam Long articleId) {
        return Result.success(commentService.listByArticle(articleId));
    }

    /**
     * 提交评论
     * POST /api/comments
     */
    @PostMapping
    public Result<Void> submit(@Valid @RequestBody CommentDTO dto, HttpServletRequest request) {
        commentService.submit(dto, getClientIp(request));
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
