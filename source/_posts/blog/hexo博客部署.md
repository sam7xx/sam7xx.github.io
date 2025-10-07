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
- **Github/Vercel/Cloudflare 账号**免费额度个人博客够用了。
- 一个 **Git 仓库**（GitHub、GitLab 均可），存放你的 Hexo 源代码（非 `public` 目录，需包含 `_config.yml`、`package.json`、`source` 等核心文件）。
- 本地已完成 Hexo 博客搭建，能通过 `hexo g` 生成 `public` 目录（确保本地构建正常）。

### 2. 部署到 GitHub Pages（最常用）
适合个人博客，免费但有时候不太稳定，当备用站使用，具体操作步骤如下：
- 在Github新建仓库，命名为  `yourname.github.io`，确保仓库为公共仓库。
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
- 执行部署` hexo clean && hexo g && hexo d  # 清理、生成、部署` 部署成功后，访问 `https://yourname.github.io` 即可看到博客，也可以重定向绑定自己的域名，由Cloudflare托管。

### 3. 部署到 Cloudflare Pages（推荐国内访问）

Cloudflare Pages 提供全球 CDN 加速，国内访问速度较快，目前作为主站使用：

#### 3.1 推送Hexo源码到 GitHub/Gitlab (关键)

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

#### 3.2 Cloudflare 控制台创建 Pages 项目

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

这两个平台均支持自动构建部署，比Cloudflare简单，大概步骤类似，默认设置点点点搞定，目前Vercel作为备用站：
- 在 Netlify/Vercel 控制台导入 Hexo 源代码仓库。

- **配置构建参数**
   
   - 框架预设：`hexo`
   - 构建命令：`hexo generate`
   - 输出目录：`public`
   
- **部署**

   平台会自动安装依赖（`npm install`）并执行构建，完成后提供临时域名，支持绑定自定义域名。

### 5. 部署失败的常见问题与解决

- **`hexo d` 提示无权限**
   - 原因：Git 仓库认证失败。
   - 解决：使用 SSH 地址（`git@github.com:yourname/yourrepo.git`）而非 HTTPS，或配置 Git 凭证。
- **部署后页面空白 / 样式丢失**
   - 原因：`_config.yml` 中 `url` 配置错误，或静态资源路径引用问题。
   - 解决：确保 `url` 与实际域名一致（如 `url: https://yourname.github.io`），并执行 `hexo clean` 重新生成。
- **平台构建失败（提示缺少依赖）**
   - 原因：`package.json` 未提交到仓库，或依赖未正确声明。
   - 解决：确保 `package.json` 和 `package-lock.json` 已提交，必要时在构建命令前加 `npm install`（如 `npm install && hexo generate`）。
- **部署后 404 错误**
   - 原因：部署分支或输出目录配置错误。
   - 解决：确认 GitHub Pages 指向的分支正确（如 `main`），或 Cloudflare/Netlify 的输出目录为 `public`。

### 6. 心得

- **区分源代码与静态文件**

   - 本地 Git 仓库应跟踪 Hexo 源代码（`_config.yml`、`source`、`themes` 等），而非 `public` 目录（可在 `.gitignore` 中忽略）。
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



