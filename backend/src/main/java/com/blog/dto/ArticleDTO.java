package com.blog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 文章新增/编辑 DTO（后台）
 */
@Data
public class ArticleDTO {

    /** 更新时使用，新增时为 null */
    private Long id;

    @NotBlank(message = "标题不能为空")
    private String title;

    private String summary;

    @NotBlank(message = "正文不能为空")
    private String content;

    /** 前端 marked 渲染后的 HTML */
    private String contentHtml;

    private String cover;

    @NotNull(message = "请选择分类")
    private Long categoryId;

    /** 0 草稿 / 1 已发布 */
    private Integer status;

    /** 是否置顶 */
    private Integer isTop;
}
