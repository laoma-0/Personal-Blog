package com.blog.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.blog.entity.Article;
import com.blog.entity.SysUser;
import com.blog.entity.Tag;
import com.blog.mapper.ArticleMapper;
import com.blog.mapper.SysUserMapper;
import com.blog.mapper.TagMapper;
import com.blog.vo.SiteVO;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 站点统计业务
 */
@Service
public class SiteService {

    private final ArticleMapper articleMapper;
    private final TagMapper tagMapper;
    private final SysUserMapper sysUserMapper;

    public SiteService(ArticleMapper articleMapper, TagMapper tagMapper, SysUserMapper sysUserMapper) {
        this.articleMapper = articleMapper;
        this.tagMapper = tagMapper;
        this.sysUserMapper = sysUserMapper;
    }

    /**
     * 站点统计（作者信息 + 文章数 + 标签数 + 总访问量）
     */
    public SiteVO stats() {
        SiteVO vo = new SiteVO();

        // 作者信息：取第一位用户（博主）
        SysUser author = sysUserMapper.selectList(
                new LambdaQueryWrapper<SysUser>().orderByAsc(SysUser::getId).last("limit 1")
        ).stream().findFirst().orElse(null);
        if (author != null) {
            vo.setAuthor(author.getNickname());
            vo.setIntro(author.getIntro());
        }

        // 已发布文章
        List<Article> published = articleMapper.selectList(
                new LambdaQueryWrapper<Article>().eq(Article::getStatus, 1)
        );
        vo.setArticleCount((long) published.size());
        long views = published.stream()
                .mapToLong(a -> a.getReadCount() == null ? 0 : a.getReadCount())
                .sum();
        vo.setViewCount(views);

        // 标签数
        vo.setTagCount(tagMapper.selectCount(null));

        return vo;
    }
}
