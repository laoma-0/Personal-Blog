package com.blog.vo;

import lombok.Data;

/**
 * 站点统计 VO（前台侧边栏作者卡使用）
 */
@Data
public class SiteVO {

    /** 博主昵称 */
    private String author;

    /** 博主简介 */
    private String intro;

    /** 已发布文章数 */
    private Long articleCount;

    /** 标签数 */
    private Long tagCount;

    /** 总访问量（已发布文章阅读量之和） */
    private Long viewCount;
}
