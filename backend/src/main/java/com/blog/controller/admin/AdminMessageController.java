package com.blog.controller.admin;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.blog.common.Result;
import com.blog.entity.Message;
import com.blog.service.MessageService;
import org.springframework.web.bind.annotation.*;

/**
 * 留言管理接口（后台，需 JWT 鉴权）
 */
@RestController
@RequestMapping("/api/admin/messages")
public class AdminMessageController {

    private final MessageService messageService;

    public AdminMessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    /**
     * 后台留言分页
     * GET /api/admin/messages?pageNum=1&pageSize=10&status=
     */
    @GetMapping
    public Result<IPage<Message>> list(
            @RequestParam(defaultValue = "1") long pageNum,
            @RequestParam(defaultValue = "10") long pageSize,
            @RequestParam(required = false) Integer status) {
        return Result.success(messageService.adminPage(pageNum, pageSize, status));
    }

    /**
     * 修改留言状态（1 通过 / 2 拒绝）
     * PUT /api/admin/messages/{id}/status?status=1
     */
    @PutMapping("/{id}/status")
    public Result<Void> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        messageService.updateStatus(id, status);
        return Result.success();
    }

    /**
     * 删除留言
     * DELETE /api/admin/messages/{id}
     */
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        messageService.remove(id);
        return Result.success();
    }
}
