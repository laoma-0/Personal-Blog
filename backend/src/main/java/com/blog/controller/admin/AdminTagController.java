package com.blog.controller.admin;

import com.blog.common.Result;
import com.blog.entity.Tag;
import com.blog.service.TagService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 标签管理接口（后台，需 JWT 鉴权）
 */
@RestController
@RequestMapping("/api/admin/tags")
public class AdminTagController {

    private final TagService tagService;

    public AdminTagController(TagService tagService) {
        this.tagService = tagService;
    }

    /**
     * 标签列表
     * GET /api/admin/tags
     */
    @GetMapping
    public Result<List<Tag>> list() {
        return Result.success(tagService.list());
    }

    /**
     * 新增标签
     * POST /api/admin/tags
     */
    @PostMapping
    public Result<Void> add(@RequestBody Tag tag) {
        tagService.add(tag);
        return Result.success();
    }

    /**
     * 删除标签
     * DELETE /api/admin/tags/{id}
     */
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        tagService.delete(id);
        return Result.success();
    }
}
