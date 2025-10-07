#!/bin/bash
set -euo pipefail  # 严格模式：遇错即停，防止未定义变量

# ==============================================
# 配置区（根据项目调整）
# ==============================================
REMOTE_BRANCH="main"               # 远程目标分支
HEXO_NODE_MIN_VERSION="22.19.0"    # 最低兼容Node版本
# ==============================================

# 输出格式化函数（带颜色标识）
info() { echo -e "\033[34mℹ️ $1\033[0m"; }
success() { echo -e "\033[32m✅ $1\033[0m"; }
warning() { echo -e "\033[33m⚠️ $1\033[0m"; }
error() { echo -e "\033[31m❌ $1\033[0m" && exit 1; }

# 1. 检查Node.js版本（确保Hexo可正常运行）
check_node_env() {
    info "检查Node.js环境（需≥$HEXO_NODE_MIN_VERSION）..."
    if ! command -v node &> /dev/null; then
        error "未安装Node.js，请先安装：https://nodejs.org/"
    fi
    
    local node_version
    node_version=$(node -v | cut -d 'v' -f 2)  # 提取版本号（如v20.19.0 → 20.19.0）
    if [ "$(echo -e "$node_version\n$HEXO_NODE_MIN_VERSION" | sort -V | head -n1)" != "$HEXO_NODE_MIN_VERSION" ]; then
        error "Node.js版本过低！需要≥$HEXO_NODE_MIN_VERSION，当前为$node_version"
    fi
}

# 2. 检查Hexo环境（确保可执行构建命令）
check_hexo_env() {
    info "检查Hexo环境..."
    if ! command -v hexo &> /dev/null; then
        warning "未全局安装hexo-cli，尝试从项目依赖启动..."
        if [ ! -f "node_modules/hexo/bin/hexo" ]; then
            error "未找到hexo依赖，请先执行：npm install"
        fi
        # 临时将项目内hexo命令加入PATH
        export PATH="$PATH:./node_modules/.bin"
    fi
}

# 3. 检查项目是否有变更（任何文件的修改/新增/删除）
check_project_changes() {
    info "检查Hexo项目是否有变更..."
    # 检查工作区和暂存区是否有变化（忽略.gitignore中的文件）
    if git diff --quiet --exit-code && git diff --cached --quiet --exit-code; then
        warning "项目未检测到任何变更，无需提交推送"
        exit 0
    fi
}

# 4. Hexo预处理（提前构建，避免部署阶段失败）
hexo_prebuild() {
    info "执行Hexo预处理（清理+构建验证）..."
    hexo clean || error "Hexo清理缓存失败（可能存在配置错误）"
    hexo generate || error "Hexo构建静态文件失败（检查文章语法或主题问题）"
}

# 5. 同步远程最新代码（避免推送冲突）
sync_remote() {
    info "同步远程$REMOTE_BRANCH分支最新代码..."
    if ! git pull origin "$REMOTE_BRANCH"; then
        error "拉取远程代码冲突！请手动解决后再运行脚本：\ngit pull origin $REMOTE_BRANCH"
    fi
}

# 6. 提交所有变更并推送
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
    check_node_env
    check_hexo_env
    check_project_changes
    hexo_prebuild
    sync_remote
    commit_and_deploy
    info "==================================="
}

main "$@"
    