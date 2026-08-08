package com.blog.vo;

import lombok.Data;

/**
 * 分类项 VO（含该分类下已发布文章数）
 */
@Data
public class CategoryVO {

    private Long id;

    private String name;

    private String description;

    private Integer sort;

    /** 该分类下已发布文章数 */
    private Long articleCount;
}
