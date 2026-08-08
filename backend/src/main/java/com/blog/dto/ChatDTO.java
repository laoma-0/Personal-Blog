package com.blog.dto;

import lombok.Data;

/**
 * AI 聊天请求参数
 */
@Data
public class ChatDTO {

    /** 用户发送的消息内容 */
    private String message;
}
