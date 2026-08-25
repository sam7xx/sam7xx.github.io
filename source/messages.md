---
title: 留言板
layout: page
---

<style>
/* 强制隐藏无关元素 */
.article.banner.top,
.post-ai,
.toc,
.wl-reaction,
.table-of-contents {
  display: none !important;
}

/* 全局容器 - 优化宽度与居中 */
.message-board {
  max-width: 999px; /* 适当增大最大宽度，提升内容舒展度 */
  margin: 2rem auto; /* 上下留足间距，auto确保水平居中 */
  padding: 1.5rem;
  width: calc(100% - 3rem); /* 左右预留1.5rem空间，确保不贴边 */
  box-sizing: border-box;
}

/* 欢迎区域 - 优化居中与宽度 */
.welcome-section {
  text-align: center; /* 内容强制居中 */
  margin-bottom: 2rem;
  padding: 2rem 1.5rem;
  background: linear-gradient(135deg, #e8edff 0%, #f0f5ff 100%);
  border-radius: 16px;
  color: #2c3e50;
  position: relative;
  box-shadow: 0 3px 10px rgba(0,0,0,0.05);
  border: 1px solid rgba(255,255,255,0.8);
  width: 100%; /* 确保占满父容器宽度，强化居中感 */
}

/* 遮罩与毛玻璃优化 */
.welcome-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  z-index: 1;
}

.welcome-section > * {
  position: relative;
  z-index: 2;
}

/* 标题尺寸优化 */
.welcome-section h1 {
  font-size: 2rem;
  margin: 0 0 1rem 0;
  color: #3498db;
}

/* 欢迎词段落优化 - 取消过窄限制，适应整体宽度 */
.welcome-section p {
  font-size: 1.05rem;
  line-height: 1.6;
  max-width: 100%; /* 取消固定宽度限制，随容器自适应 */
  margin: 0 auto;
  padding: 0 0.5rem;
}

/* 深色模式优化 */
[data-theme="dark"] {
  --dark-bg: rgba(45, 55, 71, 0.9);
  --dark-card: rgba(65, 75, 91, 0.85);
  --dark-text: #f8fafc;
  --dark-border: rgba(95, 105, 125, 0.6);
}

[data-theme="dark"] .welcome-section {
  background: linear-gradient(135deg, rgba(60, 75, 100, 0.8) 0%, rgba(70, 85, 110, 0.8) 100%);
  color: var(--dark-text);
  border: 1px solid var(--dark-border);
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
}

[data-theme="dark"] .welcome-section::before {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
}

[data-theme="dark"] .welcome-section h1 {
  color: #a8c5ff;
}

/* 平滑过渡 */
* {
  transition: background-color 0.3s ease,
              color 0.3s ease,
              border-color 0.3s ease,
              backdrop-filter 0.3s ease;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .message-board {
    max-width: 90%; /* 小屏幕宽度占比提升 */
    margin: 1.5rem auto;
    padding: 1rem;
    width: calc(100% - 2rem);
  }
  
  .welcome-section {
    padding: 1.8rem 1rem;
    margin-bottom: 1.5rem;
  }
  
  .welcome-section h1 {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .message-board {
    max-width: 95%;
    padding: 0.8rem;
    width: calc(100% - 1rem);
  }
  
  .welcome-section {
    padding: 1.5rem 0.8rem;
  }
  
  .welcome-section h1 {
    font-size: 1.6rem;
  }
  
  .welcome-section p {
    font-size: 1rem;
    line-height: 1.5;
  }
}
</style>

<div class="message-board">
  <div class="welcome-section">
    <h1>💬 留言板</h1>
    <p style="text-align: center;">欢迎留下你的想法～ 技术探讨、生活感悟、博客建议，每条留言我都会认真阅读，期待与你交流～</p>
  </div>
</div>
