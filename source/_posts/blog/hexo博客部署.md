---
title: hexo部署
tags:
  - hexo配置
  - hexo部署
categories: 博客搭建
abbrlink: 55230
date: 2025-10-07 12:17:21
---

### 0. 前言
Hexo 部署是将本地生成的静态博客内容发布到服务器或托管平台的过程，常见的部署目标包括 GitHub Pages、Netlify、Vercel、Cloudflare Pages 等。以下是详细的部署步骤和常见问题解决方案，实现一次推送完成GitHub Pages、Vercel、Cloudflare Pages 三个平台部署。
### 1. 部署前提
- **Github/Vercel/Cloudflare **账号,免费额度个人博客够用了。
- 一个 **Git 仓库**（GitHub、GitLab 均可），存放你的 Hexo 源代码（非 `public` 目录，需包含 `_config.yml`、`package.json`、`source` 等核心文件）。
- 本地已完成 Hexo 博客搭建，能通过 `hexo g` 生成 `public` 目录（确保本地构建正常）。

### 2. 部署到 GitHub Pages
适合个人博客，免费但有时候不太稳定，当备用站使用，具体操作步骤如下：
- 在Github新建仓库，仓库名为  `yourname.github.io`，确保仓库为公共仓库。
然后在仓库设置中打开Github Pages功能。
- 然后在博客文件夹下安装部署插件`npm install hexo-deployer-git --save`

- 修改 `_config.yml`主题配置文件`deploy`信息，详细配置如下。
```yaml 主题配置文件
deploy:
   type: git
   repo: https://github.com/yourname/yourname.github.io.git  # 仓库地址
   branch: main  # 部署分支（默认 main 或 master，根据仓库设置调整）
   message: "Hexo deploy: {{ now('YYYY-MM-DD HH:mm:ss') }}"  # 提交信息（可选）
```
- 终端执行` hexo clean && hexo g && hexo d  # 清理、生成、部署` ，部署成功后，访问 `https://yourname.github.io` 即可看到博客，也可以重定向绑定自己的域名，由Cloudflare托管。

### 3. 部署到 Cloudflare Pages

Cloudflare Pages 提供全球 CDN 加速，国内访问速度较快，目前作为主站使用。

#### 3.1 推送Hexo源码到 GitHub

确保仓库包含完整的 Hexo 源代码（包括 `package.json`、`_config.yml` 等），而非仅 `public` 目录，使用Github部署仓库修改即可。
Cloudflare Pages 需通过 Git 仓库拉取代码并自动构建，因此需先将本地代码推送到远程仓库：

- **初始化本地 Git 仓库**（若未初始化）：

   ```bash
   cd blog # 进入 Hexo 博客根目录
   git branch -m main #不然会报错
   git init # 初始化 Git
   # 创建 .gitignore 文件（关键！避免提交不必要的文件）
   cat > .gitignore << EOF
   node_modules/
   public/
   .deploy_git/
   *.log
   .DS_Store
   Thumbs.db
   EOF
   ```
- **提交并推送代码到远程仓库**：

   ```bash 终端
   git add . # 添加所有文件（排除 .gitignore 中指定的内容）
   git commit -m "Initial commit: Hexo source code" # 提交
   # 切换到 SSH 协议，生成 SSH 密钥，一路回车默认即可,密码可以为空。
   ssh-keygen -t ed25519 -C "你的GitHub邮箱"
   cat ~/.ssh/id_ed25519.pub  #查看公钥内容（复制全部输出）
   #登录 GitHub，进入 `Settings` → `SSH and GPG keys` → `New SSH key`，粘贴公钥并保存。
   git remote set-url origin git@github.com:sam7xx/sam7xx.github.io.git# 关联远程仓库（替换为你的仓库地址）
   git push origin main #执行推送，如果不再提示认证失败，说明配置成功。
   ```

#### 3.2 Cloudflare 创建 Pages

   - 注册Cloudflare账号，登录后进入 [Cloudflare Pages](https://dash.cloudflare.com/) → 点击 **Create a project** → 关联你的 Git 仓库。
   - **构建配置**：
     - 框架预设：没有Hexo选项，空着。
     - 构建命令：`npm install && npm run build`这里执行安装`package.json`里面的插件和命令。
     - 输出目录：`public`
     - 环境变量：`NODE_VERSION=22`控制nodejs版本与你构建一致
     - 根目录：留空默认/

#### 3.3 部署与访问

点击 **Save and Deploy**，等待构建完成后，通过 Cloudflare 分配的域名（如 `xxx.pages.dev`）访问。
若你有自己的域名（如 `blog.example.com`），可绑定到 Cloudflare Pages，实现全球代理发送你的网站：
- 将域名解析到 Cloudflare， 在 Cloudflare 控制台 → **Websites** → 点击 **Add a site**，输入你的域名（如 `example.com`），按提示完成 DNS 解析配置（将域名服务器改为 Cloudflare 提供的服务器）。

- 在 Pages 项目中绑定域名，进入你的 Pages 项目 → **Custom domains** → **Set up a custom domain** → 输入子域名（如 `blog.example.com`）→ 点击 **Add custom domain**。Cloudflare 会自动添加 DNS 记录（CNAME 指向 `项目名.pages.dev`），并配置免费 SSL 证书（几分钟后生效）。

- 更新 Hexo 配置，为避免静态资源路径错误，需修改 Hexo 根目录的 `_config.yml`：
   ```yaml
   url: https://blog.example.com  # 改为你的自定义域名
   root: /  # 保持默认
   ```
   推送修改后，Cloudflare 会自动重新构建，确保资源路径正确。

### 4. 部署到 Netlify/Vercel

#### 4.1 Netlify部署

这两个平台均支持自动构建部署，比Cloudflare简单，大概步骤类似，默认设置点点点搞定，目前Vercel作为备用站：
- 在 Netlify/Vercel 控制台导入 Hexo 源代码仓库。

- **配置构建参数**
  
   - 框架预设：`hexo`
   - 构建命令：`hexo generate`
   - 输出目录：`public`
   
- **部署**

   平台会自动安装依赖（`npm install`）并执行构建，完成后提供临时域名，支持绑定自定义域名。

#### 4.2 集成 Vercel 分析工具 

在 Hexo 中集成 Vercel 分析工具 `@vercel/analytics` 需要通过修改主题模板，将分析代码注入到所有页面中（因为 Hexo 是静态站点生成器，需确保代码被打包到最终生成的 HTML 里）。具体步骤如下：

步骤 1：安装依赖

在 Hexo 项目根目录（即 `_config.yml` 所在目录）执行以下命令，安装 `@vercel/analytics`：

```bash
npm install @vercel/analytics --save
```

步骤 2：创建分析代码注入脚本

由于 Hexo 不直接支持在模板中导入 npm 包，需要先将 `@vercel/analytics` 的核心代码提取为可在浏览器中运行的脚本，再注入到页面中。

1. 在 Hexo 项目的 `source/js/` 目录下（如果没有 `js` 目录则创建），新建 `vercel-analytics.js` 文件，内容如下：

   ```js
   // 从 @vercel/analytics 包中提取核心逻辑（适配浏览器环境）
   (function() {
     const script = document.createElement('script');
     script.src = 'https://cdn.vercel-insights.com/v1/script.js';
     script.defer = true;
     // 替换为你的 Vercel 项目 ID（可选，不填则自动关联当前部署的项目）
     // script.dataset.project = '你的项目ID'; 
     document.head.appendChild(script);
   })();
   ```

   说明：这是 Vercel 官方提供的 CDN 方式，无需依赖本地 npm 包，更适合静态站点（比直接导入 npm 包更简单）。

步骤 3：修改主题模板，注入脚本

需要将上述脚本添加到所有页面的 `<head>` 或 `<body>` 中（推荐放在 `<head>` 底部，不阻塞页面渲染）。

1. 找到你正在使用的 Hexo 主题的布局文件，通常在 `themes/[你的主题名]/layout/` 目录下，常见的全局模板文件有：

   - `_partial/head.ejs`（头部模板，所有页面都会加载）
   - `_partial/footer.ejs`（底部模板）

   以主流主题（如 Next、Stellar 等）为例，推荐修改 `head.ejs`：

2. 编辑 `themes/[你的主题名]/layout/_partial/head.ejs`，在文件末尾添加以下代码（引入刚才创建的脚本）：

   ```ejs
   <!-- 引入 Vercel Analytics 脚本 -->
   <% if (!is_amp()) { %> <!-- 非 AMP 页面才加载 -->
     <script src="/js/vercel-analytics.js"></script>
   <% } %>
   ```

   说明：

   - `is_amp()` 是 Hexo 的内置函数，用于排除 AMP 页面（避免冲突），如果你的主题不支持 AMP，可以直接写 `<script src="/js/vercel-analytics.js"></script>`。
   - 路径 `/js/vercel-analytics.js` 对应步骤 2 中创建的 `source/js/vercel-analytics.js`（Hexo 会将 `source` 目录下的文件直接复制到生成的静态文件中）。

步骤 4：构建并部署

1. 本地测试是否生效：

   ```bash
   hexo clean && hexo g && hexo s
   ```

   启动后访问 `http://localhost:4000`，打开浏览器开发者工具（F12）的「Network」面板，查看是否加载了 `vercel-analytics.js` 和 `script.js`（来自 Vercel CDN），若有则说明注入成功。

2. 部署到 Vercel：

   将代码提交到关联 Vercel 的 Git 仓库，Vercel 会自动构建部署：

   ```bash
   git add .
   git commit -m "Add Vercel Analytics to Hexo"
   git push origin main
   ```

步骤 5：验证数据

部署成功后，登录 [Vercel 控制台](https://vercel.com/)，进入你的 Hexo 项目，左侧菜单点击「Analytics」，即可查看访问数据（通常有 5-10 分钟延迟）。

### 5.  **GitHub Actions** 工作流配置

要实现一次代码推送后自动部署到 **GitHub Pages、Vercel、Cloudflare Pages** 三个平台，可通过 **GitHub Actions** 配置统一的工作流。以下是针对这三个平台的详细自动化部署方案：

#### 5.1 准备

1. 项目已托管在 GitHub 仓库（如 Hexo、Vue、React 等静态项目）。
2. 已在三个平台完成基础配置：
   - **GitHub Pages**：仓库开启 Pages 功能（目标分支设为 `gh-pages`）。
   - **Vercel**：导入 GitHub 仓库创建项目（无需手动部署，后续通过 Action 触发）。
   - **Cloudflare Pages**：通过 GitHub 关联仓库创建项目（构建命令和输出目录先暂填，后续通过 Action 覆盖）。
3. 获取各平台的部署凭证（敏感信息，存储在 GitHub Secrets 中）：

| 平台             | 所需凭证                                              | 获取方式                                                     |
| ---------------- | ----------------------------------------------------- | ------------------------------------------------------------ |
| GitHub Pages     | 个人访问令牌（PAT），需勾选 `repo` 和 `workflow` 权限 | [GitHub PAT 生成](https://github.com/settings/tokens/new)    |
| Vercel           | Vercel 令牌（Token）+ 项目 ID+USER ID                 | Vercel 控制台 → 账户设置 → `Tokens`；项目设置 → `General` 中获取项目 ID;菜单中找到 Account→ Genera→ USER ID |
| Cloudflare Pages | Cloudflare API 令牌 + 账户 ID + 项目名称              | Cloudflare 控制台 → 我的个人资料 → `API Tokens`（创建含 `Pages:Edit` 权限的令牌）；账户 ID 在 Workers 和 Pages 页面获取；项目名称为 Cloudflare Pages 中创建的项目名 |

#### 5.2 配置 GitHub Actions

- 进入 GitHub 仓库 → `Settings` → `Secrets and variables` → `Actions` → `New repository secret`，添加以下凭证：

  - `GH_TOKEN`：GitHub Pages 的 PAT

  - `VERCEL_TOKEN`：Vercel 令牌

  - `VERCEL_ORG_ID`：Vercel组织/用户ID

  - `VERCEL_PROJECT_ID`：Vercel 项目 ID

  - `CF_API_TOKEN`：Cloudflare API 令牌

  - `CF_ACCOUNT_ID`：Cloudflare 账户 ID

  - `CF_PROJECT_NAME`：Cloudflare Pages 项目名称

- 创建工作流配置文件，在项目根目录创建 `.github/workflows/deploy.yml`，内容如下：

{% folding 查看代码 %}

```yaml deploy.yaml
name: 彻底禁用Jekyll的自动部署
on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 20

    steps:
      - name: 拉取代码
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: 检查主题目录
        run: |
          if [ ! -d "themes/stellar" ]; then
            echo "错误：themes/stellar目录不存在！"
            exit 1
          fi

      - name: 安装Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22.x
          cache: 'npm'

      - name: 安装依赖
        run: |
          npm install hexo-cli -g
          npm install
          cd themes/stellar && npm install && cd ../../

      - name: 构建静态文件
        run: |
          hexo clean
          hexo generate

      # 核心强化：确保.nojekyll文件存在且正确
      - name: 强制生成并验证.nojekyll
        run: |
          # 在public目录生成.nojekyll（覆盖可能存在的旧文件）
          echo "生成.nojekyll文件..."
          touch public/.nojekyll
          # 验证文件是否存在
          if [ ! -f "public/.nojekyll" ]; then
            echo "错误：.nojekyll文件生成失败！"
            exit 1
          fi
          # 查看文件权限（确保可读）
          ls -la public/.nojekyll
          echo "确认：.nojekyll文件已正确生成"

      # 部署到gh-pages分支（强制覆盖旧内容）
      - name: 部署到GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GH_TOKEN }}
          publish_dir: ./public
          publish_branch: gh-pages
          force_orphan: true  # 强制创建全新的gh-pages分支，清除历史缓存
          keep_files: false   # 不保留旧文件，确保.nojekyll是最新的

      # 其他平台部署步骤（不变）
      - name: 部署到Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./public
          vercel-args: '--prod'
        continue-on-error: true

      - name: 部署到Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          accountId: ${{ secrets.CF_ACCOUNT_ID }}
          projectName: ${{ secrets.CF_PROJECT_NAME }}
          directory: ./public
          branch: main
        continue-on-error: true

```
{% endfolding %}

- 推送代码触发自动部署

```bash
# 提交工作流文件
git add .github/workflows/deploy.yml
git commit -m "Add auto-deploy workflow to 3 platforms"
git push origin main
```
也可以写入脚本`deploy.sh`，放在博客根目录，更新博客后终端执行./deploy.sh即可完成代码推送至Github。
{% folding 查看代码 %}

```
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
```
{% endfolding %}

- 查看部署状态

- 部署进度：GitHub 仓库 → `Actions` → 选择当前工作流 → 查看实时日志。

    ![image-20251008140032841](https://u.sam7.top/dJ8twb)

- 结果验证：
  - GitHub Pages：访问 `https://<用户名>.github.io/<仓库名>`
  - Vercel：访问 Vercel 项目分配的域名（如 `<项目名>.vercel.app`）
  - Cloudflare Pages：访问 Cloudflare 分配的域名（如 `<项目名>.pages.dev`）

- **部署失败排查**：

    查看 GitHub Actions 日志中的错误信息，常见问题：

    - 凭证错误（Secrets 名称或值不正确）
    - 构建命令失败（依赖安装错误，需检查 `package.json`）
    - 静态文件目录错误（确保 `publish_dir` 与实际输出目录一致）

通过此配置，每次向 `main` 分支推送代码时，GitHub Actions 会自动完成构建并同步部署到三个平台，实现 “一次推送，多平台联动更新”。

#### 5.3  常见问题与解决

- **部署后页面空白 / 样式丢失**
   - 原因：`_config.yml` 中 `url` 配置错误，或静态资源路径引用问题。
   - 解决：确保 `url` 与实际域名一致（如 `url: https://yourname.github.io`），并执行 `hexo clean` 重新生成。

- **平台构建失败（提示缺少依赖）**
   - 原因：`package.json` 未提交到仓库，或依赖未正确声明。
   - 解决：确保 `package.json` 和 `package-lock.json` 已提交，必要时在构建命令前加 `npm install`（如 `npm install && hexo generate`）。

- **部署后 404 错误**
   - 原因：部署分支或输出目录配置错误。
   - 解决：确认 GitHub Pages 指向的分支正确（如 `main`），或 Cloudflare/Netlify 的输出目录为 `public`。

- **Github 自动部署jekyll构建问题**

   ![image-20251008100720419](https://u.sam7.top/k5JJSc)

   - 原因：Github默认使用jekyll主题构建，识别到主题不是jekyll报错。
   - 解决：可以生成一个.nojekyll文件来禁用jekyll部署，再工作流中增加public文件下.nojekyll
   - 根目录也添加 `.nojekyll`（双重保险）,虽然工作流已在 `public` 目录生成 `.nojekyll`，但可在仓库根目录也添加一个，防止 GitHub 误读：

   ```bash
   # 本地仓库根目录执行
   touch .nojekyll
   git add .nojekyll
   git commit -m "根目录添加.nojekyll，禁用Jekyll"
   git push origin main
   ```

   通过以上步骤，能从工作流配置、仓库设置、缓存清理三个层面彻底禁用 Jekyll，确保 GitHub Pages 直接托管 Hexo 生成的静态文件。核心逻辑是：**确保 `.nojekyll` 被正确部署到 `gh-pages` 分支的根目录，且 GitHub 识别到该文件**。

### 6. **笔记**

- - 本地 Git 仓库应跟踪 Hexo 源代码（`_config.yml`、`source`、`themes` 等），而非 `public` 目录（可在 `.gitignore` 中忽略）。
   - 部署平台通过源代码自动构建生成 `public` 目录，避免手动上传静态文件。
   
- **定期备份配置**

   重要配置文件（`_config.yml`、主题配置 `_config.stellar.yml` 等）建议备份，避免误删。

- **绑定自定义域名**

   各平台均支持绑定自定义域名，需在域名解析平台添加对应的 DNS 记录（如 CNAME 指向平台提供的域名）。


- **自动部署配置（代码更新后自动同步）**

   Cloudflare Pages 默认开启 **自动部署**：当你向关联的 Git 分支（如 `main`）推送新代码时，会自动触发构建并更新博客，无需手动操作。
   验证自动部署：

   ```bash
   # 本地修改一篇文章或配置
   git add .
   git commit -m "Update blog content"
   git push origin main
   ```
   推送后，在 Cloudflare Pages 控制台的 **Deployments** 页面会看到新的构建任务，完成后博客会自动更新。
   通过以上步骤，可顺利将 Hexo 博客部署到主流平台。若遇到具体错误，可结合部署日志（如平台提供的构建日志）定位问题，重点检查配置文件和依赖是否正确。

### **7. 总结**

以上几种部署 Hexo 的核心流程是：**Git 仓库关联 → 配置构建参数 → 自动构建部署**。其优势在于依托于Cloudflare Pages 免费、全球 CDN 加速、自动部署和简单的域名绑定。按上述步骤操作，即使是新手也能顺利完成部署，且国内访问速度优于 GitHub Pages。若遇到具体错误，可在 Cloudflare Pages 的 **Deployments** 页面查看详细日志，针对性解决即可。



