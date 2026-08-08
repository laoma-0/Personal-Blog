package com.blog.controller.admin;

import com.blog.common.BizException;
import com.blog.common.Result;
import com.blog.config.UploadProperties;
import com.blog.entity.FileRecord;
import com.blog.mapper.FileRecordMapper;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Set;
import java.util.UUID;

/**
 * 文件上传接口（后台，需 JWT 鉴权）
 * 存储策略：本地磁盘按日期分目录，UUID 命名，返回可访问 URL。
 */
@RestController
@RequestMapping("/api/admin/upload")
public class UploadController {

    /** 允许上传的图片扩展名 */
    private static final Set<String> ALLOWED_EXT = Set.of("jpg", "jpeg", "png", "gif", "webp", "bmp");

    /** 单文件大小上限：5MB（application.yml 的 multipart 上限为 10MB，这里更严格） */
    private static final long MAX_SIZE = 5 * 1024 * 1024;

    private final UploadProperties uploadProperties;
    private final FileRecordMapper fileRecordMapper;

    public UploadController(UploadProperties uploadProperties, FileRecordMapper fileRecordMapper) {
        this.uploadProperties = uploadProperties;
        this.fileRecordMapper = fileRecordMapper;
    }

    /**
     * 上传图片
     * POST /api/admin/upload  (multipart/form-data, 字段名 file)
     * @return 图片可访问 URL
     */
    @PostMapping
    public Result<String> upload(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BizException("请选择要上传的文件");
        }
        if (file.getSize() > MAX_SIZE) {
            throw new BizException("图片大小不能超过 5MB");
        }

        // 校验扩展名
        String originalName = StringUtils.cleanPath(
                file.getOriginalFilename() == null ? "" : file.getOriginalFilename());
        String ext = StringUtils.getFilenameExtension(originalName);
        if (ext == null || !ALLOWED_EXT.contains(ext.toLowerCase())) {
            throw new BizException("仅支持 jpg/jpeg/png/gif/webp/bmp 图片");
        }
        ext = ext.toLowerCase();

        // 目录：{path}/yyyy/MM/dd/
        String datePath = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
        String storeName = UUID.randomUUID().toString().replace("-", "") + "." + ext;

        Path dir = Paths.get(uploadProperties.getPath(), datePath).toAbsolutePath();
        try {
            Files.createDirectories(dir);
            File dest = dir.resolve(storeName).toFile();
            file.transferTo(dest);
        } catch (IOException e) {
            throw new BizException("文件保存失败：" + e.getMessage());
        }

        // 拼接访问 URL：{urlPrefix}yyyy/MM/dd/storeName
        String prefix = uploadProperties.getUrlPrefix();
        if (!prefix.endsWith("/")) {
            prefix = prefix + "/";
        }
        String url = prefix + datePath + "/" + storeName;

        // 写 file_record 表
        FileRecord record = new FileRecord();
        record.setOriginalName(originalName);
        record.setStoreName(storeName);
        record.setUrl(url);
        record.setSize(file.getSize());
        record.setType(file.getContentType());
        fileRecordMapper.insert(record);

        return Result.success(url);
    }
}
