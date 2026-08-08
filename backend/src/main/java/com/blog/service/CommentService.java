package com.blog.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.blog.dto.CommentDTO;
import com.blog.entity.Comment;
import com.blog.mapper.CommentMapper;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 评论业务
 */
@Service
public class CommentService {

    private final CommentMapper commentMapper;

    public CommentService(CommentMapper commentMapper) {
        this.commentMapper = commentMapper;
    }

    /**
     * 最新评论（只取审核通过的，按时间倒序取前 limit 条）
     */
    public List<Comment> recent(int limit) {
        LambdaQueryWrapper<Comment> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Comment::getStatus, 1)
                .orderByDesc(Comment::getCreateTime)
                .last("limit " + limit);
        return commentMapper.selectList(wrapper);
    }

    /**
     * 某篇文章的评论（只返回审核通过的，按时间正序，早的在前）
     */
    public List<Comment> listByArticle(Long articleId) {
        LambdaQueryWrapper<Comment> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Comment::getArticleId, articleId)
                .eq(Comment::getStatus, 1)
                .orderByAsc(Comment::getCreateTime);
        return commentMapper.selectList(wrapper);
    }

    /**
     * 提交评论（默认待审核）
     */
    public void submit(CommentDTO dto, String ip) {
        Comment comment = new Comment();
        comment.setArticleId(dto.getArticleId());
        comment.setParentId(dto.getParentId() == null ? 0L : dto.getParentId());
        comment.setNickname(dto.getNickname());
        comment.setEmail(dto.getEmail());
        comment.setContent(dto.getContent());
        comment.setIp(ip);
        comment.setStatus(0); // 待审核
        commentMapper.insert(comment);
    }

    // ==================== 后台管理 ====================

    /**
     * 后台评论分页（全状态，支持状态筛选，按时间倒序）
     */
    public IPage<Comment> adminPage(long pageNum, long pageSize, Integer status) {
        LambdaQueryWrapper<Comment> wrapper = new LambdaQueryWrapper<>();
        if (status != null) {
            wrapper.eq(Comment::getStatus, status);
        }
        wrapper.orderByDesc(Comment::getCreateTime);
        return commentMapper.selectPage(new Page<>(pageNum, pageSize), wrapper);
    }

    /**
     * 修改评论状态（1 通过 / 2 拒绝）
     */
    public void updateStatus(Long id, Integer status) {
        Comment comment = new Comment();
        comment.setId(id);
        comment.setStatus(status);
        commentMapper.updateById(comment);
    }

    /**
     * 删除评论
     */
    public void remove(Long id) {
        commentMapper.deleteById(id);
    }
}
