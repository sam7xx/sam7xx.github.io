---
title: hexo博客优化与推荐配置
abbrlink: 
tags:
  - hexo配置
  - typora配置
description: 记录Hexo完成搭建后的优化配置，包括博客的SEO优化、资源文件压缩、国内CDN镜像源加速以及typora配置，优化网页加载速度，提升码字效率。
categories: 博客搭建
date: 2025-11-07 13:10:00
---

### 1. SEO(搜索引擎)优化

SEO优化是提升网站在搜索引擎自然搜索结果中排名的手段，在 Hexo 博客中优化 SEO（搜索引擎优化），主要从 **元标签配置、站点地图、链接结构、内容优化** 等方面入手，以下是具体实现步骤：

#### 1.1 基础配置

首先在根目录 `_config.yml` 中设置基础信息，让搜索引擎识别博客的基本属性：

```yaml _config.yml
title: 你的博客名称  # 搜索引擎显示的标题（含核心关键词）
subtitle: 博客副标题  # 补充说明，可选
description: 博客的核心描述（100-150字，包含主要关键词）  # 影响搜索引擎收录时的摘要
keywords: [关键词1, 关键词2, 技术博客, ...]  # 博客核心关键词，用逗号分隔
author: 你的名字  # 作者名，可能出现在搜索引擎结果中
language: zh-CN  # 语言，默认中文
timezone: Asia/Shanghai  # 时区，确保文章时间正确
```

#### 1.2 优化页面元标签

元标签（Meta Tags）是搜索引擎抓取页面的核心依据，需要为每个页面（首页、文章页、分类页等）配置 **独特的标题和描述**。

安装主题 SEO 插件（推荐）

如果使用 `hexo-theme-stellar`、`next` 等主流主题，通常已支持 SEO 配置，无需额外开发。若主题不支持，可安装通用插件：

```bash
npm install hexo-generator-seo-friendly-sitemap --save  # 增强型元标签支持
```

手动修改主题模板（通用方法）

进入主题的模板目录（如 `themes/stellar/layout`），找到页面头部模板（通常是 `_partial/head.ejs` 或 `head.jade`），添加或修改以下元标签：

```html
<!-- 在 head 标签内添加 -->
<!-- 标题：首页用博客名，文章页用「文章标题 | 博客名」 -->
<title><% if (is_home) { %><%= config.title %><% } else if (is_post) { %><%= page.title %> | <%= config.title %><% } else { %><%= page.title || config.title %><% } %></title>

<!-- 描述：首页用 config.description，文章页用 page.description 或摘要 -->
<meta name="description" content="<% if (is_post) { %><%= page.description || page.excerpt || config.description %><% } else { %><%= config.description %><% } %>">

<!-- 关键词：文章页优先用 page.keywords，否则用全局关键词 -->
<meta name="keywords" content="<% if (page.keywords) { %><%= page.keywords %><% } else { %><%= config.keywords.join(',') %><% } %>">

<!--  canonical 标签：避免重复内容（重要） -->
<link rel="canonical" href="<%= page.permalink %>">

<!-- Open Graph 标签：优化社交媒体分享（可选） -->
<meta property="og:title" content="<%= page.title || config.title %>">
<meta property="og:type" content="<%= is_post ? 'article' : 'website' %>">
<meta property="og:url" content="<%= page.permalink %>">
<meta property="og:description" content="<%= page.description || page.excerpt || config.description %>">
```

<span style="background:#FFFFFF;">**说明**：</span>

- <span style="background:#FFFFFF;">文章页的 `description` 和 `keywords` 可在文章 Front-matter 中单独设置（优先级高于全局）</span><span style="color:#FFFF00;"></span>：

  ```markdown
  ---
  title: Hexo SEO 优化指南
  date: 2025-10-08
  description: 本文详细介绍 Hexo 博客的 SEO 优化方法，包括元标签、站点地图配置等。
  keywords: [Hexo SEO, 博客优化, 搜索引擎收录]
  ---
  ```

#### 1.3 生成站点地图

站点地图是搜索引擎抓取的 “导航图”，帮助爬虫快速发现所有页面。

安装站点地图生成插件：

```bash
# 生成标准 sitemap（适用于 Google、Bing 等）
npm install hexo-generator-sitemap --save

# 生成百度专属 sitemap（百度对标准 sitemap 支持较差）
npm install hexo-generator-baidu-sitemap --save
```

配置站点地图：

在 `_config.yml` 中添加插件配置：

```yaml
# 标准 sitemap 配置
sitemap:
  path: sitemap.xml  # 生成的文件路径（根目录下）
  template: ./sitemap.xml  # 模板（默认即可）
  rel: false  # 是否在页面 head 中添加 sitemap 链接（可选）

# 百度 sitemap 配置
baidusitemap:
  path: baidusitemap.xml  # 百度专用站点地图
```

```xml sitemap.xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  {% for post in posts %}
  <url>
    <loc>{{ post.permalink | uriencode | replace('&', '&amp;') }}</loc>
    {% if post.updated %}
    <lastmod>{{ post.updated | formatDate }}</lastmod>
    {% elif post.date %}
    <lastmod>{{ post.date | formatDate }}</lastmod>
    {% endif %}
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  {% endfor %}

  <url>
    <loc>{{ config.url | uriencode | replace('&', '&amp;') }}</loc>
    <lastmod>{{ sNow | formatDate }}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  {% for tag in tags %}
  <url>
    <loc>{{ tag.permalink | uriencode | replace('&', '&amp;') }}</loc>
    <lastmod>{{ sNow | formatDate }}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.2</priority>
  </url>
  {% endfor %}

  {% for cat in categories %}
  <url>
    <loc>{{ cat.permalink | uriencode | replace('&', '&amp;') }}</loc>
    <lastmod>{{ sNow | formatDate }}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.2</priority>
  </url>
  {% endfor %}
</urlset>
    
```

执行 `hexo g` 生成博客时，会自动在 `public` 目录下生成 `sitemap.xml` 和 `baidusitemap.xml`。

#### 1.4 配置 robots.txt

`robots.txt` 告诉搜索引擎哪些页面可以抓取、哪些禁止，需放在 `source` 目录下（确保生成后在 `public` 根目录）。

1. 在 `source` 目录创建 `robots.txt`：

```txt
# 允许所有搜索引擎抓取
User-agent: *
Allow: /

# 禁止抓取隐私页面（如关于页、标签页等，可选）
# Disallow: /about/
# Disallow: /tags/

# 指向站点地图（重要）
Sitemap: https://你的博客域名/sitemap.xml
Sitemap: https://你的博客域名/baidusitemap.xml
```

```xml sitemap.xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  {% for post in posts %}
  <url>
    <loc>{{ post.permalink | uriencode | replace('&', '&amp;') }}</loc>
    {% if post.updated %}
    <lastmod>{{ post.updated | formatDate }}</lastmod>
    {% elif post.date %}
    <lastmod>{{ post.date | formatDate }}</lastmod>
    {% endif %}
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  {% endfor %}

  <url>
    <loc>{{ config.url | uriencode | replace('&', '&amp;') }}</loc>
    <lastmod>{{ sNow | formatDate }}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  {% for tag in tags %}
  <url>
    <loc>{{ tag.permalink | uriencode | replace('&', '&amp;') }}</loc>
    <lastmod>{{ sNow | formatDate }}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.2</priority>
  </url>
  {% endfor %}

  {% for cat in categories %}
  <url>
    <loc>{{ cat.permalink | uriencode | replace('&', '&amp;') }}</loc>
    <lastmod>{{ sNow | formatDate }}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.2</priority>
  </url>
  {% endfor %}
</urlset>
    
```

```ejs baidusitemap.ejs
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <% posts.forEach(post => { %>
    <% if (post.categories && post.categories.length) { %>
      <% 
        // 处理基础URL（去除末尾斜杠，避免重复）
        const baseUrl = (config.baidusitemap.url || config.url).replace(/\/$/, '');
        // 处理根路径（去除末尾斜杠）
        const root = config.root.replace(/\/$/, '');
        // 处理文章路径（去除开头斜杠）
        const postPath = post.path.replace(/^\//, '');
        // 拼接完整URL（确保路径格式正确）
        let fullUrl = `${baseUrl}${root ? '/' + root : ''}/${postPath}`;

        // 1. 第一次转义&为&amp;（核心）
        fullUrl = fullUrl.replace(/&/g, '&amp;');
        // 2. 编码中文等特殊字符（不影响已转义的&amp;）
        fullUrl = encodeURI(fullUrl);
        // 3. 第二次转义&（双重保险）
        fullUrl = fullUrl.replace(/&/g, '&amp;');

        // 处理最后修改时间（百度要求YYYY-MM-DD）
        const updateDate = post.updated || post.date;
        const lastmod = updateDate.format('YYYY-MM-DD');
      %>
      <url>
        <loc><%= fullUrl %></loc>
        <lastmod><%= lastmod %></lastmod>
      </url>
    <% } %>
  <% }) %>
</urlset>
```

确保 `robots.txt` 被正确生成：执行 `hexo g` 后，检查 `public/robots.txt` 是否存在。

#### 1.5 优化链接结构

Hexo 默认永久链接包含日期（如 `/2025/10/08/title/`），不利于 SEO（URL 过长且无关键词）。建议修改为简洁格式：

在 `_config.yml` 中设置：

```yaml
permalink: :title/  # 仅保留文章标题（需确保标题唯一）
# 或包含分类（更推荐）：
# permalink: :category/:title/
```

**注意**：修改后需执行 `hexo clean` 清除旧链接缓存，避免 404 错误。

#### 1.6 内容与细节优化

**文章标题与内容**：

- 标题包含核心关键词（如 “Hexo SEO 优化指南” 而非 “如何优化我的博客”）。
- 首段包含关键词，正文自然分布关键词（避免堆砌）。
- 使用标题层级（`#` 到 `######`），`h1` 仅用于文章标题，`h2-h3` 分章节，帮助搜索引擎理解结构。

**图片优化**：

- 为所有图片添加 `alt` 属性（描述图片内容，含关键词）：

  ```markdown
  ![图片描述（含关键词）](图片路径)  # Markdown 语法
  ```

- 压缩图片大小（可使用 `hexo-image-optimization` 插件自动压缩）。

**内部链接**：

文章中合理添加其他相关文章的链接（如 “相关推荐”），帮助搜索引擎抓取更多页面。

#### 1.7 提交站点到搜索引擎

配置完成后，主动提交站点让搜索引擎快速收录：

**Google**：

- 登录 [Google Search Console](https://search.google.com/search-console)，添加网站域名。
- 通过 “站点地图” 功能提交 `https://你的域名/sitemap.xml`。

**百度**：

- 登录 [百度资源平台](https://ziyuan.baidu.com/)，验证网站。
- 提交 `https://你的域名/baidusitemap.xml` 到 “站点地图” 模块。

**其他引擎**：

必应（Bing）、搜狗等同理，提交对应站点地图即可。

#### 1.8 验证 SEO 效果

1. 使用 [Google 搜索控制台](https://search.google.com/search-console) 或 [百度资源平台](https://ziyuan.baidu.com/) 查看收录状态、抓取错误等。
2. 用 [SEO 检测工具](https://seositecheckup.com/) 检查元标签、站点地图是否生效。
3. 在搜索引擎中搜索 `site:你的域名`（如 `site:sam7.top`），查看已收录的页面数量。

通过以上步骤，Hexo 博客的 SEO 基础配置就完成了。SEO 是长期过程，核心还是优质内容 + 规范的技术配置，坚持更新和优化即可逐步提升收录和排名。

#### 1.9 自动推送

安装autopush插件`npm install hexo-seo-autopush --save`，支持百度、谷歌、必应等自动推送。

主题配置文件中添加以下内容，配置百度、谷歌、必应sitemap自动推送。

```yaml
seo_autopush:
  # 是否启用插件
  enable: true
  # 推送的搜索引擎（支持百度、谷歌等，按需添加）
  providers:
    # 百度搜索资源平台推送（需先在百度验证站点）
    baidu:
      # 百度站点的 token（从百度搜索资源平台获取）
      token: "http://data.zz.baidu.com/urls?site=https://sam7.top&token=百度站点的 token"
      # 推送类型：自动推送（auto）或手动推送（manual），默认 auto
      type: "auto"
    # 谷歌搜索控制台推送（可选）
    google:
      # 谷歌站点的 API 密钥（从谷歌云平台获取）
      apiKey: "谷歌API访问密钥"
      # 谷歌站点的站点ID（从谷歌搜索控制台获取）
      siteId: "sc-domain%3Asam7.top"
    bing:
      apiKey: "必应API访问密钥"  # 第二步获取的密钥
      siteUrl: "https://yourdomain.com"  # 已验证的站点URL（需与必应管理工具中一致）
  # 是否只在生产环境（hexo generate）时推送（推荐 true，避免开发时重复推送）
  onlyProduction: true
```

