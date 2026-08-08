package com.blog.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.blog.dto.MessageDTO;
import com.blog.entity.Message;
import com.blog.mapper.MessageMapper;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 留言业务
 */
@Service
public class MessageService {

    private final MessageMapper messageMapper;

    public MessageService(MessageMapper messageMapper) {
        this.messageMapper = messageMapper;
    }

    /**
     * 前台留言列表（只返回审核通过的，按时间倒序）
     */
    public List<Message> listApproved() {
        LambdaQueryWrapper<Message> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Message::getStatus, 1)
                .orderByDesc(Message::getCreateTime);
        return messageMapper.selectList(wrapper);
    }

    /**
     * 提交留言（默认待审核）
     */
    public void submit(MessageDTO dto, String ip) {
        Message message = new Message();
        message.setNickname(dto.getNickname());
        message.setEmail(dto.getEmail());
        message.setContent(dto.getContent());
        message.setIp(ip);
        message.setStatus(0); // 待审核
        messageMapper.insert(message);
    }

    // ==================== 后台管理 ====================

    /**
     * 后台留言分页（全状态，支持状态筛选，按时间倒序）
     */
    public IPage<Message> adminPage(long pageNum, long pageSize, Integer status) {
        LambdaQueryWrapper<Message> wrapper = new LambdaQueryWrapper<>();
        if (status != null) {
            wrapper.eq(Message::getStatus, status);
        }
        wrapper.orderByDesc(Message::getCreateTime);
        return messageMapper.selectPage(new Page<>(pageNum, pageSize), wrapper);
    }

    /**
     * 修改留言状态（1 通过 / 2 拒绝）
     */
    public void updateStatus(Long id, Integer status) {
        Message message = new Message();
        message.setId(id);
        message.setStatus(status);
        messageMapper.updateById(message);
    }

    /**
     * 删除留言
     */
    public void remove(Long id) {
        messageMapper.deleteById(id);
    }
}
