package com.blog.controller;

import com.blog.common.Result;
import com.blog.entity.Tag;
import com.blog.service.TagService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 标签接口（前台）
 */
@RestController
@RequestMapping("/api/tags")
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    /**
     * 标签列表
     * GET /api/tags
     */
    @GetMapping
    public Result<List<Tag>> list() {
        return Result.success(tagService.list());
    }

    /**
     * 提交标签
     * POST /api/tags
     */
    @PostMapping
    public Result<Tag> submit(@RequestBody Tag tag) {
        return Result.success(tagService.submit(tag));
    }


}
