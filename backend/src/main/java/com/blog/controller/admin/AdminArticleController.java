package com.blog.controller.admin;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.blog.common.Result;
import com.blog.dto.ArticleDTO;
import com.blog.entity.Article;
import com.blog.service.ArticleService;
import com.blog.vo.AdminArticleVO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

/**
 * 文章管理接口（后台，需 JWT 鉴权）
 */
@RestController
@RequestMapping("/api/admin/articles")
public class AdminArticleController {

    private final ArticleService articleService;

    public AdminArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    /**
     * 后台文章分页
     * GET /api/admin/articles?pageNum=1&pageSize=10&keyword=&status=
     */
    @GetMapping
    public Result<IPage<AdminArticleVO>> list(
            @RequestParam(defaultValue = "1") long pageNum,
            @RequestParam(defaultValue = "10") long pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status) {
        return Result.success(articleService.adminPage(pageNum, pageSize, keyword, status));
    }

    /**
     * 文章详情（编辑回显）
     * GET /api/admin/articles/{id}
     */
    @GetMapping("/{id}")
    public Result<Article> detail(@PathVariable Long id) {
        return Result.success(articleService.getById(id));
    }

    /**
     * 新增文章
     * POST /api/admin/articles
     */
    @PostMapping
    public Result<Void> create(@Valid @RequestBody ArticleDTO dto, HttpServletRequest request) {
        dto.setId(null);
        Long authorId = (Long) request.getAttribute("userId");
        articleService.save(dto, authorId);
        return Result.success();
    }

    /**
     * 更新文章
     * PUT /api/admin/articles/{id}
     */
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody ArticleDTO dto, HttpServletRequest request) {
        dto.setId(id);
        Long authorId = (Long) request.getAttribute("userId");
        articleService.save(dto, authorId);
        return Result.success();
    }

    /**
     * 删除文章
     * DELETE /api/admin/articles/{id}
     */
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        articleService.remove(id);
        return Result.success();
    }
}
