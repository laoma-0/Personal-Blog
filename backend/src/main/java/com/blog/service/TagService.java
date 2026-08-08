package com.blog.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.blog.common.BizException;
import com.blog.entity.Tag;
import com.blog.mapper.TagMapper;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 标签业务
 */
@Service
public class TagService {

    private final TagMapper tagMapper;

    public TagService(TagMapper tagMapper) {
        this.tagMapper = tagMapper;
    }

    /**
     * 全部标签（按 id 升序，含颜色）
     */
    public List<Tag> list() {
        LambdaQueryWrapper<Tag> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByAsc(Tag::getId);
        return tagMapper.selectList(wrapper);
    }

    /**
     * 提交标签
     */
    public Tag submit(Tag tag) {
        tagMapper.insert(tag);
        return tag;
    }

    /**
     * 新增标签（后台）
     */
    public void add(Tag tag) {
        // 名称查重
        Long exists = tagMapper.selectCount(new LambdaQueryWrapper<Tag>()
                .eq(Tag::getName, tag.getName()));
        if (exists != null && exists > 0) {
            throw new BizException("标签「" + tag.getName() + "」已存在");
        }
        tag.setId(null);
        // 没传颜色时给个默认色，避免前端标签墙全是空色
        if (tag.getColor() == null || tag.getColor().isBlank()) {
            tag.setColor("#a8b5a2");
        }
        tagMapper.insert(tag);
    }

    /**
     * 删除标签（后台）
     * 注：个人博客场景下暂不清理 article_tag 关联表，够用即可；
     *     后续若做关联清理，可在此补充删除中间表记录。
     */
    public void delete(Long id) {
        tagMapper.deleteById(id);
    }
}
