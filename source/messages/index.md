---
title: 留言板
layout: page
comments: true
---

<style>
/* 强制隐藏面包屑、目录和AI摘要 */
.article.banner.top,
.post-ai,
.toc,
.wl-reaction,
.table-of-contents {
  display: none !important;
}

/* 确保主要内容区域占据全部宽度 */
.main-content,
.content-area {
  width: 100% !important;
  max-width: 100% !important;
  margin: 0 auto !important;
}

/* 留言板自定义样式 - 紧凑布局 */
.message-board {
  max-width: 100%;
  margin: 0 auto;
  padding: 1rem;
}

.welcome-section {
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--theme-primary-light, #e8edff) 0%, var(--theme-bg-light, #f0f5ff) 100%);
  border-radius: 10px;
  color: var(--theme-text, #2c3e50);
  box-shadow: 0 3px 8px rgba(0,0,0,0.08);
  border: 1px solid var(--theme-border, #d1d8e0);
}

.welcome-section h1 {
  font-size: 1.8rem;
  margin-bottom: 0.6rem;
  font-weight: 500;
  color: var(--theme-primary, #3498db);
}

.welcome-section p {
  font-size: 0.95rem;
  line-height: 1.4;
  max-width: 500px;
  margin: 0 auto;
  color: var(--theme-text-secondary, #5a6c7d);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin: 1.2rem 0;
}

.feature-card {
  background: var(--theme-card-bg, #ffffff);
  padding: 1.2rem 0.8rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
  border: 1px solid var(--theme-border, #e1e8f0);
  transition: all 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.feature-icon {
  font-size: 1.4rem;
  margin-bottom: 0.6rem;
  color: var(--theme-primary, #3498db);
}

.feature-card h3 {
  margin-bottom: 0.5rem;
  color: var(--theme-text, #2c3e50);
  font-size: 1rem;
  font-weight: 600;
}

.feature-card p {
  color: var(--theme-text-secondary, #5a6c7d);
  font-size: 0.85rem;
  line-height: 1.3;
  margin: 0;
}

.quick-links {
  display: flex;
  justify-content: center;
  gap: 0.6rem;
  margin: 1.5rem 0;
  flex-wrap: wrap;
}

.quick-link {
  padding: 0.5rem 1rem;
  background: var(--theme-card-bg, #ffffff);
  border-radius: 6px;
  text-decoration: none;
  color: var(--theme-text, #2c3e50);
  transition: all 0.2s ease;
  border: 1px solid var(--theme-border, #e1e8f0);
  font-weight: 500;
  font-size: 0.85rem;
}

.quick-link:hover {
  background: var(--theme-primary, #3498db);
  color: white;
  transform: translateY(-1px);
}

.tips-section {
  text-align: center;
  margin: 1.2rem 0;
  padding: 0.7rem 1rem;
  background: var(--theme-bg-light, #f0f5ff);
  border-radius: 6px;
  border-left: 3px solid var(--theme-primary, #3498db);
  font-size: 0.85rem;
}

.tips-section p {
  margin: 0;
  color: var(--theme-text-secondary, #5a6c7d);
  line-height: 1.3;
}

.comments-section {
  margin-top: 1.5rem;
  padding: 1.2rem;
  background: var(--theme-card-bg, #ffffff);
  border-radius: 8px;
  border: 1px solid var(--theme-border, #e1e8f0);
}

/* 浅色主题优化 */
:root {
  --theme-primary: #3498db;
  --theme-bg-light: #f0f5ff;
  --theme-card-bg: #ffffff;
  --theme-border: #e1e8f0;
  --theme-text: #2c3e50;
  --theme-text-secondary: #5a6c7d;
  --theme-primary-light: #e8edff;
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  :root {
    --theme-primary: #5dade2;
    --theme-bg-light: #1a2433;
    --theme-card-bg: #2c3e50;
    --theme-border: #34495e;
    --theme-text: #ecf0f1;
    --theme-text-secondary: #bdc3c7;
    --theme-primary-light: #1a252f;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .message-board {
    padding: 0.8rem;
  }

  .welcome-section {
    padding: 1.2rem 0.8rem;
    margin-bottom: 1.2rem;
  }

  .welcome-section h1 {
    font-size: 1.6rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  .quick-links {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .quick-link {
    width: 100%;
    max-width: 180px;
    text-align: center;
  }
}

/* 紧凑动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-card, .welcome-section, .quick-link, .tips-section {
  animation: fadeInUp 0.3s ease forwards;
  opacity: 0;
}

.feature-card:nth-child(1) { animation-delay: 0.05s; }
.feature-card:nth-child(2) { animation-delay: 0.1s; }
.feature-card:nth-child(3) { animation-delay: 0.15s; }
.quick-link:nth-child(1) { animation-delay: 0.2s; }
.quick-link:nth-child(2) { animation-delay: 0.25s; }
.quick-link:nth-child(3) { animation-delay: 0.3s; }
.quick-link:nth-child(4) { animation-delay: 0.35s; }
.tips-section { animation-delay: 0.4s; }
</style>

<div class="message-board">
  <!-- 欢迎区域 -->
  <div class="welcome-section">
    <h1><i class="fas fa-comment-dots"></i> 留言板</h1>
    <p>欢迎来到我的个人空间！这里是我们交流的专属区域，无论是技术探讨、生活分享、意见建议，还是简单的问候，都非常期待你的留言。每一份互动都是我持续创作和分享的动力源泉，感谢你的关注与支持！</p>
  </div>

  <!-- 功能特色 -->
  <div class="features-grid">
    <div class="feature-card">
      <div class="feature-icon"><i class="fas fa-comment-dots"></i></div>
      <h3>自由交流</h3>
      <p>畅所欲言地分享你的想法、建议或任何想说的话，无论是技术问题、生活感悟还是其他话题，我们都欢迎深入交流</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon"><i class="fas fa-bell"></i></div>
      <h3>实时通知</h3>
      <p>请留下有效的邮箱地址、您偏好的昵称与相关网址。您留言后，我会立即收到通知并尽快回复；同时，您也能通过邮箱接收回复提醒，确保不错过任何互动</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon"><i class="fas fa-edit"></i></div>
      <h3>富文本支持</h3>
      <p>支持Markdown语法、表情符号、代码高亮、图片上传等多种格式，让你的留言更加生动有趣且富有表现力</p>
    </div>
  </div>

  <!-- 快速链接 -->
  <div class="quick-links">
    <a href="/" class="quick-link"><i class="fas fa-home"></i> 首页</a>
    <a href="/archives" class="quick-link"><i class="fas fa-archive"></i> 归档</a>
    <a href="/categories" class="quick-link"><i class="fa-solid fa-list"></i> 分类</a>
    <a href="/tags" class="quick-link"><i class="fas fa-tag"></i> 标签 </a>
    <a href="/atom.xml" class="quick-link"><i class="fas fa-rss"></i> RSS</a>
    <a href="/links" class="quick-link"><i class="fas fa-link"></i> 友链 </a>
    <a href="/about" class="quick-link"><i class="fas fa-user"></i> 关于</a>
    <a href="mailto:2690640537@qq.com" class="quick-link"><i class="fas fa-envelope"></i> 邮箱</a>
    <a href="https://github.com/sam7xx" class="quick-link"><i class="fab fa-github"></i> GitHub</a>
  </div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  // 动态获取主题颜色
  function updateThemeColors() {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    let primaryColor = computedStyle.getPropertyValue('--color-primary').trim();
    if (!primaryColor) {
      primaryColor = computedStyle.getPropertyValue('--theme-color').trim() ||
                     computedStyle.getPropertyValue('--primary-color').trim() ||
                     '#3498db';
    }

    const bgColor = computedStyle.getPropertyValue('--bg-color').trim() ||
                   computedStyle.getPropertyValue('--background-color').trim() ||
                   getComputedStyle(document.body).backgroundColor;

    const rgb = bgColor.match(/\d+/g);
    let brightness = 255;
    if (rgb) {
      brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
    }

    root.style.setProperty('--theme-primary', primaryColor);

    if (brightness > 128) {
      root.style.setProperty('--theme-bg-light', '#f0f5ff');
      root.style.setProperty('--theme-card-bg', '#ffffff');
      root.style.setProperty('--theme-border', '#e1e8f0');
      root.style.setProperty('--theme-text', '#2c3e50');
      root.style.setProperty('--theme-text-secondary', '#5a6c7d');
      root.style.setProperty('--theme-primary-light', '#e8edff');
    } else {
      root.style.setProperty('--theme-bg-light', '#1a2433');
      root.style.setProperty('--theme-card-bg', '#2c3e50');
      root.style.setProperty('--theme-border', '#34495e');
      root.style.setProperty('--theme-text', '#ecf0f1');
      root.style.setProperty('--theme-text-secondary', '#bdc3c7');
      root.style.setProperty('--theme-primary-light', '#1a252f');
    }
  }

  updateThemeColors();

  const observer = new MutationObserver(updateThemeColors);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'style', 'data-theme']
  });
});
</script>
