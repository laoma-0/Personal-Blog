package com.blog.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.blog.entity.Article;
import com.blog.entity.Category;
import com.blog.mapper.ArticleMapper;
import com.blog.mapper.CategoryMapper;
import com.blog.mapper.CommentMapper;
import com.blog.mapper.MessageMapper;
import com.blog.vo.AdminArticleVO;
import com.blog.vo.DashboardVO;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 仪表盘统计业务
 */
@Service
public class DashboardService {

    private final ArticleMapper articleMapper;
    private final CommentMapper commentMapper;
    private final MessageMapper messageMapper;
    private final CategoryMapper categoryMapper;

    public DashboardService(ArticleMapper articleMapper, CommentMapper commentMapper,
                            MessageMapper messageMapper, CategoryMapper categoryMapper) {
        this.articleMapper = articleMapper;
        this.commentMapper = commentMapper;
        this.messageMapper = messageMapper;
        this.categoryMapper = categoryMapper;
    }

    /**
     * 仪表盘概览：文章/评论/留言总数、总访问量、最近 5 篇文章
     */
    public DashboardVO overview() {
        DashboardVO vo = new DashboardVO();

        // 已发布文章
        List<Article> published = articleMapper.selectList(
                new LambdaQueryWrapper<Article>().eq(Article::getStatus, 1)
        );
        vo.setArticleCount((long) published.size());
        long views = published.stream()
                .mapToLong(a -> a.getReadCount() == null ? 0 : a.getReadCount())
                .sum();
        vo.setViewCount(views);

        // 评论 / 留言总数
        vo.setCommentCount(commentMapper.selectCount(null));
        vo.setMessageCount(messageMapper.selectCount(null));

        // 最近 5 篇文章（含草稿，按创建时间倒序）
        List<Article> recent = articleMapper.selectList(
                new LambdaQueryWrapper<Article>()
                        .orderByDesc(Article::getCreateTime)
                        .last("limit 5")
        );
        Map<Long, String> categoryMap = categoryMapper.selectList(null).stream()
                .collect(Collectors.toMap(Category::getId, Category::getName, (a, b) -> a));
        List<AdminArticleVO> recentVoList = recent.stream().map(a -> {
            AdminArticleVO item = new AdminArticleVO();
            BeanUtils.copyProperties(a, item);
            item.setCategoryName(categoryMap.get(a.getCategoryId()));
            return item;
        }).collect(Collectors.toList());
        vo.setRecentArticles(recentVoList);

        return vo;
    }
}
