package com.blog.controller;

import com.blog.common.Result;
import com.blog.service.CategoryService;
import com.blog.vo.CategoryVO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 分类接口（前台）
 */
@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    /**
     * 分类列表（含文章数）
     * GET /api/categories
     */
    @GetMapping
    public Result<List<CategoryVO>> list() {
        return Result.success(categoryService.listWithCount());
    }
}
