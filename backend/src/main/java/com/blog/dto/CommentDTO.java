package com.blog.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 评论提交参数
 */
@Data
public class CommentDTO {

    @NotNull(message = "文章 ID 不能为空")
    private Long articleId;

    /** 父评论 ID，0 或不传表示顶级评论 */
    private Long parentId;

    @NotBlank(message = "昵称不能为空")
    @Size(max = 50, message = "昵称过长")
    private String nickname;

    @Email(message = "邮箱格式不正确")
    private String email;

    @NotBlank(message = "评论内容不能为空")
    @Size(max = 1000, message = "评论内容过长")
    private String content;
}
