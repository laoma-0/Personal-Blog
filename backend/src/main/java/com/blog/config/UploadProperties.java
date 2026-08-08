package com.blog.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 文件上传配置属性（对应 application.yml 的 blog.upload.*）
 */
@Data
@Component
@ConfigurationProperties(prefix = "blog.upload")
public class UploadProperties {

    /** 物理存储目录（本地开发 ./uploads/，生产 /opt/blog/uploads/） */
    private String path;

    /** 访问 URL 前缀（配合静态资源映射 / Nginx） */
    private String urlPrefix;
}
