package com.blog.controller;

import com.blog.common.Result;
import com.blog.service.SiteService;
import com.blog.vo.SiteVO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 站点接口（前台）
 */
@RestController
@RequestMapping("/api/site")
public class SiteController {

    private final SiteService siteService;

    public SiteController(SiteService siteService) {
        this.siteService = siteService;
    }

    /**
     * 站点统计
     * GET /api/site/stats
     */
    @GetMapping("/stats")
    public Result<SiteVO> stats() {
        return Result.success(siteService.stats());
    }
}
