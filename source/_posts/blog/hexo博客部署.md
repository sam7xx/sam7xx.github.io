---
title: hexo部署
date: 2025-10-07 12:17:21
tags: [hexo配置,hexo部署]
categories: 博客搭建
---

Hexo 部署是将本地生成的静态博客内容发布到服务器或托管平台的过程，常见的部署目标包括 GitHub Pages、Netlify、Vercel、Cloudflare Pages 等。以下是详细的部署步骤和常见问题解决方案：

### **一、部署前的准备工作**

1. **完成本地博客搭建**

   确保本地已安装 Hexo 并初始化博客，能正常生成静态文件：

   ```bash
   # 本地预览确认无误
   hexo clean  # 清理缓存
   hexo g      # 生成静态文件（输出到 public 目录）
   hexo s      # 本地预览（访问 http://localhost:4000 确认内容）
   ```

   

2. **配置 `_config.yml` 中的部署信息**

   打开 Hexo 根目录的 `_config.yml`，找到 `deploy` 配置项，根据目标平台填写信息（示例见下文）。

### **二、常用部署方式详解**

#### **方式 1：部署到 GitHub Pages（最常用）**

适合个人博客，免费且稳定，步骤如下：

1. **创建 GitHub 仓库**

   新建仓库，命名为 `用户名.github.io`（如 `yourname.github.io`），确保仓库为公共仓库。

2. **安装部署插件**

   ```bash
   npm install hexo-deployer-git --save
   ```

3. **配置 `_config.yml`**

   ```yaml
   deploy:
     type: git
     repo: https://github.com/yourname/yourname.github.io.git  # 仓库地址
     branch: main  # 部署分支（默认 main 或 master，根据仓库设置调整）
     message: "Hexo deploy: {{ now('YYYY-MM-DD HH:mm:ss') }}"  # 提交信息（可选）
   ```

   

4. **执行部署**

   ```bash
   hexo clean && hexo g && hexo d  # 清理、生成、部署
   ```

5. **访问博客**

   部署成功后，访问 `https://yourname.github.io` 即可看到博客。

#### **方式 2：部署到 Cloudflare Pages（推荐国内访问）**

Cloudflare Pages 提供全球 CDN 加速，国内访问速度较快：

1. **将代码推送到 GitHub/GitLab**

   确保仓库包含完整的 Hexo 源代码（包括 `package.json`、`_config.yml` 等），而非仅 `public` 目录。

2. **在 Cloudflare 控制台创建 Pages 项目**

   - 进入 [Cloudflare Pages](https://dash.cloudflare.com/) → 点击 **Create a project** → 关联你的 Git 仓库。
   - **构建配置**：
     - 框架预设：选择 `Hexo`
     - 构建命令：`hexo generate`
     - 输出目录：`public`
     - 环境变量：无需额外配置（默认已安装 Node.js）

3. **部署与访问**

   点击 **Save and Deploy**，等待构建完成后，通过 Cloudflare 分配的域名（如 `xxx.pages.dev`）访问，也可绑定自定义域名。

#### **方式 3：部署到 Netlify/Vercel（简化流程）**

这两个平台均支持自动构建部署，步骤类似：

1. **关联仓库**

   在 Netlify/Vercel 控制台导入 Hexo 源代码仓库。

2. **配置构建参数**

   - 构建命令：`hexo generate`
   - 输出目录：`public`

3. **部署**

   平台会自动安装依赖（`npm install`）并执行构建，完成后提供临时域名，支持绑定自定义域名。

### **三、部署失败的常见问题与解决**

1. **`hexo d` 提示无权限**
   - 原因：Git 仓库认证失败。
   - 解决：使用 SSH 地址（`git@github.com:yourname/yourrepo.git`）而非 HTTPS，或配置 Git 凭证。
2. **部署后页面空白 / 样式丢失**
   - 原因：`_config.yml` 中 `url` 配置错误，或静态资源路径引用问题。
   - 解决：确保 `url` 与实际域名一致（如 `url: https://yourname.github.io`），并执行 `hexo clean` 重新生成。
3. **平台构建失败（提示缺少依赖）**
   - 原因：`package.json` 未提交到仓库，或依赖未正确声明。
   - 解决：确保 `package.json` 和 `package-lock.json` 已提交，必要时在构建命令前加 `npm install`（如 `npm install && hexo generate`）。
4. **部署后 404 错误**
   - 原因：部署分支或输出目录配置错误。
   - 解决：确认 GitHub Pages 指向的分支正确（如 `main`），或 Cloudflare/Netlify 的输出目录为 `public`。

### **四、最佳实践**

1. **区分源代码与静态文件**

   - 本地 Git 仓库应跟踪 Hexo 源代码（`_config.yml`、`source`、`themes` 等），而非 `public` 目录（可在 `.gitignore` 中忽略）。
   - 部署平台通过源代码自动构建生成 `public` 目录，避免手动上传静态文件。

2. **定期备份配置**

   重要配置文件（`_config.yml`、主题配置 `_config.stellar.yml` 等）建议备份，避免误删。

3. **绑定自定义域名**

   各平台均支持绑定自定义域名，需在域名解析平台添加对应的 DNS 记录（如 CNAME 指向平台提供的域名）。

通过以上步骤，可顺利将 Hexo 博客部署到主流平台。若遇到具体错误，可结合部署日志（如平台提供的构建日志）定位问题，重点检查配置文件和依赖是否正确。

将 Hexo 博客部署到 **Cloudflare Pages** 是一个高效且对国内访问友好的方案（依托 Cloudflare 全球 CDN）。以下是**超详细的分步指南**，从准备工作到最终访问，涵盖所有关键步骤和注意事项：

### **一、准备工作**

#### 1. 必备条件

- 一个 **Cloudflare 账号**（免费账号即可，[点击注册](https://dash.cloudflare.com/sign-up)）。
- 一个 **Git 仓库**（GitHub、GitLab、Bitbucket 均可），存放你的 Hexo 源代码（非 `public` 目录，需包含 `_config.yml`、`package.json`、`source` 等核心文件）。
- 本地已完成 Hexo 博客搭建，能通过 `hexo g` 生成 `public` 目录（确保本地构建正常）。

### **二、详细部署步骤**

#### 步骤 1：将 Hexo 源代码推送到 Git 仓库

Cloudflare Pages 需通过 Git 仓库拉取代码并自动构建，因此需先将本地代码推送到远程仓库：

1. **初始化本地 Git 仓库**（若未初始化）：

   ```bash
   cd /path/to/your/hexo/blog # 进入 Hexo 博客根目录
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

2. **提交并推送代码到远程仓库**：

   ```bash
   git add . # 添加所有文件（排除 .gitignore 中指定的内容）
   git commit -m "Initial commit: Hexo source code" # 提交
   # 关联远程仓库（替换为你的仓库地址）
   git remote add origin https://github.com/your-username/your-repo.git
   # 推送（首次推送加 -u 关联分支）
   git push -u origin main
   ```

#### 步骤 2：在 Cloudflare 控制台创建 Pages 项目

1. **登录 Cloudflare 控制台**

   进入 [Cloudflare 主页](https://dash.cloudflare.com/)，输入账号密码登录。

2. **进入 Pages 服务**

   在左侧导航栏找到 **Workers & Pages** → 点击 **Pages** → 点击 **Create a project**。

3. **关联 Git 仓库**

   - 选择 **Connect to Git** → 授权 Cloudflare 访问你的 Git 账号（如 GitHub）。
   - 从仓库列表中选择你的 Hexo 源代码仓库（即步骤 1 中推送的仓库），点击 **Begin setup**。

#### 步骤 3：配置构建参数（核心步骤）

进入项目配置页面，按以下参数设置（直接影响构建是否成功）：

| 配置项                     | 具体值 / 操作                                                |
| -------------------------- | ------------------------------------------------------------ |
| **Project name**           | 自定义项目名称（如 `my-hexo-blog`，会影响默认域名：`项目名.pages.dev`） |
| **Production branch**      | 选择代码所在分支（通常是 `main` 或 `master`）                |
| **Framework preset**       | 点击下拉框，选择 **Hexo**（Cloudflare 会自动填充基础构建命令，可减少配置错误） |
| **Build command**          | 保持默认的 `hexo generate`（若自定义主题需额外依赖，可改为 `npm install && hexo generate`） |
| **Build output directory** | 必须为 `public`（Hexo 生成的静态文件默认存放目录）           |
| **Root directory**         | 留空（默认使用仓库根目录，若 Hexo 代码在子文件夹中，需填写子文件夹路径） |
| **Environment variables**  | 点击 **Add variable**，添加 `NODE_VERSION` = `18`（指定 Node.js 版本，避免依赖安装错误） |

设置完成后，点击 **Save and Deploy** 开始首次构建。

#### 步骤 4：等待构建完成并验证

1. **查看构建日志**

   页面会跳转至构建进度页，可实时查看日志。若构建成功，会显示 **Deployment successful**；若失败，日志会提示具体错误（如依赖缺失、配置错误等）。

2. **访问默认域名**

   构建成功后，页面会显示分配的默认域名（格式：`项目名.pages.dev`），点击即可访问博客。

   示例：若项目名为 `my-hexo-blog`，则默认域名为 `my-hexo-blog.pages.dev`。

#### 步骤 5：绑定自定义域名（可选但推荐）

若你有自己的域名（如 `blog.example.com`），可绑定到 Cloudflare Pages，提升专业性：

1. **将域名解析到 Cloudflare**

   - 在 Cloudflare 控制台 → **Websites** → 点击 **Add a site**，输入你的域名（如 `example.com`），按提示完成 DNS 解析配置（将域名服务器改为 Cloudflare 提供的服务器）。

2. **在 Pages 项目中绑定域名**

   - 进入你的 Pages 项目 → **Custom domains** → **Set up a custom domain** → 输入子域名（如 `blog.example.com`）→ 点击 **Add custom domain**。
   - Cloudflare 会自动添加 DNS 记录（CNAME 指向 `项目名.pages.dev`），并配置免费 SSL 证书（几分钟后生效）。

3. **更新 Hexo 配置**

   为避免静态资源路径错误，需修改 Hexo 根目录的 `_config.yml`：

   ```yaml
   url: https://blog.example.com  # 改为你的自定义域名
   root: /  # 保持默认
   ```

   

   推送修改后，Cloudflare 会自动重新构建，确保资源路径正确。

### **三、自动部署配置（代码更新后自动同步）**

Cloudflare Pages 默认开启 **自动部署**：当你向关联的 Git 分支（如 `main`）推送新代码时，会自动触发构建并更新博客，无需手动操作。

验证自动部署：

```bash
# 本地修改一篇文章或配置
git add .
git commit -m "Update blog content"
git push origin main
```

推送后，在 Cloudflare Pages 控制台的 **Deployments** 页面会看到新的构建任务，完成后博客会自动更新。

### **四、常见问题与解决**

#### 1. 构建失败：`hexo: command not found`

- **原因**：未安装 Hexo 依赖。
- **解决**：修改 **Build command** 为 `npm install && hexo generate`（强制安装依赖后再构建）。

#### 2. 部署后页面空白 / 样式丢失

- **原因**：`_config.yml` 中 `url` 配置与实际访问域名不一致，导致资源路径错误。
- **解决**：确保 `url` 与访问域名一致（如 `https://blog.example.com`），并推送修改触发重新构建。

#### 3. 构建超时或依赖安装缓慢

- **原因**：Node.js 版本不兼容或依赖包过大。
- **解决**：在 **Environment variables** 中指定稳定的 Node.js 版本（如 `NODE_VERSION=18`），并确保 `package.json` 中仅包含必要依赖。

#### 4. 自定义域名提示 “SSL 证书未生效”

- **原因**：DNS 解析未生效或证书正在签发。
- **解决**：等待 5-10 分钟，或在 **SSL/TLS** 页面设置为 **Full** 模式。

### **五、总结**

Cloudflare Pages 部署 Hexo 的核心流程是：**Git 仓库关联 → 配置构建参数 → 自动构建部署**。其优势在于免费、全球 CDN 加速、自动部署和简单的域名绑定。按上述步骤操作，即使是新手也能顺利完成部署，且国内访问速度优于 GitHub Pages。

若遇到具体错误，可在 Cloudflare Pages 的 **Deployments** 页面查看详细日志，针对性解决即可。
