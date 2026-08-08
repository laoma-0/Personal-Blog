package com.blog.interceptor;

import com.blog.common.BizException;
import com.blog.common.ResultCode;
import com.blog.config.JwtProperties;
import com.blog.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import org.springframework.util.StringUtils;

/**
 * JWT 登录拦截器：校验后台接口的 token
 */
@Component
public class JwtInterceptor implements HandlerInterceptor {

    private final JwtUtil jwtUtil;
    private final JwtProperties jwtProperties;

    public JwtInterceptor(JwtUtil jwtUtil, JwtProperties jwtProperties) {
        this.jwtUtil = jwtUtil;
        this.jwtProperties = jwtProperties;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // 放行预检请求
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }
        String header = request.getHeader(jwtProperties.getHeader());
        if (!StringUtils.hasText(header) || !header.startsWith(jwtProperties.getPrefix())) {
            throw new BizException(ResultCode.UNAUTHORIZED);
        }
        String token = header.substring(jwtProperties.getPrefix().length());
        if (!jwtUtil.validate(token)) {
            throw new BizException(ResultCode.TOKEN_INVALID);
        }
        // 将用户 ID 放入 request，供后续使用
        request.setAttribute("userId", jwtUtil.getUserId(token));
        return true;
    }
}
