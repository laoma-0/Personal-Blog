package com.blog.controller.admin;

import com.blog.common.Result;
import com.blog.service.DashboardService;
import com.blog.vo.DashboardVO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 仪表盘接口（后台，需 JWT 鉴权）
 */
@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final DashboardService dashboardService;

    public AdminDashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    /**
     * 仪表盘概览
     * GET /api/admin/dashboard
     */
    @GetMapping
    public Result<DashboardVO> overview() {
        return Result.success(dashboardService.overview());
    }
}
