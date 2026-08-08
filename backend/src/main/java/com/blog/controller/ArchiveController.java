package com.blog.controller;

import com.blog.common.Result;
import com.blog.service.ArchiveService;
import com.blog.vo.ArchiveVO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 归档接口（前台）
 */
@RestController
@RequestMapping("/api/archive")
public class ArchiveController {

    private final ArchiveService archiveService;

    public ArchiveController(ArchiveService archiveService) {
        this.archiveService = archiveService;
    }

    /**
     * 文章归档（按年份分组）
     * GET /api/archive
     */
    @GetMapping
    public Result<List<ArchiveVO>> archive() {
        return Result.success(archiveService.archive());
    }
}
