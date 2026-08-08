package com.blog.vo;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 文章列表项 VO（前台列表展示用）
 */
@Data
public class ArticleListVO {

    private Long id;

    private String title;

    private String summary;

    private String cover;

    private Long categoryId;

    /** 分类名（关联查询填充） */
    private String categoryName;

    private Integer isTop;

    private Integer readCount;

    private Integer likeCount;

    private LocalDateTime createTime;
}
