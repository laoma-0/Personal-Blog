package com.blog.vo;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 后台文章列表项 VO（含草稿状态、比前台列表多 status）
 */
@Data
public class AdminArticleVO {

    private Long id;

    private String title;

    private Long categoryId;

    /** 分类名（关联查询填充） */
    private String categoryName;

    /** 0 草稿 / 1 已发布 */
    private Integer status;

    private Integer isTop;

    private Integer readCount;

    private LocalDateTime createTime;
}
