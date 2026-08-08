package com.blog.vo;

import lombok.Data;

import java.util.List;

/**
 * 归档 VO：按年份分组
 */
@Data
public class ArchiveVO {

    /** 年份，如 "2026" */
    private String year;

    /** 该年份下的文章列表 */
    private List<ArchiveItem> articles;

    @Data
    public static class ArchiveItem {
        private Long id;
        private String title;
        /** 日期字符串 MM-DD */
        private String date;
    }
}
