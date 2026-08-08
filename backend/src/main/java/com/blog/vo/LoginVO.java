package com.blog.vo;

import lombok.Data;

/**
 * 登录成功返回
 */
@Data
public class LoginVO {

    private String token;

    private Long userId;

    private String username;

    private String nickname;

    private String avatar;

    public LoginVO(String token, Long userId, String username, String nickname, String avatar) {
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.nickname = nickname;
        this.avatar = avatar;
    }
}
