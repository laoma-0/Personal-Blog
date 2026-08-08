package com.blog.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.blog.common.BizException;
import com.blog.entity.Article;
import com.blog.entity.Category;
import com.blog.mapper.ArticleMapper;
import com.blog.mapper.CategoryMapper;
import com.blog.vo.CategoryVO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 分类业务
 */
@Service
public class CategoryService {

    private final CategoryMapper categoryMapper;
    private final ArticleMapper articleMapper;

    public CategoryService(CategoryMapper categoryMapper, ArticleMapper articleMapper) {
        this.categoryMapper = categoryMapper;
        this.articleMapper = articleMapper;
    }

    /**
     * 分类列表（含每个分类下已发布文章数）
     */
    public List<CategoryVO> listWithCount() {
        LambdaQueryWrapper<Category> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByAsc(Category::getSort);
        List<Category> categories = categoryMapper.selectList(wrapper);

        return categories.stream().map(c -> {
            CategoryVO vo = new CategoryVO();
            vo.setId(c.getId());
            vo.setName(c.getName());
            vo.setDescription(c.getDescription());
            vo.setSort(c.getSort());
            Long count = articleMapper.selectCount(new LambdaQueryWrapper<Article>()
                    .eq(Article::getCategoryId, c.getId())
                    .eq(Article::getStatus, 1));
            vo.setArticleCount(count);
            return vo;
        }).collect(Collectors.toList());
    }

    /**
     * 新增分类
     */
    public void add(Category category) {
        // 名称查重：同名分类不允许重复
        Long exists = categoryMapper.selectCount(new LambdaQueryWrapper<Category>()
                .eq(Category::getName, category.getName()));
        if (exists != null && exists > 0) {
            throw new BizException("分类「" + category.getName() + "」已存在");
        }
        category.setId(null); // 保证是新增，交给数据库自增主键
        categoryMapper.insert(category);
    }

    /**
     * 删除分类
     */
    public void delete(Long id) {
        // 该分类下若还有文章，不允许删除，避免文章变成“无分类”
        Long count = articleMapper.selectCount(new LambdaQueryWrapper<Article>()
                .eq(Article::getCategoryId, id));
        if (count != null && count > 0) {
            throw new BizException("该分类下还有 " + count + " 篇文章，不能删除");
        }
        categoryMapper.deleteById(id);
    }
}
