---
title: hexo博客优化与推荐配置
abbrlink: 50019
tags:
  - hexo配置
  - typora配置
description: 记录Hexo完成搭建后的优化配置，包括博客的SEO优化、资源文件压缩、国内CDN镜像源加速以及typora配置，优化网页加载速度，提升写作效率。
categories: [博客搭建]
menu_id: post
date: 2025-11-07 13:10:00
---

## 1. SEO(搜索引擎)优化

参考文章：[Hexo优化:速度与SEO - 笔搁纸鸯](https://b.wihi.top/posts/72699cf7.html)

SEO优化是提升网站在搜索引擎自然搜索结果中排名的手段，在 Hexo 博客中优化 SEO（搜索引擎优化），主要从 **元标签配置、站点地图、链接结构、内容优化** 等方面入手，以下是具体实现步骤：

### 1.1 基础配置

首先在根目录 `_config.yml` 中设置基础信息，让搜索引擎识别博客的基本属性：

```yml _config.yml
title: 你的博客名称  # 搜索引擎显示的标题（含核心关键词）
subtitle: 博客副标题  # 补充说明，可选
description: 博客的核心描述（100-150字，包含主要关键词）  # 影响搜索引擎收录时的摘要
keywords: [关键词1, 关键词2, 技术博客, ...]  # 博客核心关键词，用逗号分隔
author: 你的名字  # 作者名，可能出现在搜索引擎结果中
language: zh-CN  # 语言，默认中文
timezone: Asia/Shanghai  # 时区，确保文章时间正确
```

### 1.2 优化页面元标签

元标签（Meta Tags）是搜索引擎抓取页面的核心依据，需要为每个页面（首页、文章页、分类页等）配置 **独特的标题和描述**。

安装主题 SEO 插件（推荐）

如果使用 `hexo-theme-stellar`、`next` 等主流主题，通常已支持 SEO 配置，无需额外开发。若主题不支持，可安装通用插件：

{% copy npm install hexo-generator-seo-friendly-sitemap --save  # 增强型元标签支持 prefix:$ %}

手动修改主题模板（通用方法）

进入主题的模板目录（如 `themes/stellar/layout`），找到页面头部模板（通常是 `_partial/head.ejs` 或 `head.jade`），添加或修改以下元标签：

```html _partial/head.ejs
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

**说明**：文章页的 `description` 和 `keywords` 可在文章 Front-matter 中单独设置（优先级高于全局）：

```markdown
---
title: Hexo SEO 优化指南
date: 2025-10-08
description: 本文详细介绍 Hexo 博客的 SEO 优化方法，包括元标签、站点地图配置等。
keywords: [Hexo SEO, 博客优化, 搜索引擎收录]
---
```

### 1.3 生成站点地图

站点地图是搜索引擎抓取的 “导航图”，帮助爬虫快速发现所有页面。

安装站点地图生成插件：

{% copy npm install hexo-generator-sitemap --save # 生成标准 sitemap（适用于 Google、Bing 等） prefix:$ %}

{% copy npm install hexo-generator-baidu-sitemap --save # 生成百度专属 sitemap（百度对标准 sitemap 支持较差） prefix:$ %}

配置站点地图：

在 `_config.yml` 中添加插件配置：

```yml blog/_config.yml
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

### 1.4 配置 robots.txt

`robots.txt` 告诉搜索引擎哪些页面可以抓取、哪些禁止，需放在 `source` 目录下（确保生成后在 `public` 根目录）。

1. 在 `source` 目录创建 `robots.txt`：

```txt robots.txt
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

### 1.5 优化链接结构

Hexo 默认永久链接包含日期（如 `/2025/10/08/title/`），不利于 SEO（URL 过长且无关键词）。建议修改为简洁格式：

在 `_config.yml` 中设置：

```yml blog/_config.yml
permalink: :title/  # 仅保留文章标题（需确保标题唯一）
# 或包含分类（更推荐）：
# permalink: :category/:title/
```

**注意**：修改后需执行 `hexo clean` 清除旧链接缓存，避免 404 错误。

### 1.6 内容与细节优化

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

### 1.7 提交站点到搜索引擎

配置完成后，主动提交站点让搜索引擎快速收录：

**Google**：

- 登录 [Google Search Console](https://search.google.com/search-console)，添加网站域名。
- 通过 “站点地图” 功能提交 `https://你的域名/sitemap.xml`。

**百度**：

- 登录 [百度资源平台](https://ziyuan.baidu.com/)，验证网站。
- 提交 `https://你的域名/baidusitemap.xml` 到 “站点地图” 模块。

**其他引擎**：

必应（Bing）、搜狗等同理，提交对应站点地图即可。

### 1.8 验证 SEO 效果

1. 使用 [Google 搜索控制台](https://search.google.com/search-console) 或 [百度资源平台](https://ziyuan.baidu.com/) 查看收录状态、抓取错误等。
2. 用 [SEO 检测工具](https://seositecheckup.com/) 检查元标签、站点地图是否生效。
3. 在搜索引擎中搜索 `site:你的域名`（如 `site:sam7.top`），查看已收录的页面数量。

通过以上步骤，Hexo 博客的 SEO 基础配置就完成了。SEO 是长期过程，核心还是优质内容 + 规范的技术配置，坚持更新和优化即可逐步提升收录和排名。

### 1.9 自动推送

{% copy npm install hexo-seo-autopush --save #安装autopush插件，支持百度、谷歌、必应等自动推送。 prefix:$ %}

根目录配置文件中添加以下内容，配置百度、谷歌、必应sitemap自动推送。

```yml _config.yml
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

## 2. AI搜索引擎优化

针对AI搜索引擎的优化策略，核心是从传统关键词匹配转向语义理解，重点关注内容权威性、答案直接性和用户体验，使内容更易被AI抓取并作为答案源引用。

AI搜索引擎的目标是**为用户提供最准确、最有用的信息**。因此，最好的优化策略就是**创建真正有价值的内容**，并通过适当的技术手段确保这些内容能够被AI正确理解和引用。

### 2.1 文章标题优化

文章整体使用3级标题：文章标题使用h1标签，章节标题使用h2标签，章节副标题使用h3标签。

```html
<!-- 加强语义标记 -->
<article itemscope itemtype="https://schema.org/Article">
  <h1 itemprop="headline">文章标题</h1>
  <div itemprop="articleBody">
    <section aria-labelledby="section1">
      <h2 id="section1">章节标题</h2>
      <p>内容...</p>
    </section>
  </div>
</article>
```

### 2.2 文章内容优化

- 为视频添加详细文字稿
- 为图片提供丰富的alt文本
- 包含信息图表和数据可视化
- 添加音频内容的文字版本

### 2.3  AI搜索友好内容特征

1. **准确性** - 信息准确无误，有可靠来源支持
2. **完整性** - 全面覆盖话题的所有重要方面
3. **实用性** - 提供可操作的建议和具体步骤
4. **权威性** - 展示专业资质和经验证明
5. **时效性** - 包含最新信息和数据
6. **可读性** - 结构清晰，语言通俗易懂
7. **独特性** - 提供独特的见解和原创研究
8. **可信度** - 透明披露信息来源和潜在偏见
9. **用户体验** - 页面加载快速，移动端友好

AI搜索引擎的目标是**为用户提供最准确、最有用的信息**。因此，最好的优化策略就是**创建真正有价值的内容**，并通过适当的技术手段确保这些内容能够被AI正确理解和引用。

## 3. 资源文件压缩

使用`hexo-all-minifier`插件在构建时通过删除空格和缩进自动压缩HTML、CSS、JavaScript和图片文件，降低文件大小，提升网站加载速度。

- 终端安装

  {% copy npm install hexo-all-minifier --save prefix:$ %}

- 在 `_config.yml` 中启用配置：

```yml blog/_config.yml
all_minifier: true
```

- **重新生成博客**
  保存配置文件后，在终端中执行以下命令`hexo cl & hexo g & hexo s`，插件就会在构建过程中自动压缩相关文件了：效果如下

![image-20251108094452118](https://u.sam7.top/EnMZ2H)

- 可选配置

 如果你希望对不同类型的文件压缩进行更精细的控制（例如排除某些已压缩的文件），可以在 `_config.yml` 文件中进行更详细的配置：

```yml _config.yml
all_minifier:
  # HTML压缩配置
  html:
    enable: true
    exclude: # 排除特定文件，例如所有已压缩的html文件
      - '*.min.html'
  # CSS压缩配置
  css:
    enable: true
    exclude:
      - '*.min.css'
  # JavaScript压缩配置
  js:
    enable: true
    mangle: true # 混淆变量名，进一步减小文件体积
    exclude:
      - '*.min.js'
  # 图片压缩配置
  image:
    enable: true
    exclude: # 排除已压缩的图片文件
      - '*.min.png'
      - '*.min.jpg'
      - '*.min.jpeg'
      - '*.min.gif'
```

## 4. jsDelivr国内公益镜像加速

参考文章：[分享几个JSDelivr国内公益加速镜像 - 流月小站](https://blog.flowmoon.cn/archives/105.html)

将CDN加速镜像都换成[JSDMirror镜像站-jsdelivr国内;jsdelivr镜像](https://cdn.jsdmirror.com/)，提升加载速度，可以加速**GitHub 仓库、JS文件、CSS文件、npm插件**。

![image-20251108094747452](https://u.sam7.top/zzxT4Z)

![image-20251108095959461](https://u.sam7.top/Z4fFWW)

![image-20251108095911037](https://u.sam7.top/BY24Db)

基本守则：

作为公益性质的加速站点，我们在使用过程中也应该遵守一些基本的规则：

`不要用于个人图床加速`：图床消耗大量的带宽，不建议使用公共 CDN 来加速个人图片的访问，特别是那些大图或高频访问的图片，甚至有些人放一些视频在公共CDN上，这会极大的消耗公共资源。

`不要加速字体文件`：字体文件通常非常大，会对带宽造成很大的压力。

## 5. Typora插件安装配置

- Typora_Plugin插件安装

 按照[typora_plugin/README-cn.md at master · obgnail/typora_plugin](https://github.com/obgnail/typora_plugin/blob/master/README-cn.md)README.md指引安装Typora插件

 Typora_Plugin功能非常强大，集成以下61个插件功能。

| #    | 插件                    | 功能                                 | 默认启用 |
| :--- | :---------------------- | :----------------------------------- | :------- |
| 1    | window_tab              | 标签页管理                           |          |
| 2    | search_multi            | 多元文件搜索                         |          |
| 3    | collapse_paragraph      | 章节折叠                             | ×        |
| 4    | collapse_list           | 列表折叠                             | ×        |
| 5    | collapse_table          | 表格折叠                             | ×        |
| 6    | md_padding              | 中英文混排优化                       |          |
| 7    | slash_commands          | 斜杠命令                             |          |
| 8    | templater               | 文件模板                             |          |
| 9    | resource_manager        | 一键清除无用图片                     |          |
| 10   | fence_enhance           | 复制、折叠、格式化代码               |          |
| 11   | toc                     | 在右侧生成大纲目录                   |          |
| 12   | commander               | 命令行环境                           |          |
| 13   | toolbar                 | 多功能搜索                           |          |
| 14   | right_click_menu        | 右键菜单统一管理插件                 |          |
| 15   | pie_menu                | 圆盘菜单                             | ×        |
| 16   | datatables              | 表格增强（搜索、过滤、分页、排序等） | ×        |
| 17   | preferences             | 插件配置                             |          |
| 18   | markmap                 | 提供 markmap 组件支持                |          |
| 19   | echarts                 | 提供 echarts 组件支持                |          |
| 20   | chart                   | 提供 chartjs 组件支持                |          |
| 21   | drawIO                  | 提供 drawIO 组件支持                 |          |
| 22   | abc                     | 提供 abcjs 组件支持                  |          |
| 23   | calendar                | 提供 tui.calendar 组件支持           |          |
| 24   | wavedrom                | 提供 wavedrom 组件支持               |          |
| 25   | marp                    | 提供 marp 组件支持                   |          |
| 26   | plantUML                | 提供 PlantUML 组件支持               | ×        |
| 27   | callouts                | 提供 callouts 支持                   |          |
| 28   | text_stylize            | 文字风格化                           |          |
| 29   | read_only               | 只读模式                             |          |
| 30   | blur                    | 模糊模式                             |          |
| 31   | kanban                  | 看板                                 |          |
| 32   | timeline                | 时间线                               |          |
| 33   | chat                    | 聊天                                 |          |
| 34   | file_counter            | 显示目录下的文件数                   |          |
| 35   | auto_number             | 章节、表格、图片、代码块等自动编号   |          |
| 36   | imageReviewer           | 图片查看器                           |          |
| 37   | chineseSymbolAutoPairer | 中文符号自动补全                     |          |
| 38   | resize_table            | 调整表格行高列宽                     |          |
| 39   | resize_image            | 调整图片显示大小                     |          |
| 40   | export_enhance          | 导出 HTML 时避免图片丢失             |          |
| 41   | markdownLint            | markdown 格式检查                    |          |
| 42   | go_top                  | 一键到文章顶部、底部                 |          |
| 43   | truncate_text           | 暂时隐藏内容，提高大文件渲染性能     | ×        |
| 44   | dark                    | 夜间模式                             |          |
| 45   | no_image                | 无图模式                             |          |
| 46   | updater                 | 一键升级插件                         |          |
| 47   | easy_modify             | 编辑工具                             |          |
| 48   | editor_width_slider     | 写作区宽度调整                       |          |
| 49   | redirectLocalRootUrl    | 重定向本地资源根目录                 | ×        |
| 50   | blockSideBySide         | 并列显示活动块                       | ×        |
| 51   | scrollBookmarker        | 书签管理器                           | ×        |
| 52   | cipher                  | 加密文件                             | ×        |
| 53   | ripgrep                 | 使用 ripgrep 搜索文件                | ×        |
| 54   | article_uploader        | 一键上传博客到支持的所有平台         | ×        |
| 55   | sortableOutline         | 拖动大纲标题，调整文章结构           | ×        |
| 56   | cursor_history          | 光标跳转                             | ×        |
| 57   | static_markers          | Markdown 标记常显                    | ×        |
| 58   | custom                  | 开放平台，用户自定义插件（高级）     |          |
| 59   | hotkeys                 | 快捷键注册中心（高级）               |          |
| 60   | quickButton             | 于右下角添加功能按钮（高级）         |          |
| 61   | json_rpc                | 外部操纵 Typora（高级）              | ×        |

- 斜杠命令兼容stellar标签

 参考文章：[使用Typora_plugin增强Stellar写作体验 - Thun888](https://blog.hzchu.top/2024/使用Typora-plugin增强Stellar写作体验/)

 typora强大的插件生态与Stellar主题丰富的标签功能相结合，能够极大提升Markdown写作效率和内容表现力。

{% folders %}
<!-- folder 折叠 -->

```toml Typora\resources\plugin\global\settings\settings.user.toml
[slash_commands]
# 命令列表
#  - enable:    是否启用
#  - type:      snippet/command。前者表示在调用时插入文字片段，后者表示在调用时执行逻辑命令
#  - icon(可选): 使用emoji作为图标
#  - hint(可选): 提示信息
#  - keyword:   关键词
#  - callback:  若type=snippet，则填入需要插入的文字片段，若type=command，则填入回调函数的字符串
COMMANDS = [
    { enable = true, type = "snippet", icon = "😺", hint = "插入表情标签", keyword = "emoji", callback = "{% emoji  %}" },
    { enable = true, type = "snippet", icon = "🪄", hint = "插入标记标签", keyword = "mark", callback = "{% mark  color: %}" },
    { enable = true, type = "snippet", icon = "🏷️", hint = "插入hashtag标签", keyword = "hashtag", callback = "{% hashtag  color: %}" },
    { enable = true, type = "snippet", icon = "📷", hint = "插入image图片标签", keyword = "image", callback = "{% image  download: width: padding: bg: %}" },
    { enable = true, type = "snippet", icon = "🧇", hint = "插入quot引用标签", keyword = "quot", callback = "{% quot  icon:hashtag %}" },
    { enable = true, type = "snippet", icon = "🦉", hint = "插入poetry诗词标签", keyword = "poetry", callback = "{% poetry 游山西村 author:陆游 footer:诗词节选 %}\n{% endpoetry %}" },
    { enable = true, type = "snippet", icon = "📃", hint = "插入note备注块标签", keyword = "note", callback = "{% note [title] content color: %}" },
    { enable = true, type = "snippet", icon = "🔗", hint = "插入link链接卡片标签", keyword = "link", callback = "{% link href [title] [icon:src] [desc:true/false] %}" },
    { enable = true, type = "snippet", icon = "▶", hint = "插入button按钮标签", keyword = "button", callback = "{% button text url [icon:key/src] [color:color] [size:xs] %}" },
    { enable = true, type = "snippet", icon = "🎯", hint = "插入okr目标管理标签", keyword = "okr", callback = "{% okr o1 %}\n{% endokr %}" },
    { enable = true, type = "snippet", icon = "📚", hint = "插入copy复制行标签", keyword = "copy", callback = "{% copy [code] prefix:$ %}" },
    { enable = true, type = "snippet", icon = "🔘", hint = "插入radio单选标签", keyword = "radio", callback = "{% radio checked:true [name] %}" },
    { enable = true, type = "snippet", icon = "☑️", hint = "插入checkbox复选标签", keyword = "radio", callback = "{% checkbox symbol: color: checked: [name] %}" },
    { enable = true, type = "snippet", icon = "🎶", hint = "插入audio音频标签", keyword = "audio", callback = "{% audio  %}" },
    { enable = true, type = "snippet", icon = "📽️", hint = "插入video视频标签", keyword = "video", callback = "{% video  %}" },
    { enable = true, type = "snippet", icon = "🧭", hint = "插入navbar导航栏标签", keyword = "navbar", callback = "{% navbar active:/wiki/ [文章](/) [项目](/wiki/) %}" },
    { enable = true, type = "snippet", icon = "📅", hint = "插入timeline时间线标签", keyword = "timeline", callback = "{% timeline %}\n<!-- node [text] -->\n{% endtimeline %}" },
    { enable = true, type = "snippet", icon = "📁", hint = "插入folders文件夹/折叠容器标签", keyword = "folders", callback = "{% folders %}\n<!-- folder 题目1 -->\n{% endfolders %}" },
    { enable = true, type = "snippet", icon = "👥", hint = "插入friends友链标签", keyword = "friends", callback = "{% friends [name] %}" },
    { enable = true, type = "snippet", icon = "🌐", hint = "插入sites站点标签", keyword = "sites", callback = "{% sites 分组名 %}" },
    { enable = true, type = "snippet", icon = "📝", hint = "插入md标签,渲染外部 markdown 文件", keyword = "md", callback = "{% md [url] %}" },
    { enable = true, type = "snippet", icon = "📚", hint = "插入toc文档目录树标签", keyword = "toc", callback = "{% toc wiki:xxx [open:true] [display:mobile] title %}" },
    { enable = true, type = "snippet", icon = "📦", hint = "插入box盒子容器标签", keyword = "box", callback = "{% box [title] [color:color] [child:codeblock/tabs] %}\n{% endbox %}" },
    { enable = true, type = "snippet", icon = "🔖", hint = "插入tabs分栏容器标签", keyword = "tabs", callback = "{% tabs active: align:center %}\n<!-- tab [name] -->\n{% endtabs %}" },
    { enable = true, type = "snippet", icon = "🔲", hint = "插入grid标签", keyword = "grid", callback = "{% grid bg:box/card %}\n<!-- cell -->\n{% endgrid %}" },
    { enable = true, type = "snippet", icon = "🖼️", hint = "插入gallery图库容器标签", keyword = "gallery", callback = "{% gallery %}\n{% endgallery %}" },
    { enable = true, type = "snippet", icon = "📚", hint = "插入albums专辑容器标签", keyword = "albums", callback = "{% albums [group_id] %}" },
    { enable = true, type = "snippet", icon = "🖼️", hint = "插入posters海报容器标签", keyword = "posters", callback = "{% posters [group_id] %}" },
    { enable = true, type = "snippet", icon = "🖼️", hint = "插入banner横幅容器标签", keyword = "banner", callback = "{% banner [name] bg: %}\n{% endbanner %}" },
    { enable = true, type = "snippet", icon = "📸", hint = "插入swiper轮播容器标签", keyword = "swiper", callback = "{% swiper effect:cards %}\n\n{% endswiper %}" },
    { enable = true, type = "snippet", icon = "👤", hint = "插入ghcard标签", keyword = "ghcard", callback = "{% ghcard [name] %}" },
    { enable = true, type = "snippet", icon = "🌙", hint = "插入ghcard标签（暗黑主题）", keyword = "ghcard-dark", callback = "{% ghcard [name] theme:dark %}" },
    { enable = true, type = "snippet", icon = "🔐", hint = "插入psw密码标签", keyword = "psw", callback = "{% psw 密码 %}" },
    { enable = true, type = "snippet", icon = "🔽", hint = "插入u下划线标签", keyword = "u", callback = "{% u 下划线 %}" },
    { enable = true, type = "snippet", icon = "🔆", hint = "插入emp着重号标签", keyword = "emp", callback = "{% emp 着重号 %}" },
    { enable = true, type = "snippet", icon = "🌊", hint = "插入wavy波浪线标签", keyword = "wavy", callback = "{% wavy 波浪线 %}" },
    { enable = true, type = "snippet", icon = "❌", hint = "插入del删除线标签", keyword = "del", callback = "{% del 删除线 %}" },
    { enable = true, type = "snippet", icon = "🔺", hint = "插入sup上角标标签", keyword = "sup", callback = "{% sup 上角标 %}" },
    { enable = true, type = "snippet", icon = "🔻", hint = "插入sub下角标标签", keyword = "sub", callback = "{% sub 下角标 %}" },
    { enable = true, type = "snippet", icon = "⌨️", hint = "插入kbd键盘样式标签", keyword = "kbd", callback = "{% kbd ⌘ %}" }
]

```


{% endfolders %}

![image-20251108120707055](https://u.sam7.top/KNxhCJ)
