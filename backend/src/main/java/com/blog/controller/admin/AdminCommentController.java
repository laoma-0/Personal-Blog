package com.blog.controller.admin;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.blog.common.Result;
import com.blog.entity.Comment;
import com.blog.service.CommentService;
import org.springframework.web.bind.annotation.*;

/**
 * 评论管理接口（后台，需 JWT 鉴权）
 */
@RestController
@RequestMapping("/api/admin/comments")
public class AdminCommentController {

    private final CommentService commentService;

    public AdminCommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    /**
     * 后台评论分页
     * GET /api/admin/comments?pageNum=1&pageSize=10&status=
     */
    @GetMapping
    public Result<IPage<Comment>> list(
            @RequestParam(defaultValue = "1") long pageNum,
            @RequestParam(defaultValue = "10") long pageSize,
            @RequestParam(required = false) Integer status) {
        return Result.success(commentService.adminPage(pageNum, pageSize, status));
    }

    /**
     * 修改评论状态（1 通过 / 2 拒绝）
     * PUT /api/admin/comments/{id}/status?status=1
     */
    @PutMapping("/{id}/status")
    public Result<Void> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        commentService.updateStatus(id, status);
        return Result.success();
    }

    /**
     * 删除评论
     * DELETE /api/admin/comments/{id}
     */
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        commentService.remove(id);
        return Result.success();
    }
}
