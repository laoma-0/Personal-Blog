@echo off
chcp 65001 >nul
title 个人博客 - 一键启动开发环境

echo ============================================
echo   个人博客 本地开发环境 一键启动
echo ============================================
echo.

REM ==== 可按需修改的路径配置 ====
set "PROJECT_ROOT=%~dp0"
set "MAVEN_BIN=D:\Program Files\apache-maven-3.9.16\bin"
set "BACKEND_DIR=%PROJECT_ROOT%backend"
set "FRONTEND_DIR=%PROJECT_ROOT%frontend"

REM ==== 1. 检查并启动 MySQL 服务 ====
echo [1/4] 检查 MySQL 服务...
sc query MySQL80 | find "RUNNING" >nul
if errorlevel 1 (
    echo     MySQL 未运行，正在启动... 需要管理员权限
    net start MySQL80
) else (
    echo     MySQL80 已在运行 √
)
echo.

REM ==== 2. 启动后端（新窗口，mvn spring-boot:run 支持改代码后重启）====
echo [2/4] 启动后端 Spring Boot (端口 8080)...
start "博客-后端 8080" cmd /k "set PATH=%MAVEN_BIN%;%PATH% && cd /d "%BACKEND_DIR%" && mvn spring-boot:run"
echo     后端启动中，请看新弹出的窗口... √
echo.

REM ==== 3. 启动前端（新窗口，Vite 热更新）====
echo [3/4] 启动前端 Vite (端口 5173)...
start "博客-前端 5173" cmd /k "cd /d "%FRONTEND_DIR%" && npm run dev"
echo     前端启动中，请看新弹出的窗口... √
echo.

REM ==== 4. 等待后端就绪后打开浏览器 ====
echo [4/4] 等待服务就绪 (约 20 秒后自动打开浏览器)...
timeout /t 20 /nobreak >nul
start "" "http://localhost:5173/"
echo.
echo ============================================
echo   启动完成！
echo   前端： http://localhost:5173/
echo   后端： http://localhost:8080/api
echo   后台： http://localhost:5173/admin/login  (admin / 123456)
echo.
echo   关闭服务：直接关掉那两个新弹出的窗口即可
echo ============================================
echo.
pause
