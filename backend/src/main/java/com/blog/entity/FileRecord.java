package com.blog.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 文件记录实体（对应 file_record 表）
 */
@Data
@TableName("file_record")
public class FileRecord {

    @TableId(type = IdType.AUTO)
    private Long id;

    /** 原始文件名 */
    private String originalName;

    /** 存储文件名 */
    private String storeName;

    /** 访问 URL */
    private String url;

    /** 文件大小(字节) */
    private Long size;

    /** MIME 类型 */
    private String type;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
}
