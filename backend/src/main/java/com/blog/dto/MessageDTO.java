package com.blog.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 留言提交参数
 */
@Data
public class MessageDTO {

    @NotBlank(message = "昵称不能为空")
    @Size(max = 50, message = "昵称过长")
    private String nickname;

    @Email(message = "邮箱格式不正确")
    private String email;

    @NotBlank(message = "留言内容不能为空")
    @Size(max = 1000, message = "留言内容过长")
    private String content;
}
