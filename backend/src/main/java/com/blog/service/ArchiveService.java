package com.blog.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.blog.entity.Article;
import com.blog.mapper.ArticleMapper;
import com.blog.vo.ArchiveVO;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 归档业务：按年份分组文章
 */
@Service
public class ArchiveService {

    private final ArticleMapper articleMapper;

    public ArchiveService(ArticleMapper articleMapper) {
        this.articleMapper = articleMapper;
    }

    private static final DateTimeFormatter MD = DateTimeFormatter.ofPattern("MM-dd");

    public List<ArchiveVO> archive() {
        LambdaQueryWrapper<Article> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Article::getStatus, 1)
                .orderByDesc(Article::getCreateTime)
                .select(Article::getId, Article::getTitle, Article::getCreateTime);
        List<Article> articles = articleMapper.selectList(wrapper);

        // 按年份分组，保持时间倒序（LinkedHashMap 保留插入顺序）
        Map<String, ArchiveVO> yearMap = new LinkedHashMap<>();
        for (Article a : articles) {
            if (a.getCreateTime() == null) {
                continue;
            }
            String year = String.valueOf(a.getCreateTime().getYear());
            ArchiveVO vo = yearMap.computeIfAbsent(year, y -> {
                ArchiveVO v = new ArchiveVO();
                v.setYear(y);
                v.setArticles(new ArrayList<>());
                return v;
            });
            ArchiveVO.ArchiveItem item = new ArchiveVO.ArchiveItem();
            item.setId(a.getId());
            item.setTitle(a.getTitle());
            item.setDate(a.getCreateTime().format(MD));
            vo.getArticles().add(item);
        }
        return new ArrayList<>(yearMap.values());
    }
}
