---
title: hexo博客搭建与stellar主题配置
abbrlink: 51727
tags:
  - hexo配置
  - stellar主题
description: 记录使用Hexo搭建个人博客的详细步骤，包括构建工具的安装准备、hexo插件使用和stellar主题配置。
categories: [博客搭建]
topic: 博客搭建
date: 2025-09-20 18:19:42
---

## 1. 构建工具安装准备

### 1.1 Node.js环境搭建

hexo基于Node.js构建,需安装Node.js依赖环境，由于ubuntu系统仓库Node.js比较旧，需前往[Node.js](https://nodejs.cn/en/download)官网按指引安装最新稳定版本。

由于博主使用的是WSL子系统，这里选择Linux系统和nvm安装方式。

首先安装nvm Node.js版本管理器，再使用nvm工具包安装指定版本Node.js，Node.js自带npm软件包管理器，顺便安装yarn JavaScript软件包管理器。

具体操作如下：

```sh shell
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"
# Download and install Node.js:
nvm install 24
# Verify the Node.js version:
node -v # Should print "v24.9.0".
# Verify npm version:
npm -v # Should print "11.6.0".
```

### 1.2 NPM简介

**NPM（Node Package Manager）** 是 Node.js 的默认包管理工具，用于管理 JavaScript 项目的依赖库和工具。它允许开发者轻松地安装、更新、共享和发布代码包，同时支持版本控制和脚本运行。

如果需要加速国内访问，可以配置淘宝镜像：

{% copy npm config set registry https://registry.npmmirror.com prefix:$ %}

以下是一些常用的 NPM 命令：

```sh shell
npm init # 初始化 package.json 文件
npm install # 安装 package.json 中的所有依赖
npm install <包名> --save-dev # 安装开发依赖
npm uninstall <包名> # 卸载依赖
npm update <包名> # 更新依赖
npm list --depth=0 # 查看已安装的依赖
npm audit # 检查依赖中的安全漏洞
npm run <脚本名> # 运行 package.json 中定义的脚本
```

本地与全局安装

{% copy npm install express # 本地安装 将包安装到当前项目的 node_modules 目录，仅对该项目可用。 prefix:$ %}

{% copy npm install -g @vue/cli # 全局安装 使用 -g 参数将包安装到系统范围内，适用于 CLI 工具。   prefix:$ %}

## 2. HEXO配置

### 2.1 hexo安装以及初始化

根据[Hexo](https://hexo.io/zh-cn/)官网安装指引，全局安装`npm install -g hexo@8.0.0`

```sh shell
hexo init blog #初始化blog目录，目录一定为空。
cd blog
npm install #安装hexo所需依赖
hexo cl&hexo g&hexo s #清除缓存&渲染网页&启动本地端口服务
http://localhost:4000/ #点击链接可用浏览器本地预览博客
```

初始化后blog文件夹结构如下.

```sh shell
.
├── _config.yml #hexo配置文件
├── package.json
├── scaffolds #模板文件夹
├── source #资源文件夹，即网页根目录位置
|   ├── _drafts
|   └── _posts
└── themes #主题文件夹
```

### 2.2 hexo配置  开始折腾

本站使用[Stellar](https://xaoxuu.com/wiki/stellar/comments/)主题构建，Stellar 是一个内置文档系统的简约商务风 Hexo 主题，支持丰富的标签和动态数据组件，帮助您简单从容地应对各种表达需求，十分推荐内容创作者使用 Stellar 开始您全新的博客之旅。

{% link <https://xaoxuu.com/wiki/stellar> "stellar主题文档" desc:true %}

{% copy npm i hexo-theme-stellar #安装稳定版本  prefix:$ %}

安装路径位于`blog/node_modules/`文件夹内。

在 `blog/_config.yml` 文件中找到并修改：

`theme: stellar`

将`blog/node_modules/_config.yml` 拷贝一份至`/blog`目录重命名为`_config.stellar.yml`，该配置文件优先级高于主题目录。

参阅Stellar wiki选择开启需要的功能。

## 3. 网站统计

**网页底部文章统计**参考博主[BoBoBlog](https://blog.bxzdyg.cn/)文章

{% copy npm i hexo-wordcount –save #安装hexo-wordcount插件 prefix:$ %}

需要在主题文件footer.ejs里将 `{post_count}` 和 `{word_count}` 替换为实际数据。Stellar 主题页脚渲染时，content 是字符串，可以用 JS 替换。

建议在layoutDiv 函数里，渲染 markdown 前加如下替换：

{% folding 查看代码 %}

```css footer.ejs
<%
// 预处理内容，替换基本变量
let processedContent = theme.footer.content
  ?.replace('{author.name}', (config.author || 'Anonymity'))
  ?.replace('{theme.name}', stellar_info('name'))
  ?.replace('{theme.version}', stellar_info('version'))
  ?.replace('{theme.tree}', stellar_info('tree'))
  ?.replace('{year}', new Date().getFullYear())
  ?.replace('{beian}', (theme.footer.beian?.enable ? theme.footer.beian.icp || '' : ''));

// 文章统计函数
function getPostStats() {
  try {
    // 统计文章数量和字数
    const blogCount = site.posts.length;
    
    // 统计 notes 和 wiki 文章
    let noteCount = 0;
    let wikiCount = 0;
    let totalWordCount = 0;
    
    // 检查所有页面的路径
    if (site.pages) {
      if (site.pages.data) {
        site.pages.data.forEach(page => {
          if (page.source && page.source.startsWith('notes/')) {
            noteCount++;
          }
          if (page.source && page.source.startsWith('wiki/')) {
            wikiCount++;
          }
        });
      } else {
        site.pages.forEach(page => {
          if (page.source && page.source.startsWith('notes/')) {
            noteCount++;
          }
          if (page.source && page.source.startsWith('wiki/')) {
            wikiCount++;
          }
        });
      }
    }
    
    // 计算总字数
    if (typeof totalcount === 'function') {
      totalWordCount = totalcount(site);
    } else {
      // 回退方法：只统计标准文章
      site.posts.forEach(post => {
        if (post.content) {
          const count = wordcount(post.content);
          totalWordCount += parseInt(count) || 0;
        }
      });
    }
    
    return { 
      blogCount, 
      noteCount, 
      wikiCount, 
      totalWordCount 
    };
      
  } catch (error) {
    console.error('统计文章时出错:', error);
    return { blogCount: 0, noteCount: 0, wikiCount: 0, totalWordCount: 0 };
  }
}

function layoutDiv() {
  var el = ''
  el += `<footer class="page-footer${scrollreveal(' ')} footnote">`
  el += '<hr>'
  
  // sitemap
  const sitemap = theme.footer.sitemap
  if (sitemap?.length > 0) {
    var count = sitemap.length
    if ([6].includes(count)) {
      count = 3
    } else if ([7,8].includes(count)) {
      count = 4
    } else {
      count = Math.min(sitemap.length, 5)
    }
    el += `<div class="sitemap" style="column-count:${count};">`
    for (let group of sitemap) {
      let title = group.title
      let items = group.items
      if (items == undefined || items.length == 0) {
        continue
      }
      el += '<div class="sitemap-group">'
      el += '<span class="fs15">' + title + '</span>'
      items.forEach((item, i) => {
        el += '<a href="' + url_for(md_link(item)) + '">'
        el += __(md_text(item))
        el += '</a>'
      });
      el += '</div>'
    }
    el += '</div>'
  }
  
  // footer content
  el += '<div class="text">'
  if (processedContent) {
    // 获取统计信息
    const stats = getPostStats();
    
    // 替换统计占位符
    let contentStr = processedContent
      .replace(/{blog_count}/g, stats.blogCount)
      .replace(/{note_count}/g, stats.noteCount)
      .replace(/{wiki_count}/g, stats.wikiCount)
      .replace(/{word_count}/g, stats.totalWordCount.toLocaleString());
    
    el += markdown(contentStr);
  }
  el += '</div></footer>'
  return el
}
%>
<%- layoutDiv() %>
```

{% endfolding %}

然后在主题配置文件footer:content:增加如下代码，即可实现显示网站总文章字数统计。

```yml blog/_config.stellar.yml
<span class="totalcount">已发布博客{blog_count}篇 · 笔记{note_count}篇 · 文档{wiki_count}篇 · 总计{word_count}字</span>
```

**网页访问统计**由于不蒜子老是挂，现在使用的是Vercount插件，不蒜子的优化版本。[Vercount: 一个比不蒜子更好的网站计数器 | EvanNotFound's Blog](https://ohevan.com/vercount-website-counter-busuanzi-alternative.html)

{% tabs active:1 align:center %}

<!-- tab 显示效果 -->

需要修改主题配置文件，在`footer：→ content：`位置添加如下。内容

![image-20251018141423327](https://u.sam7.top/NYCBsQ)

<!-- tab 修改内容 -->

```yml blog/_config.stellar.yml
  content: | # 支持 Markdown 格式
          <center>

          网站由 [{author.name}](/) © 2025使用 [{theme.name}]({theme.tree}) 主题创建

          <span id="runtime_span"></span>
          <script type="text/javascript">
          function show_runtime() {
              window.setTimeout("show_runtime()", 1000);
              X = new Date("2025/09/06 19:00:00");
              Y = new Date();
              T = (Y.getTime() - X.getTime());
              M = 24 * 60 * 60 * 1000;
              a = T / M;
              A = Math.floor(a);
              b = (a - A) * 24;
              B = Math.floor(b);
              c = (b - B) * 60;
              C = Math.floor((b - B) * 60);
              D = Math.floor((c - C) * 60);
              runtime_span.innerHTML = "网站已运行 " + A + "天" + B + "小时" + C + "分" + D + "秒"
          }
          show_runtime();
          </script>
          <!--不蒜子计数器 https://ohevan.com/vercount-website-counter-busuanzi-alternative.html-->
          <script defer src="https://vercount.one/js"></script>
          <!--添加一个访问量-->
          总访问<span id="busuanzi_value_site_pv"></span>次 · 总访客<span id="busuanzi_value_site_uv"></span>人 · 本页访问<span id="busuanzi_value_page_pv"></span>次
          <span class="totalcount">已发布博客{blog_count}篇 · 笔记{note_count}篇 · 文档{wiki_count}篇 · 总计{word_count}字</span>
          </center>
          <div style="display: flex;justify-content: center;align-items: center;margin: 10px;">
            <a target="_blank" rel="noopener" href="https://notbyai.fyi/"><img class="lazy entered loaded" src="https://u.sam7.top/miGrfX" data-src="https://u.sam7.top/miGrfX" alt="全部都是博主用心学编写的啊！不是ai啊" style="width:100px;height:35px;margin-right: 10px " id="notbyai" data-ll-status="loaded"></a>
            <a target="_blank" rel="noopener" href="https://creativecommons.org/licenses/by-nc-sa/4.0/"><img class="lazy entered loaded" src="https://u.sam7.top/2BJDeW" data-src="https://u.sam7.top/2BJDeW" alt="只要保留原作者姓名并在基于原作创作的新作品适用同类型的许可协议，即可基于非商业目的对原作重新编排、改编或者再创作。" style="width:100px;height:35px" data-ll-status="loaded"></a>
          </div>
```

{% endtabs %}

## 4. 评论系统

### 4.1 waline启用

stellar已集成waline插件，首先主题配置文件选择启用waline，具体配置见以下代码。

然后跟着主页[快速上手 | Waline](https://waline.js.org/guide/get-started/) wiki一步步搭建到vercel。

[SkyReeves](https://skyreeves.github.io/)博主写的很详细，参考[hexo博客引入Waline评论模块 - SkyReeves](https://skyreeves.github.io/post/69ee63d6.html)使用[LeanCloud](https://console.leancloud.app/apps)国际版和Vercel搭建。

{% folding 查看代码 %}

```yml blog/_config.stellar.yml
comments:
  service: waline # beaudar, utterances, giscus, twikoo, waline, artalk
  comment_title: 快来参与讨论吧~
  lazyload: true # true / false
  custom_css: waline # artalk,twikoo,... 可以为没有全局启用的评论加载自定义样式

  waline:
    js: https://unpkg.com/@waline/client@v3/dist/waline.js #https://gcore.jsdelivr.net/npm/@waline/client@3.1/dist/waline.js
    css: https://unpkg.com/@waline/client@v3/dist/waline.css #https://gcore.jsdelivr.net/npm/@waline/client@3.1/dist/waline.css
    meta_css: https://unpkg.com/@waline/client@v3/dist/waline-meta.css 		        #https://gcore.jsdelivr.net/npm/@waline/client@3.1/dist/waline-meta.css
    # Waline server address url, you should set this to your own link
    serverURL: 
    # If false, comment count will only be displayed in post page, not in home page
    commentCount: true
    # Pageviews count, Note: You should not enable both `waline.pageview` and `leancloud_visitors`.
    pageview: false
    locale:
      # #自定义反应标题。如果像我一样不想要反应标题，可以在这一项里留空。
      # reactionTitle:  
      # #反应表情的文章描述
      # reaction0: 爱你哟
      # reaction1: oh~~
      # reaction2: 嘚瑟~
      # reaction3: 无语

      placeholder: 
       嗨，朋友，留个脚印再走呗。  

    #反应表情组
    reaction: 
      - https://img.skyreeves.com/emojis/blobs/ablobcatheart.png
      - https://img.skyreeves.com/emojis/blobs/ablobcatattentionreverse.png
      - https://img.skyreeves.com/emojis/blobs/ablobcatrainbow.png
      - https://img.skyreeves.com/emojis/blobs/blobcatsaitama.png
      - https://img.skyreeves.com/emojis/blobs/blobcatflip.png
    # Custom emoji
    emoji:
      - https://unpkg.com/@waline/emojis@1.1.0/weibo
      - https://unpkg.com/@waline/emojis@1.1.0/alus
      - https://unpkg.com/@waline/emojis@1.1.0/bilibili
      - https://unpkg.com/@waline/emojis@1.1.0/qq
      - https://unpkg.com/@waline/emojis@1.1.0/tieba
      - https://unpkg.com/@waline/emojis@1.1.0/tw-emoji
      - https://unpkg.com/@waline/emojis@1.1.0/bmoji
```

{% endfolding %}



### 4.2 评论框颜色跟随

启用后会发现，评论区域部分元素无法显示，需要修改`waline.styl`文件，调整颜色对比度。

{% box child:tabs %}
{% tabs %}
<!-- tab 设置失效原因 -->

为 `.wl-panel` 强制设置 `background: var(--waline-bgcolor) !important`，这样评论框会跟随主题背景色切换。重新编译并刷新页面验证效果。

<!-- tab 修改后stylus文件 -->

```stylus waline.styl
.wl-panel {
  background: var(--waline-bgcolor) !important;
}

.cmt-body {
  .wl-panel {
    margin: 0.5em 0 !important;
  }
  
  .wl-meta-head {
    padding: 0 !important;
  }
  
  --waline-font-size: 0.9375rem;
  
  /* 浅色模式 - 增强工具栏对比度 */
  --waline-white: #ffffff;
  --waline-light-grey: #2c0e0eff; /* 加深浅灰色，提升文字可读性 */
  --waline-dark-grey: #333333; /* 加深深灰色，增强与背景对比 */
  
  /* 主题色强化 - 使工具栏按钮更突出 */
  --waline-theme-color: #1859bbff; /* 稍深的主题色，增强按钮识别度 */
  --waline-active-color: #5d932b; /* 更鲜明的活跃色，突出点击状态 */
  
  /* 布局颜色 - 增强工具栏区域区分 */
  --waline-color: #188dd1ff;
  --waline-bgcolor: #ffffff;
  --waline-bgcolor-light: #f5f5f5; /* 稍深的浅色背景，使工具栏区域更明显 */
  --waline-bgcolor-hover: #e0e0e0; /* 加深悬停背景，提升交互反馈 */
  --waline-border-color: #cccccc; /* 稍深的边框，使工具栏元素边界更清晰 */
  --waline-disable-bgcolor: #f0f0f0;
  --waline-disable-color: #888888; /* 禁用状态颜色加深，明确不可用状态 */
  --waline-code-bgcolor: #adaaaaff; /* 代码工具栏背景调整 */
  
  /* 特殊颜色 */
  --waline-bq-color: #f0f0f0;
  
  /* 头像 */
  --waline-avatar-size: 3.25rem;
  --waline-m-avatar-size: calc(var(--waline-avatar-size) * 9 / 13);
  
  /* 徽章 - 增强工具栏内徽章对比度 */
  --waline-badge-color: #2980b9; /* 稍深的徽章色，更易识别 */
  --waline-badge-font-size: 0.725em;
  
  /* 信息区域 - 工具栏辅助信息更清晰 */
  --waline-info-bgcolor: #f5f5f5;
  --waline-info-color: #555555; /* 信息文字加深 */
  --waline-info-font-size: 0.725em;
  
  /* 渲染选择 - 强化工具栏元素边框 */
  --waline-border: 1px solid var(--waline-border-color);
  --waline-avatar-radius: 50%;
  --waline-box-shadow: 0 1px 4px rgba(0,0,0,0.15); /* 稍强阴影，突出工具栏区域 */
  
  /* 工具栏特定元素强化 */
  .wl-toolbar {
    border-bottom: 1px solid #e0e0e0; /* 工具栏底部边框加深 */
    padding: 0.5em 0;
    background-color: #fafafa; /* 工具栏背景与主区域区分 */
  }
  
  /* 工具栏按钮增强 */
  .wl-toolbar button {
    color: #555555 !important; /* 按钮图标颜色加深 */
    padding: 0.3em 0.6em;
  }
  
  .wl-toolbar button:hover {
    background-color: #e8e8e8 !important; /* 悬停背景更明显 */
    color: #222222 !important; /* 悬停时图标颜色加深 */
  }
  
  /* 输入框强化 */
  .wl-editor {
    border: 1px solid #dddddd !important;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.05) !important; /* 内阴影增强输入框边界感 */
  }
}

.cmt-body.waline {
  ondark() {
    /* 深色模式增强对比度设置 */
    --waline-white: #0a0a0a;
    --waline-light-grey: #b0b0b0; /* 明显提亮的浅灰色 */
    --waline-dark-grey: #e0e0e0; /* 接近白色的深灰色，提升文字可读性 */
    
    /* 布局颜色 - 更大的明暗差异 */
    --waline-color: #f0f0f0; /* 极亮的文字颜色 */
    --waline-bgcolor: var(--block, #121212); /* 更深的主背景 */
    --waline-bgcolor-light: #222222; /* 明显浅于主背景的次级背景 */
    --waline-bgcolor-hover: #2C3E50; /* 悬停状态明显区分 */
    --waline-border-color: #383838; /* 更粗的视觉边框效果 */
    --waline-disable-bgcolor: #333333;
    --waline-disable-color: #999999; /* 禁用状态与可用状态明显区分 */
    --waline-code-bgcolor: #050810; /* 代码块背景与主背景区分 */
    
    /* 特殊颜色 - 增强区块感 */
    --waline-bq-color: #252525; /* 引用区块明显区分 */
    
    /* 主题色 - 在深色背景上更突出 */
    --waline-theme-color: #2983beff;
    --waline-active-color: #7dd147; /* 更鲜艳的活跃色 */
    --waline-badge-color: #4da6ff; /* 徽章颜色更明亮 */
    
    /* 信息区域 - 增强区分度 */
    --waline-info-bgcolor: #222222;
    --waline-info-color: #cccccc; /* 信息文字更亮 */
    
    /* 强化边框和阴影效果 */
    --waline-border: 1px solid var(--waline-border-color);
    --waline-box-shadow: 0 2px 8px rgba(0,0,0,0.3); /* 更深的阴影增强层次感 */
    
    /* 计数元素特别强化 */
    .wl-count {
      padding: .375em;
      font-weight: bold;
      font-size: 1.25em;
      color: #ffffff;
      background-color: #1C1F21;
      border-radius: 4px;
    }
    
    /* 评论项之间添加分隔线增强区分 */
    .wl-item {
      border-bottom: 1px solid var(--waline-border-color);
      padding: 1em 0;
    }
    
    /* 输入框强化 */
    .wl-editor {
      background-color: #050810 !important;
      border: 1px solid #383838 !important;
      color: #f0f0f0 !important;
    }
  }
  
  :root[data-theme="dark"] & {
    ondark();
  }
  
  :root:not([data-theme]) & {
    @media (prefers-color-scheme: dark) {
      ondark();
    }
  }
}

/* 修复浅色模式下评论标题显示白色的问题 */
/* 1. 基础覆盖：直接指定 .cmt-title 文本颜色 */
.header.cmt-title {
  color: #333333 !important; /* 浅色模式默认深色文本，与白色背景强对比 */
}

/* 2. 精准适配：结合 data-theme="light" 确保只作用于浅色模式 */
:root[data-theme="light"] .header.cmt-title {
  color: #222222 !important; /* 浅色模式下强制深色标题 */
  opacity: 1 !important; /* 避免被其他样式设置透明 */
}

/* 3. 兜底：防止标题内的 p 标签继承白色 */
:root[data-theme="light"] .header.cmt-title p {
  color: inherit !important; /* 继承父级的深色，而非白色 */
  margin: 0; /* 可选：修复可能的默认边距问题 */
}

/* 4. 深色模式兼容（避免影响深色模式） */
:root[data-theme="dark"] .header.cmt-title {
  color: #ffffff !important; /* 深色模式保持白色标题，确保正常显示 */
}
```

{% endtabs %}
{% endbox %}

## 5.  面包屑文章字数统计

主题布局文件article_banner.ejs中添加如下代码，即可实现功能。

{% folding 代码折叠 %}

```ejs article_banner.ejs
<%
var banner = {}

if (page.banner) {
  banner.url = page.banner
} else if (theme.topic.tree[page.topic]?.banner != null) {
  banner.url = theme.topic.tree[page.topic]?.banner
} else if (theme.wiki.tree[page.wiki]?.banner != null) {
  banner.url = theme.wiki.tree[page.wiki]?.banner
}
banner = Object.assign(banner, page.banner_info)
// 标题
if (banner.title == null) {
  banner.title = page.h1 != null ? page.h1 : page.title
}
// 副标题
if (banner.subtitle == null) {
  banner.subtitle = page.subtitle
}

// 生成日期信息（确保更新时间常显）
function layoutDateInfo() {
  const publishTime = page.date ? page.date.format('YYYY-MM-DD') : '未知时间';
  // 无论是否更新都显示更新时间
  const updateTime = page.updated ? page.updated.format('YYYY-MM-DD') : publishTime;
  
  // 使用4个非换行空格分隔（&nbsp;）
  return `<span class="publish-time">发布时间：${publishTime}</span>&nbsp;&nbsp;&nbsp;&nbsp;
          <span class="update-time">更新时间：${updateTime}</span>`;
}

function layoutBreadcrumb() {
  if (page.breadcrumb === false) {
    return `<div class="top"></div>`
  }
  
  // 使用hexo-wordcount计算文章元信息
  let metaInfo = ''
  if (page.layout == 'post' && page.content) {
    // 调用hexo-wordcount提供的函数
    const wordCount = wordcount(page.content);
    const readTime = min2read(page.content);
    // 使用4个非换行空格分隔（&nbsp;）
    metaInfo = `
      <div class="breadcrumb-meta text-sm">
        文章字数：${wordCount}&nbsp;&nbsp;&nbsp;&nbsp;阅读时长：${readTime}分钟
      </div>
    `;
  }
  
  // 构建面包屑导航（三行左对齐布局）
  let el = ''
  el += `<div class="top bread-nav footnote">`
  el += `<div class="left breadcrumb-container">`
  
  // 第一行：面包屑导航（左对齐）
  el += `<div class="flex-row breadcrumb-path text-sm" id="breadcrumb" style="text-align: left;">`
  el += `<a class="cap breadcrumb" href="${pretty_url(config.root)}">${__("btn.home")}</a>`
  if (theme.wiki.tree[page.wiki]) {
    el += partial('breadcrumb/wiki')
  } else if (page.notebook) {
    el += partial('breadcrumb/note')
  } else if (page.layout == 'post') {
    el += partial('breadcrumb/blog')
  } else {
    el += partial('breadcrumb/page')
  }
  el += `</div>`
  
  // 第二行：文章元信息（左对齐）
  el += metaInfo ? `<div style="text-align: left; padding: 4px 0;">${metaInfo}</div>` : ''
  
  // 第三行：日期信息（左对齐，更新时间常显）
  el += `<div class="breadcrumb-date text-sm" style="text-align: left; padding: 4px 0;">`
  el += layoutDateInfo()
  el += `</div>`
  
  el += `</div>` // 关闭.left
  el += `</div>` // 关闭.top
  return el
}

function layoutTitle() {
  if (banner.title?.length > 0) {
    return `<h1 class="text title"><span>${banner.title}</span></h1>`
  } else {
    return ''
  }
}

function layoutSubtitle() {
  if (banner.subtitle?.length > 0) {
    return `<div class="text subtitle">${banner.subtitle}</div>`
  } else {
    return ''
  }
}

function layoutIcon() {
  if (banner.avatar?.length > 0 || banner.icon?.length > 0) {
    return `<img class="lazy avatar" data-src="${banner.avatar || banner.icon}">`
  } else {
    return ''
  }
}

function layoutBottom() {
  const el_icon = layoutIcon()
  const el_title = layoutTitle()
  const el_subtitle = layoutSubtitle()
  let cls = ''
  if (el_title.length > 0 && el_subtitle.length == 0) {
    cls += ' only-title'
  }
  if (el_title.length > 0) {
    return `
    <div class="bottom${cls}">
      ${el_icon}
      <div class="text-area">
        ${el_title}
        ${el_subtitle}
      </div>
    </div>
    `
  } else {
    return ``
  }
}

function layoutDiv() {
  const bottom = layoutBottom()
  if (page.breadcrumb === false && bottom.length == 0) {
    return ``
  }
  const top = layoutBreadcrumb()
  let style = ``
  let el = ``
  el += `<div class="article banner${scrollreveal(' ')} top">`
  if (banner.url?.length > 0) {
    el += `<img class="lazy bg" data-src="${banner.url}">`
    if (banner.color) {
      style += ' style="--text-banner:' + banner.color + '"'
    }
  }

  el += `
  <div class="content"${style}>
    ${top}
    ${bottom}
  </div>
  `
  el += `</div>`
  return el
}
%>
<%- layoutDiv() %>
```

{% endfolding %}

![image-20251018133145461](https://u.sam7.top/ntjjmz)

## 6. 动态图标配置

在主题配置文件_config.stellar.yml中增加以下CSS文件，引入font-awesome图标库。在[font-awesome v7 CDN](https://www.bootcdn.cn/font-awesome/)里面找一个CDN。

``` yml blog/_config.stellar.yml
# 动态图标引入
inject:
  head:
    - <link href="https://cdn.bootcdn.net/ajax/libs/font-awesome/7.0.0/css/all.css" rel="stylesheet">  # fontawesome动态图标引入
```

 图标格式张这样`<i class="fa-solid fa-github fa-brands fa-bounce"></i>`，然后就可以在想要添加图标的地方使用了，[Font Awesome](https://fontawesome.com/)主页搜索相应特性的图标，大部分都是免费的。

```yml blog/_config.stellar.yml
footer: 
  social:
    github:
      icon: '<i class="fa-solid fa-github fa-brands fa-bounce"></i>'
      title: 'Github'
      url : / 
```

![image-20251008112814230](https://u.sam7.top/WjAEkb)

## 7. 图床、图片配置

- [ImgToLink+](https://imgtolinkx.com/)是一款免费、免登录图床软件，支持单个文件50M，返回短链。

![image-20251018221547852](https://u.sam7.top/QZjdN7)

- [16图床，永久免费，无需登录的图床](https://111666.best/)免费的往往很容易挂掉，用作评论区上传图床临时用可以。

  ![image-20251018221644226](https://u.sam7.top/siiZmD)

- Cloudflare好像也有免费的image服务。

### 7.1 Piclist Github图床配置

由于typora支持picgo和piclist图床上传，所以选用了目前还在持续更新的piclist。

typora图片设置如下，插入图片时直接上传piclist图床，然后自动转义图片url。

![image-20251018222011517](https://u.sam7.top/mTDhyZ)

[PicList](https://piclist.cn/)主页下载安装最新版，选择Github图床搭建，参考[PicGo/PicList + Github 搭建图床 | Theo Docs](https://doc.theojs.cn/notes/build-picture-bed)

Gitbhub新建图床仓库，并在设置[Developer Settings](https://github.com/settings/apps)中新建图床token,勾选piclist仓库repo读写权限。

![image-20251108093016232](https://u.sam7.top/Pnsz6Y)

然后再piclist端Github图床设置中关联新建的piclist仓库和token。

![image-20251108100408787](https://u.sam7.top/r4Kka7)

piclist相关设置

- piclist设置图片最大800px宽度，大于800压缩至800，小于800不处理。

- 使用`https://cdn.jsdelivr.net/gh`加速Github图床。
- 上传成功直接复制url链接
- 开启时间戳重命名
- 添加图片水印
- 使用短链接
- 图片格式转换成压缩率更高的AVIF格式

### 7.2 搭建图床短链接

为什么要用短链，部分平台（尤其是社交平台、论坛、旧版编辑器）对 URL 长度或格式有严格限制，包含特殊字符（如 `?` `&` `/`）的长链接，可能被平台误判为 “恶意链接” 而拦截，且原始图床链接可能泄露敏感信息。

piclist上传的图片链接也是一堆乱码，widowns文件系统目录`\`被转义，可以按时间戳重命名图像名称，也可以搭建短链接网站。

参考[xyTom/Url-Shorten-Worker](https://github.com/xyTom/Url-Shorten-Worker/) 主页wiki和[用cloudflare搭建短链接网站](https://blog.houzhongcheng.com/2025/05/30/用cloudflare搭建短链接网站.html)搭建。

![image-20251018112143204](https://u.sam7.top/erBf5k)

![image-20251018105813478](https://u.sam7.top/AEF2tc)

### 7.3 waline评论图床上传

开启waline评论区图床上传，图片能上传成功，但是的识别不了链接。

已经关掉了，PicList回传的不是json，只能选择URL、markdown格式。

### 7.4 fancybox设置

stellar集成fancybox灯箱插件，可以在放大网页上面的图片，功能很多。

[Stellar：表达类标签组件（33+个） - XAOXUU](https://xaoxuu.com/wiki/stellar/tag-plugins/express/#image-图片标签) stellar wiki介绍很详细。

md语法图片格式支持默认全局打开，有个问题就是点击文章海报图片也会放大。

```yml blog/_config.stellar.yml
plugins:

  fancybox:
    enable: true
    loader: /js/plugins/fancybox-loader.js
    js: https://gcore.jsdelivr.net/npm/@fancyapps/ui@6/dist/fancybox/fancybox.umd.js
    css: https://gcore.jsdelivr.net/npm/@fancyapps/ui@6/dist/fancybox/fancybox.css
    # 让 md 语法图片支持放大可以这样写: .md-text img:not([class]), .md-text .image img
    # 可以处理评论区的图片（不支持 iframe 类评论系统）例如：
    # 使用 twikoo 评论可以写: .tk-content img:not([class*="emo"])
    # 使用 waline 评论可以写: #waline_container .vcontent img
    selector: .timenode p>img, waline_container .vcontent img, .custom-image-container a, .md-text img:not([class]), .md-text .image img # 多个选择器用英文逗号隔开
```

## 8. 侧边栏配置

### 8.1 左侧栏页脚图标

stellar主题预留有7个位置，主题配置如下，footer下面添加以下内容。

```yml blog/_config.stellar.yml
###### Footer ######
footer: 
  social:
    github:
      icon: '<i class="fa-solid fa-github fa-brands" style="font-size:1em;"></i>'
      title: 'Github'
      url : https://github.com/sam7xx 
    rss: 
      icon: '<i class="fa-solid fa-rss" style="color: #FF5722;font-size:1em;"></i>'
      title: 'RSS'
      url : /atom.xml
    email: 
      icon: '<i class="fa-solid fa-envelope fa-bounce" style="color: #B197FC;font-size:1em;"></i>'
      title: 'Email'
      url : "mailto://2690640537@qq.com"
    theme:
      icon: '<i class="fa-solid fa-circle-half-stroke fa-flip" style="color: #FFD600;font-size:1em;"></i>'
      title: '主题切换'
      url: 'javascript:void(0);'
    message:
      icon: '<i class="fa-solid fa-message fa-bounce" style="color:#FF9800;font-size:1em;"></i>'
      title: '留言板'
      url: '/messages'
    about:
      icon: '<i class="fa-solid fa-user" style="color:#4CAF50;font-size:1em;"></i>'
      title: '关于作者'
      url: '/about'
    friends:
      icon: '<i class="fa-solid fa-link" style="color:#2196F3;font-size:1em;"></i>'
      title: '友链'
      url: '/friends'
```

![image-20251018133033178](https://u.sam7.top/GGHPGQ)

### 8.2 侧边栏组件

参考主题wiki配置[Stellar：侧边栏组件的配置与使用（9个） - XAOXUU](https://xaoxuu.com/wiki/stellar/widgets/)

可以根据需要添加或者自定义喜欢的组件。[使用Hexo和Stellar搭建个人博客网站【超详细贴心保姆级教程💖】 - BoBoBlog](https://blog.bxzdyg.cn/p/使用Hexo和Stellar搭建个人博客网站/#接入API)

在 `_data/widgets.yml` 文件中添加以下内容，需要自己创建：

```yml _data/widgets.yml
# 欢迎语
welcome:
  layout: markdown
  title: 🎉欢迎
  content: |
    本站托管于Cloudflare, 加载缓慢请耐心等待，欢迎大家畅所欲言。
    <hr style="border: 1px solid black; background-color: black;">
    <span id="jinrishici-sentence"></span>
    <script src="https://sdk.jinrishici.com/v2/browser/jinrishici.js" charset="utf-8"></script>
```

修改主题配置文件，在想要显示的页面添加welcome组件，

```yml blog/_config.stellar.yml
  home:
    leftbar:  welcome, recent, music
    rightbar: tagcloud
  # 博客列表页配置
  index_blog:
    base_dir: blog # 只影响自动生成的页面路径
    menu_id: post # 未在 front-matter 中指定 menu_id 时，layout 为 post 的页面默认使用这里配置的 menu_id
    leftbar:  welcome, recent  # for categories/tags/archives
    rightbar: tagcloud
    nav_tabs:  # 近期发布 分类 标签 专栏 归档 and ...
      # '朋友文章': /friends/rss/
  # 博客专栏列表页配置
```

## 9. 主导航栏配置

### 9.1 启用主导航栏菜单

主题配置文件中设置如下，使用fontawesome图标。

```yml blog/_config.stellar.yml
menubar:
  columns: 5 # 一行多少个
  items: # 可按照自己需求增加，符合以下格式即可
    # id: 页面中高亮的 menu_id 
    # theme: 高亮时的颜色，仅 svg 中 fill="currentColor" 时有效
    # icon: 支持 svg/img 标签，可以定义在 icons.yml 文件中，也支持外部图片的 URL
    # title: 标题
    # url: 点击跳转到哪，支持相对路径和绝对路径
    - id: post
      theme: '#2196F3'
      icon: '<i class="fa-solid fa-newspaper" style="font-size:1.25em;"></i>'
      title: 博客
      url: /blog
    - id: note
      theme: '#4CAF50'
      icon: '<i class="fa-solid fa-pen-to-square" style="font-size:1.25em;"></i>'
      title: 笔记
      url: /note
```

效果展示

![image-20251018225127149](https://u.sam7.top/hGbYrj)

### 9.2 主导航栏下拉菜单设置

菜单栏位置不够放怎么办，那就增加一个下拉菜单吧。在 Hexo 主题（这里是 Stellar 主题）的菜单栏 “更多” 处增加下拉菜单，可按以下步骤操作：

{% tabs active:1 %}

<!-- tab 调整内容 -->

步骤一：修改主题配置文件（`_config.yml`）找到主题配置文件中 `menubar` 部分关于 “更多”（`id: more`）的配置项。

在 `items` 里，为 “更多” 添加子菜单结构。

这里通过 `nested` 字段来定义 “更多” 的下拉子菜单，每个子项包含 `title`（子菜单标题）和 `url`（子菜单跳转链接）。

<!-- tab 主题配置文件 -->

```yml 主题配置文件
menubar:
  columns: 5
  items:
    # 其他菜单项...
    - id: more
      theme: '#CC96F3'
      icon: '<i class="fa-solid fa-caret-down" style="font-size:1.5em;"></i>'
      title: 更多
      # 这里配置子菜单，使用 nested 字段
      nested:
        - title: 子菜单1
          url: /submenu1/
        - title: 子菜单2
          url: /submenu2/
        - title: 子菜单3
          url: /submenu3/
```

{% endtabs %}

{% tabs active:1 %}

<!-- tab 调整内容 -->

步骤二：修改主题模板文件（菜单渲染相关）

Hexo 主题的菜单渲染通常在 `layout` 目录下的相关模板文件 `menu.ejs`中，为 “更多” 菜单项添加下拉菜单的渲染逻辑。

这段代码的作用是：当菜单项（这里是 “更多”）存在 `nested` 子菜单配置时，渲染下拉菜单结构；否则渲染普通链接。

<!-- tab menu.ejs -->

{% folding 查看代码 %}

```html menu.ejs
<%
function layoutDiv() {
  var el = ''
  el += `<nav class="menu dis-select${where == 'main' ? ' mobile-hidden' : ''}">`
  
  // 分离普通菜单项和"更多"菜单项
  const moreItem = (theme.menubar.items || []).find(item => item?.id === 'more');
  const regularItems = (theme.menubar.items || []).filter(item => 
    item && item.id != null && item.url != null && item.id !== 'more'
  );
  
  // 渲染普通菜单项
  for (let item of regularItems) {
    el += `<a class="nav-item${item.id == page.menu_id ? ' active' : ''}" title="${item.title}" href="${pretty_url(item.url)}"`
    if (item.theme?.length > 0) {
      el += ` style="color:${item.theme}"`
    }
    el += `>`
    if (item.icon?.length > 0) {
      el += icon(item.icon, 'no-lazy')
    } else {
      el += `<span>${__(item.title)}</span>`
    }
    el += `</a>`
  }
  
  // 渲染"更多"菜单项及下拉菜单
  if (moreItem) {
    // 检查是否有子菜单配置
    const hasSubmenu = moreItem.nested && moreItem.nested.length > 0;
    
    el += `<div class="nav-item more-dropdown${moreItem.id == page.menu_id ? ' active' : ''}"`;
    if (moreItem.theme?.length > 0) {
      el += ` style="color:${moreItem.theme}"`;
    }
    el += `>`;
    
    // 更多按钮
    el += `<a class="more-toggle" title="${moreItem.title}"`;
    if (!hasSubmenu) {
      el += ` href="${pretty_url(moreItem.url)}"`;
    }
    el += `>`;
    if (moreItem.icon?.length > 0) {
      el += icon(moreItem.icon, 'no-lazy');
    } else {
      el += `<span>${__(moreItem.title)}</span>`;
    }
    el += `</a>`;
    
    // 下拉菜单
    if (hasSubmenu) {
      el += `<div class="more-dropdown-menu">`;
      for (let subItem of moreItem.nested) {
        if (subItem && subItem.title && subItem.url) {
          el += `<a class="dropdown-item" href="${pretty_url(subItem.url)}" title="${subItem.title}">`;
          el += `<span>${__(subItem.title)}</span>`;
          el += `</a>`;
        }
      }
      el += `</div>`;
    }
    
    el += `</div>`;
  }
  
  el += `</nav>`
  return el
}
%>

<%- layoutDiv() %>
```

{% endfolding %}

{% endtabs %}

{% tabs active:1 %}

<!-- tab 调整内容 -->

步骤三：添加样式

如果需要对下拉菜单的样式（如显示 / 隐藏、 hover 效果等）进行自定义，可在主题的样式文件`menu.styl`中添加相关 CSS 规则。示例：

<!-- tab menu.styl -->

{% folding 查看代码 %}

```stylus menu.styl
// 导航区域菜单容器样式
.nav-area .menu
  width: 100% // 宽度占满父容器
  display: grid // 使用网格布局
  margin: 8px 0 // 上下外边距8px，左右0
  grid-template-columns: repeat(hexo-config('menubar.columns'), 1fr) // 从Hexo配置读取列数
  grid-gap: 8px // 网格项间距8px

  // 导航区域菜单滚动条（隐藏）
  &::-webkit-scrollbar
    display: none // 隐藏滚动条本体
  &::-webkit-scrollbar-track-piece
    background: transparent // 滚动条轨道透明
  &::-webkit-scrollbar-thumb
    display: none // 隐藏滚动条滑块

  // 导航区域菜单项样式
  .nav-item
    box-sizing: border-box // 边框盒模型（padding和border不影响宽度）
    width: 100% // 宽度100%
    min-height: 40px // 最小高度40px
    border-radius: var(--border-bar) // 使用圆角变量
    font-size: var(--fs-15) // 15px字体变量
    font-weight: 500 // 中等粗细
    color: var(--text-p3) // 三级文字色
    text-align: center // 文字居中
    background: var(--bg-a50) // 50%透明度背景
    transition: background 0.3s ease // 背景过渡动画
    position: relative // 相对定位
    display: flex // Flex布局
    flex-direction: column // 子元素垂直排列
    align-items: center // 水平居中
    justify-content: center // 垂直居中

    // 导航项文字样式
    span
      text-overflow: ellipsis // 溢出显示省略号
      word-break: keep-all // 不拆分单词

    // 激活/悬停状态
    &.active, &:hover
      color: var(--text-p1) // 一级文字色
      background: var(--bg-a100) // 100%透明度背景

    // 激活状态底部指示条
    &.active:after
      content: '' // 空内容伪元素
      position: absolute // 绝对定位
      width: 16px // 宽度16px
      height: 2px // 高度2px
      left: 50% // 水平居中
      transform: translateX(-50%) // 水平居中偏移
      border-radius: 2px // 圆角2px
      bottom: 2px // 距离底部2px
      background: currentColor // 继承文字颜色

// 基础菜单样式
.menu
  display: flex // Flex布局（横向排列）
  list-style: none // 移除列表默认样式
  padding: 0 // 无内边距
  margin: 0 // 无外边距
  gap: 1rem // 菜单项间距1rem

// 通用导航项样式
.nav-item
  display: flex // Flex布局
  align-items: center // 垂直居中
  justify-content: center // 水平居中
  text-decoration: none // 无下划线
  position: relative // 相对定位（用于下拉菜单）

// 更多菜单下拉容器
.more-dropdown
  position: relative // 相对定位
  display: inline-block // 行内块布局
  z-index: 100 // 层级100

  // 更多下拉菜单样式（恢复原始宽度40px）
  .more-dropdown-menu
    display: none // 默认隐藏
    position: absolute // 绝对定位
    right: 0 // 右对齐
    top: -80px // 上移80px
    background-color: #fff // 亮色背景
    min-width: 40px // 恢复原始最小宽度（适配紧凑布局）
    max-height: 120px // 最大高度
    box-shadow: 0 2px 12px rgba(0,0,0,0.15) // 亮色阴影
    z-index: 9999 // 高层级避免遮挡
    border-radius: 6px // 圆角6px
    overflow-y: auto // 垂直滚动
    overflow-x: hidden // 水平隐藏溢出
    padding: 6px 0 // 上下内边距6px
    box-sizing: border-box // 边框盒模型

    // 更多下拉菜单滚动条
    &::-webkit-scrollbar
      width: 4px // 滚动条宽度4px
    &::-webkit-scrollbar-thumb
      background-color: rgba(0,0,0,0.15) // 亮色滚动条滑块
      border-radius: 2px // 滑块圆角

  // 悬停显示更多下拉菜单
  &:hover .more-dropdown-menu
    display: block // 显示菜单
    animation: fadeIn 0.2s ease // 淡入动画

// 下拉菜单项样式
.dropdown-item
  display: flex // Flex布局
  align-items: center // 垂直居中
  justify-content: center // 水平居中
  width: 100% // 宽度100%
  padding: 10px // 内边距10px
  color: #333 // 亮色文字
  text-decoration: none // 无下划线
  box-sizing: border-box // 边框盒模型

  // 悬停效果（亮色）
  &:hover
    background-color: #f5f5f5 // 亮色悬停背景

// 普通下拉菜单容器
.dropdown
  position: relative // 相对定位
  display: inline-block // 行内块布局
  z-index: 100 // 层级100

  // 普通下拉菜单样式（恢复原始宽度40px）
  .dropdown-menu
    display: none // 默认隐藏
    position: absolute // 绝对定位
    top: -80px // 上移80px
    background-color: #f9f9f9 // 亮色背景
    min-width: 40px // 恢复原始最小宽度（适配紧凑布局）
    max-height: 120px // 最大高度
    box-shadow: 0 2px 12px rgba(0,0,0,0.2) // 亮色阴影
    z-index: 9999 // 高层级避免遮挡
    overflow-y: auto // 垂直滚动
    overflow-x: hidden // 水平隐藏溢出
    padding: 6px 0 // 上下内边距6px
    box-sizing: border-box // 边框盒模型

    // 普通下拉菜单滚动条
    &::-webkit-scrollbar
      width: 4px // 滚动条宽度4px
    &::-webkit-scrollbar-thumb
      background-color: rgba(0,0,0,0.15) // 亮色滚动条滑块
      border-radius: 2px // 滑块圆角

  // 悬停显示普通下拉菜单
  &:hover .dropdown-menu
    display: block // 显示菜单
    animation: fadeIn 0.2s ease // 淡入动画

  // 普通下拉菜单项样式
  .dropdown-menu a
    display: flex // Flex布局
    align-items: center // 垂直居中
    justify-content: center // 水平居中
    padding: 10px // 内边距10px
    text-decoration: none // 无下划线
    color: #333 // 亮色文字

    // 悬停效果（亮色）
    &:hover
      background-color: #ddd // 亮色悬停背景

// 暗色模式适配
[data-theme="dark"]
  // 更多下拉菜单
  .more-dropdown-menu
    background-color: #2d2d2d // 暗色背景
    box-shadow: 0 2px 12px rgba(0,0,0,0.3) // 暗色阴影

  // 下拉菜单项文字及悬停
  .dropdown-item
    color: #f0f0f0 // 暗色文字
    &:hover
      background-color: #444 // 暗色悬停背景

  // 普通下拉菜单
  .dropdown-menu
    background-color: #2d2d2d // 暗色背景
    box-shadow: 0 2px 12px rgba(0,0,0,0.3) // 暗色阴影

    // 普通下拉菜单项文字及悬停
    a
      color: #f0f0f0 // 暗色文字
      &:hover
        background-color: #444 // 暗色悬停背景

  // 暗色模式滚动条滑块
  .more-dropdown-menu::-webkit-scrollbar-thumb,
  .dropdown-menu::-webkit-scrollbar-thumb
    background-color: rgba(255,255,255,0.2) // 暗色滚动条滑块

// 下拉菜单入场动画
@keyframes fadeIn
  from
    opacity: 0 // 初始透明度0
    transform: translateY(5px) // 初始位置下移5px
  to
    opacity: 1 // 结束透明度1
    transform: translateY(0) // 恢复位置

// 响应式调整（≤768px）
@media (max-width: 768px)
  .menu.mobile-hidden
    display: none // 小屏幕隐藏指定菜单

```

{% endfolding %}

{% endtabs %}

步骤四：重启 Hexo 服务

修改完成后，在终端中执行 `hexo clean && hexo s` 命令，清理并重新启动 Hexo 本地服务，然后在浏览器中查看效果，“更多” 处应能正常显示下拉菜单。

由于搜索栏遮盖了下拉菜单，需要修改下拉菜单支持滚动模式，容器固定3行高度，上移一段距离。

图标也不能正常显示，凑合用吧。

![image-20251018130238736](https://u.sam7.top/Bh3YjH)

### 9.3 网站设置

- 根目录配置文件中，修改以下内容。

```yml blog/_config.yml
title: #博客名称
subtitle: '纸上得来终觉浅,绝知此事需躬行|文本2' #鼠标移至副标题区域即可显示文本2内容
description: '博客描述'
keywords: ['','','','','',''] #关键词，方便搜索引擎抓取
author: Sam #作者名字
avatar: /path/x.avif #头像
language:
  - zh-CN
  - en
timezone: 'Asia/Shanghai' #时区

```

- 网站标题艺术字设置

  - 在主题source目录下新建`art-title.css`,新增以下内容

    ```css art-title.css
    div.main {
      /* 中英文统一手写字体（保持风格一致） */
      font-family: "Ma Shan Zheng", "Pacifico", cursive !important;
      font-size: 36px !important;
      font-weight: normal !important;
      line-height: 1.3 !important;
    
      /* 红色到紫色渐变（主色调调整） */
      background: linear-gradient(135deg, #ff6b6b, #4ecdc4, #8e44ad, #f39c12) !important;
      background-size: 70% 70% !important; /* 适配渐变流动动画 */
      -webkit-background-clip: text !important;
      background-clip: text !important;
      color: transparent !important; /* 核心：文字透明显示渐变 */
    
      /* 阴影增强层次感 */
      text-shadow: 0 2px 5px rgba(0,0,0,0.15) !important;
    
      /* 渐变流动动画 */
      animation: gradientShift 7s ease infinite !important;
      display: inline-block !important;
    }
    
    /* 动画关键帧 */
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    /* 悬停强化效果 */
    div.main:hover {
      text-shadow: 0 3px 8px rgba(0,0,0,0.2) !important;
      transform: scale(1.05) !important;
      transition: all 0.3s ease !important;
    }
    ```

  - 然后在根目录配置文件增加以下内容，将中英文手写字体和art-title.CSS引入head标签内。

``` yml blog/_config.yml
inject:
  head:
  	- <link rel="stylesheet" href="/art-title.css">  # 自定义艺术字样式引入
    - <link rel="stylesheet" href="https://fonts.loli.net/css2?family=Ma+Shan+Zheng&family=Pacifico&display=swap"> #引入Pacifico字体 中英文手写
```



### 9.4 网页小图标

- 让豆包生成一个logo图标，修改为成128x128px，像素小加载快。

  ![创建极简线条风标识](https://u.sam7.top/6QcmtF)

- 然后在根目录配置文件增加以下内容，将Favicon图标引入head标签内。

  ```yaml blog/_config.yml
  inject:
    head:
    	- <link rel="icon" href="https://u.sam7.top/6QcmtF" type="image/avif">  # Favicon图标引入
  ```

- 效果展示

  <img src="https://u.sam7.top/XrwW8K" alt="效果展示" style="zoom:200%;" />

## 10. 顶部导航栏显示异常

浏览器设置浅色模式，主题切换为深色，顶部导航栏字体看起来比较奇怪，navbra.styl修改，`.navbar-blur`取消模糊效果。

![image-20251018130314321](https://u.sam7.top/pGMf3Y)

```stylus navbar.styl
// 顶栏容器样式（替代newblur()的背景）
.navbar-blur 
  margin: 0 1rem
  border-radius: 64px
  position: relative
  // 新增背景样式：使用主题卡片色+轻微透明度，不依赖模糊
  background: var(--card, rgba(255, 255, 255, 0.9))  // 主背景（优先用主题变量）
  border: var(--card-border, 1px solid rgba(0, 0, 0, 0.05))  // 边框（可选，增强轮廓）
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05)  // 轻微阴影，区分层级
  // 如需半透明效果可调整alpha值，如：background: rgba(255, 255, 255, 0.85)
```

## 11. 页面布局调整

- 在主题样式`custom.styl`中添加`$leftbar-bottom-margin = 20px）`,调整主内容界面宽度为1080px，侧边栏宽度最大为277px，元素内部和外部距离都调整为15px。

```stylus custom.styl
$leftbar-bottom-margin = 20px  // 左侧栏底部距离（根据需求调整，单位px/rem）

// 可以动态变化的属性
:root
  --width-main: 1080px // 主内容区域宽度（默认1080px）
  --fsp: $fs-body // 段落字体大小（关联正文基础大小）
  --fsh2: 'calc(%s + 11px)' % var(--fsp) // h2标题大小（基于段落字体动态计算）
  --fsh3: 'calc(%s + 7px)' % var(--fsp) // h3标题大小（基于段落字体动态计算）
  --fsh4: 'calc(%s + 4px)' % var(--fsp) // h4标题大小（基于段落字体动态计算）
  
  --side-content-width: 255px // 侧边栏内容宽度（默认255px）
  --gap-margin: 11px // 元素外部间距（元素间距离）
  --gap-padding: 11px // 元素内部间距（内容到边框距离）
```

- 同时还需要在layout.styl中添加如下内容，高度随内容自适应，且底部有适度留白，兼顾功能和美观。

```stylus layout.styl
// 普通屏幕布局
.l_body .l_left
  margin-bottom: 16px; // 只保留少量底部留白（数值按需调整）

// 手机端布局
@media screen and (max-width: $device-mobile-max)
  .l_body
    .l_left
      padding-bottom: 8px; // 少量底部内边距（按需调整）
```

- 调整后页面整体效果如下

<img src="https://u.sam7.top/ZdpH23" alt="image-20251018132921523" style="zoom: 67%;" />

## 12. 添加音乐播放器

### 12.1 简单使用

参考 [stellar主题使用meetingjs接入aplayer音乐播放器 - BoBoBlog](https://blog.bxzdyg.cn/p/stellar-aplayer-metingjs/)

{% copy npm install --save hexo-tag-aplayer prefix:$ %}

首先需要安装音乐播放器插件,在根目录主题配置文件里面添加以下内容，开启metingjs。

```yml _config.yml
aplayer:
  # 示例配置
  cdn: https://cdn.jsdelivr.net/npm/aplayer@latest/dist/APlayer.min.js
  style_cdn: https://cdn.jsdelivr.net/npm/aplayer@latest/dist/APlayer.min.css
  meting: true
  meting_cdn: https://cdn.jsdelivr.net/npm/meting@1/dist/Meting.min.js
```

在想要添加音乐播放器的位置添加以下代码块，这是一个md格式的网易云歌单，有时候会和toc有冲突，无法实现跳转。

```markdown
{% meting "14222331844" "netease" "playlist" "autoplay"  "mutex:true" "listmaxheight:340px" "lrctype:0" "preload:none" "theme:#1cd0fd" "storagename:metingjs"%} 
```

![image-20251018130415394](https://u.sam7.top/MKB4bw)

### 12.2 吸底音乐播放器

主题配置文件中增加以下内容，在`layout.ejs </body>`标签前面添加 meting-js 吸底播放器代码，实现全站底部音乐歌单，默认静音、切换页面不中断，还是和toc有冲突，无法实现跳转。

```yml _config.yml
html += `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css"><script src="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js"></script><script src="https://cdn.jsdelivr.net/npm/meting@2/dist/Meting.min.js"></script><meting-js class="aplayer" server="netease" type="playlist" id="3136952023" fixed="true" autoplay="false" theme="#2980b9" loop="all" order="list" preload="auto" volume="0.1" lrc-type="0"></meting-js>`
```

<img src="https://u.sam7.top/B6zwcR" alt="image-20251112132017872" style="zoom:200%;" />

### 12.3 aplayer配色修改

修改主题样式文件`aplayer.styl`，修改播放器参数，播放器颜色跟随系统主题。

{% folding 查看代码 %}

```stylus aplayer.styl
.md-text
  .aplayer
    border-radius: $border-card

/* aplayer-theme.css - 支持手动和系统主题切换的Aplayer样式 */

/* ===== CSS变量定义 ===== */

/* 默认亮色主题变量 */
:root {
  --aplayer-bg: #ffffff; /* 播放器主背景色 */
  --aplayer-toolbar-bg: #f8f9fa; /* 工具栏/控制器背景色 */
  --aplayer-text: #373737; /* 主要文字颜色 */
  --aplayer-border: #e9e9e9; /* 边框颜色 */
  --aplayer-hover-bg: #efefef; /* 鼠标悬停背景色 */
  --aplayer-hover-text: #ff5722; /* 鼠标悬停文字颜色 */
  --aplayer-active-bg: #e9ecef; /* 当前选中项背景色（比普通背景更深） */
  --aplayer-active-text: #2c2c2c; /* 当前选中项文字颜色（亮色主题下保持深色） */
  --aplayer-list-item-height: 32px; /* 列表项高度 */
  --aplayer-list-item-padding: 0 15px; /* 列表项内边距 */
  --aplayer-list-item-font-size: 12px; /* 列表项字体大小 */
  --aplayer-list-light-font-size: small; /* 当前选中项字体大小 */
  --aplayer-list-light-font-weight: bold; /* 当前选中项字体粗细 */
  --aplayer-hover-font-size: small; /* 悬停时字体大小 */
  --aplayer-hover-font-weight: bold; /* 悬停时字体粗细 */
}

/* 暗色主题变量 - 通过[data-theme="dark"]属性应用 */
[data-theme="dark"] {
  --aplayer-bg: #1e1e1e; /* 播放器主背景色 */
  --aplayer-toolbar-bg: #1e1e1e; /* 工具栏/控制器背景色 */
  --aplayer-text: #ffffffff; /* 主要文字颜色 */
  --aplayer-border: #383d42; /* 边框颜色 */
  --aplayer-hover-bg: #3d3d3d; /* 鼠标悬停背景色 */
  --aplayer-hover-text: #ff5722; /* 鼠标悬停文字颜色 */
  --aplayer-active-bg: #4a4a4a; /* 当前选中项背景色（比普通背景更深） */
  --aplayer-active-text: #01686dff; /* 当前选中项文字颜色（暗色主题下使用更亮的白色，提高对比度） */
}

/* 系统主题检测作为备用方案 - 当没有手动设置主题时生效 */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) { /* 选择没有设置data-theme属性的根元素 */
    --aplayer-bg: #1e1e1e; /* 播放器主背景色 */
    --aplayer-toolbar-bg: #1e1e1e; /* 工具栏/控制器背景色 */
    --aplayer-text: #ffffffff; /* 主要文字颜色 */
    --aplayer-border: #383d42; /* 边框颜色 */
    --aplayer-hover-bg: #3d3d3d; /* 鼠标悬停背景色 */
    --aplayer-hover-text: #ff5722; /* 鼠标悬停文字颜色 */
    --aplayer-active-bg: #4a4a4a; /* 当前选中项背景色（比普通背景更深） */
    --aplayer-active-text: #01686dff; /* 当前选中项文字颜色（暗色主题下使用更亮的白色，提高对比度） */
  }
}

/* ===== Aplayer整体样式 ===== */

.aplayer {
  background: var(--aplayer-bg); /* 背景色使用CSS变量 */
  color: var(--aplayer-text); /* 文字颜色使用CSS变量 */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif; /* 字体族设置 */
  border-radius: 6px; /* 圆角边框 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  transition: all 0.3s ease; /* 过渡动画效果 */
}

/* ===== 工具栏/控制器区域样式 ===== */

.aplayer .aplayer-info,
.aplayer .aplayer-controller,
.aplayer .aplayer-body {
  background: var(--aplayer-toolbar-bg); /* 使用工具栏专用背景色 */
  transition: background-color 0.3s ease; /* 背景色过渡效果 */
}

.aplayer .aplayer-info {
  border-bottom: 1px solid var(--aplayer-border); /* 底部边框 */
  padding: 12px 15px; /* 内边距 */
}

.aplayer .aplayer-info .aplayer-music {
  color: var(--aplayer-text); /* 文字颜色 */
}

.aplayer .aplayer-info .aplayer-music .aplayer-title {
  color: var(--aplayer-active-text); /* 使用更突出的颜色 */
  font-weight: bold; /* 字体加粗 */
}

.aplayer .aplayer-controller {
  border-top: 1px solid var(--aplayer-border); /* 顶部边框 */
  padding: 8px 15px; /* 内边距 */
}

/* ===== 进度条样式 ===== */

.aplayer .aplayer-bar {
  background: var(--aplayer-border); /* 轨道背景色 */
}

.aplayer .aplayer-loaded {
  background: var(--aplayer-hover-bg); /* 已加载部分背景色 */
}

.aplayer .aplayer-played {
  background: var(--aplayer-hover-text); /* 已播放部分背景色 */
}

.aplayer .aplayer-thumb {
  background: var(--aplayer-hover-text); /* 拖拽点背景色 */
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2); /* 拖拽点阴影 */
}

/* ===== 时间显示样式 ===== */

.aplayer .aplayer-time {
  color: var(--aplayer-text); /* 时间文字颜色 */
}

/* ===== 音量控制样式 ===== */

.aplayer .aplayer-volume-wrap .aplayer-volume-bar {
  background: var(--aplayer-border); /* 音量轨道背景色 */
}

.aplayer .aplayer-volume-wrap .aplayer-volume {
  background: var(--aplayer-hover-text); /* 音量滑块背景色 */
}

/* ===== 播放列表样式 ===== */

.aplayer .aplayer-list {
  border-top: 1px solid var(--aplayer-border); /* 顶部边框 */
  max-height: 300px; /* 最大高度限制 */
  overflow-y: auto; /* 垂直方向溢出时显示滚动条 */
  background: var(--aplayer-bg); /* 列表背景色 */
}

.aplayer .aplayer-list ol li {
  position: relative; /* 相对定位 */
  height: var(--aplayer-list-item-height); /* 固定高度 */
  line-height: var(--aplayer-list-item-height); /* 行高等于高度，实现垂直居中 */
  padding: var(--aplayer-list-item-padding); /* 内边距 */
  font-size: var(--aplayer-list-item-font-size); /* 字体大小 */
  border-top: 1px solid var(--aplayer-border); /* 顶部边框 */
  cursor: pointer; /* 鼠标指针样式 */
  transition: all 0.2s ease; /* 过渡动画效果 */
  overflow: hidden; /* 隐藏溢出内容 */
  margin: 0; /* 外边距归零 */
  color: var(--aplayer-text); /* 文字颜色 */
  background-color: var(--aplayer-bg); /* 背景色 */
}

.aplayer .aplayer-list ol li:first-child {
  border-top: none; /* 无边框 */
}

.aplayer .aplayer-list ol li.aplayer-list-light {
  background: var(--aplayer-active-bg); /* 使用更深的背景色突出显示 */
  color: var(--aplayer-active-text); /* 文字颜色使用更亮的白色，提高对比度 */
  font-size: var(--aplayer-list-light-font-size); /* 字体大小 */
  font-weight: var(--aplayer-list-light-font-weight); /* 字体粗细 */
  position: relative; /* 相对定位 */
}

.aplayer .aplayer-list ol li.aplayer-list-light::before {
  content: ''; /* 伪元素内容为空 */
  position: absolute; /* 绝对定位 */
  left: 0; /* 左侧对齐 */
  top: 0; /* 顶部对齐 */
  height: 100%; /* 高度100% */
  width: 3px; /* 宽度3像素 */
  background: var(--aplayer-hover-text); /* 指示条颜色 */
}

.aplayer .aplayer-list ol li:hover {
  background: var(--aplayer-hover-bg); /* 悬停背景色 */
  color: var(--aplayer-hover-text); /* 悬停文字颜色 */
  font-size: var(--aplayer-hover-font-size); /* 悬停时字体大小 */
  font-weight: var(--aplayer-hover-font-weight); /* 悬停时字体粗细 */
}

/* ===== 滚动条样式 ===== */

.aplayer .aplayer-list::-webkit-scrollbar {
  width: 6px; /* 滚动条宽度 */
}

.aplayer .aplayer-list::-webkit-scrollbar-track {
  background: var(--aplayer-bg); /* 轨道背景色 */
}

.aplayer .aplayer-list::-webkit-scrollbar-thumb {
  background: var(--aplayer-border); /* 滑块背景色 */
  border-radius: 3px; /* 滑块圆角 */
}

.aplayer .aplayer-list::-webkit-scrollbar-thumb:hover {
  background: var(--aplayer-hover-text); /* 悬停时滑块背景色 */
}

/* ===== 播放按钮样式 ===== */

.aplayer .aplayer-play {
  width: 22px; /* 宽度 */
  height: 22px; /* 高度 */
  border: 1px solid var(--aplayer-border); /* 边框 */
  border-radius: 50%; /* 圆形边框 */
  display: flex; /* 弹性布局 */
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  transition: all 0.2s ease; /* 过渡动画 */
}

.aplayer .aplayer-play:hover {
  border-color: var(--aplayer-hover-text); /* 悬停时边框颜色 */
  background: var(--aplayer-hover-bg); /* 悬停时背景色 */
}

/* ===== 歌词面板样式 ===== */

.aplayer .aplayer-lrc {
  background: var(--aplayer-toolbar-bg); /* 背景色 */
  border-top: 1px solid var(--aplayer-border); /* 顶部边框 */
}

.aplayer .aplayer-lrc .aplayer-lrc-current {
  color: var(--aplayer-active-text); /* 当前歌词文字颜色使用更亮的颜色 */
  font-weight: bold; /* 字体加粗 */
}

/* ===== 迷你模式样式 ===== */

.aplayer.aplayer-mini .aplayer-body {
  background: var(--aplayer-toolbar-bg); /* 背景色 */
}

.aplayer.aplayer-mini .aplayer-info {
  background: transparent; /* 透明背景 */
}

.aplayer.aplayer-mini .aplayer-info .aplayer-music .aplayer-title {
  color: var(--aplayer-active-text); /* 使用更突出的颜色 */
  font-weight: bold; /* 字体加粗 */
}

/* ===== 艺术家和专辑信息样式 ===== */

.aplayer .aplayer-info .aplayer-music .aplayer-author {
  color: var(--aplayer-text); /* 艺术家文字颜色 */
  opacity: 1; /* 透明度稍低，作为次要信息 */
}

.aplayer .aplayer-list ol li.aplayer-list-light .aplayer-list-author {
  color: var(--aplayer-active-text); /* 当前歌曲艺术家信息使用更亮的颜色 */
  opacity: 1; /* 降低透明度，但仍保持可读性 */
}

```

{% endfolding %}



## 13. 背景动态设置

### 13.1 随机线条效果

 主题文件layout.ejs文件中添加以下代码

```ejs layout.ejs
<script type="text/javascript"color="0,0,255" opacity='0.7' zIndex="-2" count="99" src="//cdn.bootcss.com/canvas-nest.js/1.0.0/canvas-nest.min.js"></script>
```

- `color` ：线条颜色, 默认: `'0,0,0'`；三个数字分别为(R,G,B)


- `opacity`: 线条透明度（0~1）, 默认: `0.5`
- `count`: 线条的总数量, 默认: `150`
- `zIndex:` 背景的z-index属性，CSS属性用于控制所在层的位置, 默认: `-1`

 终端运行hexo clean 清除缓存，hexo g&hexo s渲染网页后本地预览。

 手机端显示很乱，影响阅览网页，可以减少线条数或者移动端适配减少线条数量。

### 13.2 随机樱花效果

参考以下文章，修改成可以替换任意图像元素效果。

[Hexo添加雪花动态效果背景 | 花猪のBlog](https://cnhuazhu.top/butterfly/2021/02/24/Hexo魔改/Hexo添加雪花动态效果背景/)

[Hexo添加樱花动态效果背景 | 花猪のBlog](https://cnhuazhu.top/butterfly/2021/02/19/Hexo魔改/Hexo添加樱花动态效果背景/)

base64图片太长了，占用空间大，提取base64编码转换成图片，上传图床。

![result](https://u.sam7.top/2NkzEk)

新建sakura.js文件

{% folding 代码折叠 %}

```js sakura.js
class Sakura {
    constructor(x, y, s, r, fn, image) {
        this.x = x;
        this.y = y;
        this.s = s;
        this.r = r;
        this.fn = fn;
        this.image = image;
    }

    draw(cxt) {
        cxt.save();
        cxt.translate(this.x, this.y);
        cxt.rotate(this.r);
        const size = 40 * this.s;
        cxt.drawImage(this.image, -size/2, -size/2, size, size);
        cxt.restore();
    }

    update() {
        this.x = this.fn.x(this.x, this.y);
        this.y = this.fn.y(this.y, this.x);
        this.r = this.fn.r(this.r);
        
        if (this.x > window.innerWidth || this.x < 0 || this.y > window.innerHeight || this.y < 0) {
            this.reset();
        }
    }

    reset() {
        this.r = getRandom('fnr')();
        if (Math.random() > 0.4) {
            this.x = getRandom('x');
            this.y = 0;
        } else {
            this.x = window.innerWidth;
            this.y = getRandom('y');
        }
        this.s = getRandom('s');
        this.r = getRandom('r');
    }
}

let stop = null;

// 检测是否为移动设备
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth <= 768;
}

function getRandom(option) {
    switch (option) {
        case 'x': return Math.random() * window.innerWidth;
        case 'y': return Math.random() * window.innerHeight;
        case 's': return Math.random() * 0.5 + 0.3;
        case 'r': return Math.random() * Math.PI * 2;
        case 'fnx': return (x, y) => x + (Math.random() - 0.5) * 2 - 1;
        case 'fny': return (y, x) => y + 1.5 + Math.random();
        case 'fnr': return (r) => r + Math.random() * 0.03;
        default: return 0;
    }
}

function startSakura(image) {
    if (stop) {
        cancelAnimationFrame(stop);
        const canvas = document.getElementById('canvas_sakura');
        if (canvas) canvas.remove();
    }

    const canvas = document.createElement('canvas');
    const cxt = canvas.getContext('2d');
    const sakuras = [];
    
    // 移动端优化
    const isMobile = isMobileDevice();
    const sakuraCount = isMobile ? 15 : 25; // 移动端减少樱花数量
    
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.style.cssText = 'position:fixed;left:0;top:0;pointer-events:none;z-index:9999;';
    canvas.id = 'canvas_sakura';
    document.body.appendChild(canvas);

    // 创建樱花实例
    for (let i = 0; i < sakuraCount; i++) {
        sakuras.push(new Sakura(
            getRandom('x'),
            getRandom('y'),
            getRandom('s'),
            getRandom('r'),
            {
                x: getRandom('fnx'),
                y: getRandom('fny'),
                r: getRandom('fnr')
            },
            image
        ));
    }

    function animate() {
        cxt.clearRect(0, 0, canvas.width, canvas.height);
        sakuras.forEach(sakura => {
            sakura.update();
            sakura.draw(cxt);
        });
        stop = requestAnimationFrame(animate);
    }

    stop = requestAnimationFrame(animate);
}

function toggleSakura(imageUrl) {
    if (stop) {
        cancelAnimationFrame(stop);
        stop = null;
        const canvas = document.getElementById('canvas_sakura');
        if (canvas) canvas.remove();
        return false; // 返回false表示已停止
    } else {
        // 移动端检测 - 如果性能可能有问题，可以在这里禁用
        if (isMobileDevice()) {
            const enableOnMobile = confirm("在移动设备上运行樱花特效可能会影响性能。是否继续？");
            if (!enableOnMobile) return false;
        }
        
        // 加载图片并启动
        const img = new Image();
        img.onload = function() {
            startSakura(img);
        };
        img.src = imageUrl;
        return true; // 返回true表示已启动
    }
}

// 窗口调整大小时重置canvas
window.addEventListener('resize', () => {
    const canvas = document.getElementById('canvas_sakura');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});

// 页面卸载时清理资源
window.addEventListener('beforeunload', () => {
    if (stop) {
        cancelAnimationFrame(stop);
    }
});

// 在这里添加你的图片路径并启动特效
// 将下面的 'your-sakura-image-url.jpg' 替换为你的樱花图片URL
toggleSakura('https://u.sam7.top/2NkzEk');

// 导出函数供外部调用
window.toggleSakura = toggleSakura;
window.isMobileDevice = isMobileDevice;


```

{% endfolding %}

## 14. 文章路由

参考博主[BoBoBlog](https://blog.bxzdyg.cn/)文章

[使用Hexo和Stellar搭建个人博客网站【超详细贴心保姆级教程💖】 - BoBoBlog](https://blog.bxzdyg.cn/p/使用Hexo和Stellar搭建个人博客网站/#文章路由（选）)

能够解决中文网页标题转义的现象，并且创建文章自动添加abbrlink

{% copy npm install hexo-abbrlink --save prefix:$ %}

在 `blog/_config.yml` 中找到对应 `permalink` 标签，进行修改即可：

```yml _config.yml
url: sam7.top
permalink: :year:month/:title/ #:year/:month/:day/:title/
abbrlink:
  alg: crc16  #算法： crc16(default) and crc32
  rep: dec    #进制： dec(default) and hex
permalink_defaults:
```

使用了这个每使用命令新建一篇文章会在头代码上插入abbrlink:及对应的转码后的代码,

这使得他会自动去匹配每个md文件的头代码中的abbrlink

不同算法、进制生成的链接格式如下：

| 算法  | 进制 | 生成链接示例                                 |
| ----- | ---- | -------------------------------------------- |
| crc16 | hex  | <https://yourname.github.io/p/66c8.html>       |
| crc16 | dec  | <https://yourname.github.io/p/65535.html>      |
| crc32 | hex  | <https://yourname.github.io/p/8ddf18fb.html>   |
| crc32 | dec  | <https://yourname.github.io/p/1690090958.html> |

## 15. 主题深浅色切换

参考博主[BoBoBlog](https://blog.bxzdyg.cn/)，主题颜色设置为自动。

```yml blog/_config.stellar.yml
style:
  prefers_theme: auto # auto / light / dark
  smooth_scroll: true # true / false 开启时如果目录过长可能无法准确定位
```

### 15.1 功能实现

首先在 主题配置文件中`footer.social`处增加“主题切换”按钮配置，图标为半圆，点击可用于一键切换深浅色。

```yml blog/_config.stellar.yml
footer: 
  social:
    theme:
      icon: '<i class="fa-solid fa-circle-half-stroke fa-fade" style="color: #F9D923;"></i>'
      title: '主题切换'
      url: 'javascript:void(0);'
```

下一步需要在前端JS中实现主题切换功能，并为页脚“主题切换”按钮绑定点击事件。

在main.js末尾增加如下代码，实现以下功能，默认跟随系统颜色变化，单击按钮切换主题深浅色。

{% folding 查看代码 %}

```js main.js
// 主题切换按钮逻辑
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
}
// 自动读取本地存储
(function() {
  const saved = localStorage.getItem('theme');
  if (saved) setTheme(saved);
})();
// 跟随系统颜色变化
(function() {
  // 优先本地存储
  const saved = localStorage.getItem('theme');
  if (saved) {
    setTheme(saved);
  } else {
    // 跟随系统
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(mq.matches ? 'dark' : 'light');
    mq.addEventListener('change', function(e) {
      // 仅当未手动切换时才跟随系统
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
})();
// 绑定页脚按钮点击事件
window.addEventListener('DOMContentLoaded', function () {
  // 支持多种渲染方式，自动识别按钮
  const themeBtns = document.querySelectorAll('.fa-circle-half-stroke');
  themeBtns.forEach(function(btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      toggleTheme();
    });
  });
});
```

{% endfolding %}

### 15.2 主题颜色调整

深浅色主题、侧边栏、卡片、代码块颜色调整，将`theme_base.styl`主题基本颜色修改成如下内容。

{% folding 查看代码 %}

```stylus theme_base.styl
// 通用 hsla 函数
x-hsla(h = var(--hue), s = var(--sat), l = var(--light), a = var(--alpha))
  return unquote('hsla(%s %s %s / %s)' % (h s l a))

// 设置不同透明度的主题色
x-theme-alpha(a = 1)
  return unquote('hsla(%s %s %s / %s)' % (var(--hue) var(--sat) var(--light) a))

// 设置基础主题色
x-set-theme-with-color($color)
  --hue: hue($color)
  --sat: saturation($color)
  --light: lightness($color)
  --alpha: alpha($color)
  --theme: x-theme-alpha(1)
  --theme-a10: x-theme-alpha(0.1)
  --theme-a20: x-theme-alpha(0.2)
  --theme-a30: x-theme-alpha(0.3)

// 设置链接颜色
x-set-link-with-color($color)
  $hue = hue($color)
  $sat = saturation($color)
  $light = lightness($color)
  --link: x-hsla($hue, $sat, $light, 1)
  --link-a20: x-hsla($hue, $sat, $light, 0.2)

// 设置背景色
x-set-bg-colors($scheme)
  $hue = $c-base-hue
  $sat = 0%
  $light = $scheme == 'dark' ? 0% : 100%
  --bg-a20: x-hsla($hue, $sat, $light, 0.2)
  --bg-a50: x-hsla($hue, $sat, $light, 0.5)
  --bg-a55: x-hsla($hue, $sat, $light, 0.55)
  --bg-a60: x-hsla($hue, $sat, $light, 0.6)
  --bg-a75: x-hsla($hue, $sat, $light, 0.75)
  --bg-a100: x-hsla($hue, $sat, $light, 1)

// 设置文本及相关色
x-set-text-colors($scheme, $p0 = 1, $p1 = 0.8, $p2 = 0.7, $p3 = 0.5, $p4 = 0.4)
  $hue = $c-base-hue
  $sat = 0%
  $light = $scheme == 'dark' ? 100% : 0%
  
  --text: x-hsla($hue, $sat, $light, $p0)
  --text-reverse: x-hsla($hue, $sat, $scheme == 'dark' ? 0% : 100%, $p0)
  --text-p1: x-hsla($hue, $sat, $light, $p1)
  --text-p2: x-hsla($hue, $sat, $light, $p2)
  --text-p3: x-hsla($hue, $sat, $light, $p3)
  --text-p4: x-hsla($hue, $sat, $light, $p4)

  --text-meta: x-hsla($hue, $sat, $light, 0.2)
  --text-code: x-hsla($hue, $sat, $light, 0.9)

  --text-a10: x-hsla($hue, $sat, $light, 0.1)
  --text-a20: x-hsla($hue, $sat, $light, 0.2)

  $sat = $scheme == 'dark' ? 24% : 50%
  $light = $scheme == 'dark' ? 72% : 12%
  $alpha = $scheme == 'dark' ? 0.08 : 0.04
  --block: x-hsla($hue, $sat, $light, $alpha)
  --block-border: x-hsla($hue, $sat, $light, $alpha * 1.5)

// 设置图片滤镜 - 深色模式图片背景为#31383A，对比度更低
x-set-image-filters($scheme)
  if $scheme == 'dark'
    --image-filter: invert(1) hue-rotate(180deg)
    --image-brightness: 0.65  // 降低亮度，使背景接近#31383A
    --image-contrast: 0.85    // 进一步降低对比度
    --image-saturate: 0.9     // 稍微降低饱和度
    --image-filter-value: invert(1) hue-rotate(180deg) brightness(0.65) contrast(0.85) saturate(0.9)
  else
    --image-filter: none
    --image-brightness: 1
    --image-contrast: 1
    --image-saturate: 1
    --image-filter-value: none

// ---------------- apply theme ----------------
// fallback: 如果编译时主题未注入 $site-background-image 或 $site-background-opacity，则使用站点配置的默认值
if !$site-background-image
  $site-background-image = 'https://u.sam7.top/h5tPaG'

if !$site-background-opacity
  $site-background-opacity = 0.1

// 设置浅色模式
dynamic-theme-light()
  $hue = $c-base-hue
  --background: x-hsla($hue, 20%, 98%, 1)
  --card: $site-background-image ? hsla(white, 0.5) : white
  // 背景遮罩（浅色主题使用白色半透明遮罩）
  --site-bg-overlay: x-hsla(0, 0%, 100%, $site-background-opacity)

  x-set-bg-colors('light')
  x-set-text-colors('light')
  x-set-image-filters('light')

// 设置深色模式
dynamic-theme-dark()
  $hue = $c-base-hue
  --background: x-hsla($hue, 8%, 12%, 1)
  @media screen and (max-width: $device-mobile-max)
    --background: black
  --card: $site-background-image ? hsla(white, 0.25) : x-hsla($hue, 10%, 24%, 1)

  x-set-bg-colors('dark')
  x-set-text-colors('dark')
  x-set-image-filters('dark')
  --text-code: x-hsla(20, 75, 60, 1)
  // 背景遮罩（深色主题使用黑色半透明遮罩）
  --site-bg-overlay: x-hsla(0, 0%, 0%, calc($site-background-opacity + 0.7))

:root
  // 主题色
  x-set-theme-with-color($c-theme)
  // 强调色
  --accent: $c-accent
  // 链接
  x-set-link-with-color($c-link)

  // dynamic colors
  dynamic-theme-light()
  @media (prefers-color-scheme: dark)
    dynamic-theme-dark()

:root[data-theme="light"]
  dynamic-theme-light()
  // light 主题微调（更亮、略高饱和）
  --site-bg-blur: 10px
  --site-bg-sat: 90%
  --site-bg-contrast: 0.95

:root[data-theme="dark"]
  dynamic-theme-dark()
  // dark 主题微调（更暗、稍降饱和）
  --site-bg-blur: 8px
  --site-bg-sat: 80%
  --site-bg-contrast: 0.9

// ========== 图片主题变化解决方案 ==========

// 深色模式下的图片滤镜应用 - 背景为#31383A，对比度更低，保护左侧栏
:root[data-theme="dark"]
  // 应用滤镜到内容区域的图片
  .post-content img,
  .article-content img,
  .entry-content img,
  .markdown-body img,
  .content img,
  .post-body img,
  [class*="content"] img:not(.no-theme):not(.emoji)
    filter: invert(1) hue-rotate(180deg) brightness(0.65) contrast(0.85) saturate(0.9)
    transition: filter 0.3s ease
  
  // 保护左侧栏和其他UI元素
  .sidebar img,
  .widget img,
  .navbar img,
  .header img,
  //.footer img,
  .avatar,
  .logo,
  .site-brand img,
  .site-logo img,
  .author-avatar img,
  .no-theme
    filter: none !important

  // 对于需要更浅背景的图片
  img[data-light-bg],
  .light-bg-img
    filter: invert(1) hue-rotate(180deg) brightness(0.8) contrast(0.9) saturate(0.95) !important
  
  // 对于需要保持较深背景的图片
  img[data-dark-bg],
  .dark-bg-img
    filter: invert(1) hue-rotate(180deg) brightness(0.65) contrast(0.85) saturate(0.95) !important

// 表情图片不随主题变化
.emoji,
.emoticon,
[class*="emoji"],
[class*="emoticon"],
img[src*="emoji"],
img[src*="emoticon"],
img[data-emoji]
  filter: none !important

// 方法2: 使用CSS变量（如果浏览器支持）
img.theme-aware:not(.emoji)
  filter: var(--image-filter-value)
  transition: filter 0.3s ease

// 方法3: 为特定类型的图片添加主题支持
.themed-image:not(.emoji)
  :root[data-theme="dark"] &
    filter: invert(1) hue-rotate(180deg) brightness(0.65) contrast(0.85) saturate(0.9)
    transition: filter 0.3s ease
  
  :root[data-theme="light"] &
    filter: none
    transition: filter 0.3s ease

// 确保左侧栏图片不受影响
.sidebar,
.widget,
.navbar,
.header,
.footer
  img
    filter: none !important

// 额外选项：如果需要完全禁用某些图片的主题变化
.no-theme,
[data-no-theme]
  filter: none !important

// 兼容：在浅色主题中让前缀符号（例如 $）显示为浅黑色，恢复为改前行为并提高可读性
:root[data-theme="light"]
  .tag-plugin.copy > span
    color: rgba(0,0,0,0.65)

// ========== Wallpaper: 背景图与主题遮罩（随 data-theme 变化） ==========
// 使用现有的主题变量（如 --bg-a55, --background）来让遮罩颜色随 light/dark 自动变化
:root
  // 背景开关与默认参数（可被主题变量覆盖）
  --site-bg-enabled: 1
  // 推荐默认（桌面）：适中模糊/去饱和/降低对比，使背景不抢眼
  --site-bg-blur: 10px    // 常用桌面起点，若不要毛玻璃可设 0px
  --site-bg-sat: 85%      // 饱和度：70-90% 推荐范围
  --site-bg-contrast: 0.9 // 对比度：0.85-0.95 推荐范围
  // 从主题配置读取背景遮罩透明度（如果有），否则默认使用 0.1
  if $site-background-opacity
    --site-bg-opacity: $site-background-opacity
  else
    --site-bg-opacity: 0.1

// 伪元素承载大幅背景图与滤镜，遮罩采用 --bg-a55（已在 x-set-bg-colors 中根据主题设置）
html::before
  content: ""
  position: fixed
  inset: 0
  z-index: -9998
  background-size: cover
  background-position: center center
  background-repeat: no-repeat
  transform: scale(1.02)
  pointer-events: none
  will-change: opacity
  // 不使用毛玻璃，只有在有图片时设置背景图
  // 调整饱和度与对比度以降低背景干扰（不使用 blur）
  filter: saturate(var(--site-bg-sat)) contrast(var(--site-bg-contrast))
  opacity: var(--site-bg-enabled)
  if $site-background-image
    background-image: url($site-background-image)
  else
    background-image: none

html::after
  content: ""
  position: fixed
  inset: 0
  z-index: -9997
  pointer-events: none
  // 使用主题变量控制遮罩颜色（浅色或深色）
  background: var(--site-bg-overlay, var(--bg-a55, rgba(0,0,0,0.08)))
  opacity: var(--site-bg-opacity, 0.1)
  mix-blend-mode: normal

// 不改动主要内容层的默认 z-index/position，恢复主题原有布局
.site
  position: relative

// （注）已取消对 .sitebg/.siteblur 优先逻辑，改为使用 html::before + html::after 实现背景与遮罩

// 移动端降级：减少模糊以节省性能
@media (max-width: $device-mobile-max)
  html::before
    // 移动端降级：降低饱和度与对比以节省性能并提高清晰度
    filter: saturate(75%) contrast(0.9)

```

{% endfolding %}

主题配置文件中修改如下

```yml blog/_config.stellar.yml
  leftbar:
    # 可以设置：纯色/渐变色/图片作为背景
    background-color:  var(--block) #var(--card) var(--block)
    background-image: #url(https://gcore.jsdelivr.net/gh/cdn-x/placeholder@1.0.13/image/sidebar-bg1@small.jpg)
    blur-px: 11px
    blur-bg: var(--bg-a33)
    background-opacity: 1
  paginator:
    prev: https://gcore.jsdelivr.net/gh/cdn-x/placeholder@1.0.12/arrow/f049bbd4e88ec.svg
    next: https://gcore.jsdelivr.net/gh/cdn-x/placeholder@1.0.12/arrow/064b95430caf4.svg
  error_page: https://gcore.jsdelivr.net/gh/cdn-x/placeholder@1.0.12/404/1c830bfcd517d.svg
  site: # 使用 background-image 后，blur 设置才有效
    background-color:  var(--background) #var(--bg-a11) var(--background)
    background-image:  #url(https://t.alcy.cc/fj)
    blur-px: 14px # 增加模糊度使背景不突兀
    blur-bg:  var(--bg-a55)
    blur-sat: 100% # 适当降低饱和度使背景不抢眼
```

### 15.3  其他

waline评论和aplayer播放器都有适配，由于篇幅问题，对应章节都有描述。

## 16. AI摘要

stellar集成tianti GPT，付费的，[洪墨AI](https://ai.zhheo.com/)这里购买添加key就好了，绑定网页。

```yml blog/_config.stellar.yml
# AI 摘要
  # https://github.com/qxchuckle/Post-Summary-AI
  tianli_gpt: 
    enable: true
    js: https://jsd.onmicrosoft.cn/gh/qxchuckle/Post-Summary-AI@6.0/chuckle-post-ai.min.js
    field: all # all, post, wiki
    key: S-JAVXPRUNPV8LWXO4 # tianli_gpt key
```

## 17. 字体设置

[中文网字计划-提供便捷实用的全字符集中文渲染方案](https://chinese-font.netlify.app/zh-cn/)

[Maple Mono NF-CN - ZeoSeven Fonts (ZSFT)](https://fonts.zeoseven.com/items/442/#embed)

根目录配置文件中，最后一行加入以下指令：

```yml blog/_config.yml
inject:
  head:
    - <link rel="stylesheet" href="https://cdn.staticfile.org/lxgw-wenkai-screen-webfont/1.6.0/lxgwwenkaiscreen.css"> #字体引入
    - |
      <link rel="preload" as="style" crossorigin href="https://fontsapi.zeoseven.com/442/main/result.css" onload="this.rel='stylesheet'" onerror="this.href='https://fontsapi-storage.zeoseven.com/442/main/result.css'" />
      <noscript>
        <link rel="stylesheet" href="https://fontsapi.zeoseven.com/442/main/result.css" />
      </noscript> 
```

在主题配置文件中找到 style.font-family，修改以下内容：

```yml blog/_config.stellar.yml
style:
  prefers_theme: auto # auto / light / dark
  smooth_scroll: true # true / false 开启时如果目录过长可能无法准确定位
  font-size:
    root: 16px # 改这个会影响全局所有文字的字号
    body: 16px # 影响正文区域的字号，如果改成 px 则不受 root 影响
    code: 75% # 相较于其所在行的文本大小，建议用百分比
    codeblock: 0.8125rem # 13px
  font-family:
    body: '"LXGW WenKai Screen",system-ui, "Microsoft Yahei", "Segoe UI", Arial, sans-serif'
    code: '"Maple Mono NF CN", Menlo, Monaco, Consolas, system-ui, monospace, sans-serif'
    codeblock: '"Maple Mono NF CN", Menlo, Monaco, Consolas, system-ui, monospace, sans-serif'
  text-align: left
```

## 18. 域名申请

- 【EU.ORG】免费域名

    [Cloudflare 解析 ORG 域名 - YOLOのBLOG](https://blog.felicx.eu.org/1263441363.html)

    [终身免费 ORG 顶级域名申请 - YOLOのBLOG](https://blog.felicx.eu.org/2502663362.html)

    提交域名申请已经过去一个月了，还没通过审核，石沉大海了。

- [Cloudns]免费二级域名

  [人人有份！免费领取一个永久域名并托管到Cloudflare做双向解析 - 知乎](https://zhuanlan.zhihu.com/p/1908463674936496903)

  Cloudns二级域名Cloudflare和Vercel无法解析，只能在Cloudns使用DNS记录。

  Github可以重定向，域名没有时间限制，但证书只有三个月，不知道会不会续签。

- [DigitalPlat]免费域名

  [DigitalPlat免费二级域名注册和Cloudflare托管教程-CSDN博客](https://blog.csdn.net/loutengyuan/article/details/149096491)

  [使用Cloudflate搭建自己的免费代理节点](https://blog.eimoon.com/p/使用cloudflate搭建自己的免费代理节点/)
  
  DigitalPlat最多可以申请两个域名，只有一年使用期限，小于180天可以续期，虽然是二级域名，但可以被cloudflare、vercel托管。

- 购买域名

  国内价格对比了几家都差不太多，阿里云要便宜些，top域名比较便宜第一年8块10年240块，有活动可以更优惠。

## 19. RSS订阅

参考博主[BoBoBlog](https://blog.bxzdyg.cn/)

安装可用于搜索引擎和友链拉取动态插件

{% copy npm i hexo-generator-feed prefix:$ %}

根目录下配置文件添加如下内容

```yml _config.yml
feed:
  type: atom # RSS的类型(atom/rss2)
  path: atom.xml # 文件路径,默认是atom.xml/rss2.xml
  limit: 20 # 展示文章的数量,使用0或则false代表展示全部hub
#  hub:
#    content:  # 在RSS文件中是否包含内容 ,有3个值 true/false默认不填为false
#    content_limit: # 指定内容的长度作为摘要,仅仅在上面content设置为false和没有自定义的描述出现
#    content_limit_delim: ' ' #上面截取描述的分隔符,截取内容是以指定的这个分隔符作为截取结束的标志.在达到规定的内容长度之前最后出现的这个分隔符之前的内容，防止从中间截断
```

然后在主题配置文件中加入以下内容，添加左侧栏footer小图标：

```yml _config.stellar.yml
footer:
  social:
	rss:
      icon: '<i class="fa-solid fa-rss fa-shake"></i>'
      url: /atom.xml
      
rss: /atom.xml
```

## 20. 关于、留言板

在博客源文件夹source中，新建`about和messages`文件夹，在相应文件夹中新建index.md，或者直接在源文件夹下面新建`about.md`和`messages.md`,markdown内容即为展示内容,使用时直接用`/about /messages`指定路径。

```yml blog/_config.stellar.yml
      # 这里配置子菜单，使用 nested 字段
      nested:
        - id: archives
          title: 归档
          url: /archives
        - id: categories
          title: 分类
          url: /categories
        - id: tags
          title: 标签
          url: /tags
        - id: messages
          title: 留言
          url: /messages
        - id: rss
          title: RSS
          url: /atom.xml
        - id: friends
          title: 友链
          url: /friends
        - id: about
          title: 关于
          url: /about
```
