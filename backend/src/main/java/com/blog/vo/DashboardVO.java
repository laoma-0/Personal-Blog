package com.blog.vo;

import lombok.Data;

import java.util.List;

/**
 * 仪表盘概览 VO
 */
@Data
public class DashboardVO {

    /** 已发布文章总数 */
    private Long articleCount;

    /** 评论总数 */
    private Long commentCount;

    /** 留言总数 */
    private Long messageCount;

    /** 总访问量（已发布文章 read_count 之和） */
    private Long viewCount;

    /** 最近文章（最多 5 篇） */
    private List<AdminArticleVO> recentArticles;
}
