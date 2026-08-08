package com.blog.controller.admin;

import com.blog.common.Result;
import com.blog.entity.Category;
import com.blog.service.CategoryService;
import com.blog.vo.CategoryVO;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 分类管理接口（后台，需 JWT 鉴权）
 */
@RestController
@RequestMapping("/api/admin/categories")
public class AdminCategoryController {

    private final CategoryService categoryService;

    public AdminCategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    /**
     * 分类列表（含文章数）
     * GET /api/admin/categories
     */
    @GetMapping
    public Result<List<CategoryVO>> list() {
        return Result.success(categoryService.listWithCount());
    }

    /**
     * 新增分类
     * POST /api/admin/categories
     */
    @PostMapping
    public Result<Void> add(@RequestBody Category category) {
        categoryService.add(category);
        return Result.success();
    }

    /**
     * 删除分类
     * DELETE /api/admin/categories/{id}
     */
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return Result.success();
    }
}
