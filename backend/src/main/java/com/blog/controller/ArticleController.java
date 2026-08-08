package com.blog.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.blog.common.Result;
import com.blog.entity.Article;
import com.blog.service.ArticleService;
import com.blog.vo.ArticleListVO;
import org.springframework.web.bind.annotation.*;

/**
 * 文章接口（前台）
 */
@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    /**
     * 文章分页列表
     * GET /api/articles?pageNum=1&pageSize=10&categoryId=&keyword=
     */
    @GetMapping
    public Result<IPage<ArticleListVO>> list(
            @RequestParam(defaultValue = "1") long pageNum,
            @RequestParam(defaultValue = "10") long pageSize,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword) {
        return Result.success(articleService.pageList(pageNum, pageSize, categoryId, keyword));
    }

    /**
     * 文章详情
     * GET /api/articles/{id}
     */
    @GetMapping("/{id}")
    public Result<Article> detail(@PathVariable Long id) {
        return Result.success(articleService.getDetail(id));
    }

    /**
     * 文章点赞（点赞数 +1，返回最新点赞数）
     * POST /api/articles/{id}/like
     */
    @PostMapping("/{id}/like")
    public Result<Integer> like(@PathVariable Long id) {
        return Result.success(articleService.like(id));
    }

    /**
     * 取消点赞（点赞数 -1，返回最新点赞数）
     * DELETE /api/articles/{id}/like
     */
    @DeleteMapping("/{id}/like")
    public Result<Integer> unlike(@PathVariable Long id) {
        return Result.success(articleService.unlike(id));
    }
}
