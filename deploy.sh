#!/bin/bash
set -euo pipefail  # 严格模式：遇错即停，防止未定义变量

# ==============================================
# 配置区（根据项目调整）
# ==============================================
REMOTE_BRANCH="main"               # 远程目标分支
# ==============================================

# 输出格式化函数（带颜色标识）
info() { echo -e "\033[34mℹ️ $1\033[0m"; }
success() { echo -e "\033[32m✅ $1\033[0m"; }
warning() { echo -e "\033[33m⚠️ $1\033[0m"; }
error() { echo -e "\033[31m❌ $1\033[0m" && exit 1; }

# 1. 检查项目是否有变更（任何文件的修改/新增/删除）
check_project_changes() {
    info "检查Hexo项目是否有变更..."
    # 检查工作区和暂存区是否有变化（忽略.gitignore中的文件）
    if git diff --quiet --exit-code && git diff --cached --quiet --exit-code; then
        warning "项目未检测到任何变更，无需提交推送"
        exit 0
    fi
}

# 2. 同步远程最新代码（避免推送冲突）
sync_remote() {
    info "同步远程$REMOTE_BRANCH分支最新代码..."
    if ! git pull origin "$REMOTE_BRANCH"; then
        error "拉取远程代码冲突！请手动解决后再运行脚本：\ngit pull origin $REMOTE_BRANCH"
    fi
}

# 3. 提交所有变更并推送
commit_and_deploy() {
    info "提交所有项目变更..."
    
    # 添加所有变更（.gitignore会自动过滤不需要的文件）
    git add . || error "添加文件到暂存区失败"
    
    # 生成包含变更类型的提交信息
    local change_count
    change_count=$(git status --porcelain | wc -l | tr -d ' ')  # 统计变更文件数
    local commit_msg="Hexo项目更新 ($change_count 个文件): $(date +'%Y-%m-%d %H:%M:%S')"
    git commit -m "$commit_msg" || error "提交失败（可能存在未解决的冲突）"
    
    # 推送至远程，触发三平台部署
    info "推送至远程$REMOTE_BRANCH分支，触发自动化部署..."
    git push origin "$REMOTE_BRANCH" || error "推送失败（检查网络或权限）"
    
    success "所有变更已推送！三平台自动化部署将自动触发"
}

# 主流程
main() {
    info "===== Hexo全项目自动部署工具 ====="
    check_project_changes
    sync_remote
    commit_and_deploy
    info "==================================="
}

main "$@"
    