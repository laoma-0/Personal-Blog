package com.blog.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.blog.common.BizException;
import com.blog.common.ResultCode;
import com.blog.dto.ArticleDTO;
import com.blog.entity.Article;
import com.blog.entity.Category;
import com.blog.mapper.ArticleMapper;
import com.blog.mapper.CategoryMapper;
import com.blog.vo.AdminArticleVO;
import com.blog.vo.ArticleListVO;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 文章业务
 */
@Service
public class ArticleService {

    private final ArticleMapper articleMapper;
    private final CategoryMapper categoryMapper;

    public ArticleService(ArticleMapper articleMapper, CategoryMapper categoryMapper) {
        this.articleMapper = articleMapper;
        this.categoryMapper = categoryMapper;
    }

    /**
     * 前台文章分页列表（只查已发布，置顶优先、按时间倒序）
     * keyword 非空时按标题 / 摘要 / 正文模糊匹配
     */
    public IPage<ArticleListVO> pageList(long pageNum, long pageSize, Long categoryId, String keyword) {
        LambdaQueryWrapper<Article> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Article::getStatus, 1);
        if (categoryId != null) {
            wrapper.eq(Article::getCategoryId, categoryId);
        }
        if (StringUtils.hasText(keyword)) {
            String kw = keyword.trim();
            wrapper.and(w -> w.like(Article::getTitle, kw)
                    .or().like(Article::getSummary, kw)
                    .or().like(Article::getContent, kw));
        }
        wrapper.orderByDesc(Article::getIsTop).orderByDesc(Article::getCreateTime);

        Page<Article> page = articleMapper.selectPage(new Page<>(pageNum, pageSize), wrapper);

        // 分类 id -> name 映射
        Map<Long, String> categoryMap = categoryMapper.selectList(null).stream()
                .collect(Collectors.toMap(a -> a.getId(), a -> a.getName(), (oldVal, newVal) -> oldVal));

        List<ArticleListVO> voList = page.getRecords().stream().map(a -> {
            ArticleListVO vo = new ArticleListVO();
BeanUtils.copyProperties(java.util.Objects.requireNonNull(a), vo);
            vo.setCategoryName(categoryMap.get(a.getCategoryId()));
            return vo;
        }).collect(Collectors.toList());

        Page<ArticleListVO> voPage = new Page<>(page.getCurrent(), page.getSize(), page.getTotal());
        voPage.setRecords(voList);
        return voPage;
    }

    /**
     * 文章详情（阅读量 +1）
     */
    public Article getDetail(Long id) {
        Article article = articleMapper.selectById(id);
        if (article == null) {
            throw new BizException(ResultCode.NOT_FOUND);
        }
        // 阅读量 +1
        article.setReadCount(article.getReadCount() == null ? 1 : article.getReadCount() + 1);
        Article update = new Article();
        update.setId(id);
        update.setReadCount(article.getReadCount());
        articleMapper.updateById(update);
        return article;
    }

    /**
     * 文章点赞（点赞数 +1）
     * 防重复由前端 localStorage 控制，此处只负责累加
     */
    public Integer like(Long id) {
        Article article = articleMapper.selectById(id);
        if (article == null) {
            throw new BizException(ResultCode.NOT_FOUND);
        }
        int newCount = (article.getLikeCount() == null ? 0 : article.getLikeCount()) + 1;
        Article update = new Article();
        update.setId(id);
        update.setLikeCount(newCount);
        articleMapper.updateById(update);
        return newCount;
    }

    /**
     * 取消点赞（点赞数 -1，最低为 0）
     */
    public Integer unlike(Long id) {
        Article article = articleMapper.selectById(id);
        if (article == null) {
            throw new BizException(ResultCode.NOT_FOUND);
        }
        int newCount = Math.max(0, (article.getLikeCount() == null ? 0 : article.getLikeCount()) - 1);
        Article update = new Article();
        update.setId(id);
        update.setLikeCount(newCount);
        articleMapper.updateById(update);
        return newCount;
    }

    // ==================== 后台管理 ====================

    /**
     * 后台文章分页（含草稿，支持标题模糊、状态筛选，按时间倒序）
     */
    public IPage<AdminArticleVO> adminPage(long pageNum, long pageSize, String keyword, Integer status) {
        LambdaQueryWrapper<Article> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(keyword)) {
            wrapper.like(Article::getTitle, keyword);
        }
        if (status != null) {
            wrapper.eq(Article::getStatus, status);
        }
        wrapper.orderByDesc(Article::getCreateTime);

        Page<Article> page = articleMapper.selectPage(new Page<>(pageNum, pageSize), wrapper);

        Map<Long, String> categoryMap = categoryMapper.selectList(null).stream()
                .collect(Collectors.toMap(a -> a.getId(), a -> a.getName()));

        List<AdminArticleVO> voList = page.getRecords().stream().map(a -> {
            AdminArticleVO vo = new AdminArticleVO();
            BeanUtils.copyProperties(a, vo);
            vo.setCategoryName(categoryMap.get(a.getCategoryId()));
            return vo;
        }).collect(Collectors.toList());

        Page<AdminArticleVO> voPage = new Page<>(page.getCurrent(), page.getSize(), page.getTotal());
        voPage.setRecords(voList);
        return voPage;
    }

    /**
     * 后台编辑回显（不触发阅读量 +1）
     */
    public Article getById(Long id) {
        Article article = articleMapper.selectById(id);
        if (article == null) {
            throw new BizException(ResultCode.NOT_FOUND);
        }
        return article;
    }

    /**
     * 新增 / 更新文章
     * id 为空则新增，否则按 id 更新
     */
    public void save(ArticleDTO dto, Long authorId) {
        Article article = new Article();
        BeanUtils.copyProperties(dto, article);
        if (dto.getId() == null) {
            article.setAuthorId(authorId);
            article.setReadCount(0);
            article.setLikeCount(0);
            if (article.getStatus() == null) {
                article.setStatus(0);
            }
            if (article.getIsTop() == null) {
                article.setIsTop(0);
            }
            articleMapper.insert(article);
        } else {
            articleMapper.updateById(article);
        }
    }

    /**
     * 删除文章（逻辑删除）
     */
    public void remove(Long id) {
        articleMapper.deleteById(id);
    }
}
