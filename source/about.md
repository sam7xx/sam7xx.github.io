---
title: 关于我
layout: page
comments: false

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

:root {
  --primary-color: #A8B8E0;
  --primary-light: #B8C8F0;
  --primary-dark: #7A95D6;
  --bg-color: #fefefe;
  --card-bg: #f9fafb;
  --text-color: #374151;
  --text-light: #6b7280;
  --border-color: #e5e7eb;
  --shadow: 0 2px 8px rgba(0,0,0,0.05);
  --content-max-width: 1000px; /* 内容最大宽度 */
  --grid-min-width: 260px; /* 统一网格最小列宽 */
  --grid-gap: 16px; /* 统一网格间距 */
}

/* 深色模式优化 */
[data-theme="dark"] {
  --primary-color: #8BA6F0;
  --primary-light: #A8B8E0;
  --primary-dark: #6B8CD8;
  --bg-color: rgba(45, 55, 71, 0.95);
  --card-bg: rgba(65, 75, 91, 0.85);
  --text-color: #f8fafc;
  --text-light: #e2e8f0;
  --border-color: rgba(95, 105, 125, 0.6);
  --shadow: 0 2px 12px rgba(0,0,0,0.1);
}

/* 全屏背景 */
.about-page {
  width: 100%;
  min-height: 100vh;
  padding: 20px 15px;
  margin: 0;
  font-family: "LXGW WenKai Screen", -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background: var(--bg-color);
  position: relative;
  box-sizing: border-box;
}

/* 内容容器 */
.about-content {
  max-width: var(--content-max-width);
  margin: 0 auto;
  width: 100%;
}

/* 深色模式遮罩 */
[data-theme="dark"] .about-page::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(30, 40, 60, 0.3);
  backdrop-filter: blur(12px);
  z-index: -1;
}

/* 统一遮罩样式 */
.section,
.grid-item,
.interest-item,
.purpose-item,
.contact-info {
  position: relative;
  isolation: isolate;
}
[data-theme="dark"] .section::before,
[data-theme="dark"] .grid-item::before,
[data-theme="dark"] .interest-item::before,
[data-theme="dark"] .purpose-item::before,
[data-theme="dark"] .contact-info::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.03);
  border-radius: inherit;
  z-index: -1;
}

/* 个人简介 */
.profile {
  text-align: center;
  margin: 15px 0 25px;
  padding: 25px 20px;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
  border-radius: 16px;
  color: white;
  position: relative;
  box-shadow: var(--shadow);
}
[data-theme="dark"] .profile::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  z-index: 0;
}
.profile > * {
  position: relative;
  z-index: 1;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid rgba(255,255,255,0.3);
  margin-bottom: 15px;
}

.profile h1 {
  margin: 0 0 8px 0;
  font-size: 1.8em;
}

.tagline {
  font-size: 1em;
  opacity: 0.9;
  margin-bottom: 15px;
}

.tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: rgba(255,255,255,0.2);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85em;
  backdrop-filter: blur(10px);
}

/* 内容区块 */
.section {
  background: var(--card-bg);
  padding: 20px 25px;
  border-radius: 14px;
  margin: 20px 0;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
  backdrop-filter: blur(5px);
}

.section h2 {
  margin-top: 0;
  margin-bottom: 15px;
  color: var(--primary-color);
  border-bottom: 2px solid var(--primary-light);
  padding-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.3em;
}

/* 统一网格布局（核心优化：同步"正在学习"和"我的兴趣"的网格参数） */
.grid-container,  /* 正在学习 */
.interests {      /* 我的兴趣 */
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--grid-min-width), 1fr)); /* 统一最小列宽 */
  gap: var(--grid-gap); /* 统一间距 */
}

/* 正在学习 - 网格项 */
.grid-item {
  background: var(--bg-color);
  padding: 18px;
  border-radius: 10px;
  border-left: 4px solid var(--primary-color);
  backdrop-filter: blur(4px);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.grid-item:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow);
}

.grid-item h3 {
  margin: 0 0 12px 0;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1em;
}

.grid-item ul {
  margin: 0;
  padding-left: 20px;
}

.grid-item li {
  margin-bottom: 6px;
  color: var(--text-light);
  font-size: 0.9em;
}

/* 我的兴趣 - 网格项（与"正在学习"保持视觉平衡） */
.interest-item {
  background: var(--bg-color);
  padding: 18px; /* 与grid-item统一内边距 */
  border-radius: 10px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  backdrop-filter: blur(4px);
  /* 增加左侧边框，与"正在学习"风格统一 */
  border-left: 4px solid var(--primary-color);
}

.interest-item:hover {
  transform: translateY(-3px); /* 与grid-item悬停动效同步 */
  box-shadow: var(--shadow);
}

.interest-icon {
  font-size: 2em;
  margin-bottom: 10px;
  color: var(--primary-color);
}

.interest-item h4 {
  margin: 0 0 8px 0;
  color: var(--text-color);
  font-size: 1.05em;
}

.interest-item p {
  margin: 0;
  color: var(--text-light);
  font-size: 0.9em; /* 与grid-item文字大小统一 */
}

/* 写作目的 */
.purpose {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--grid-min-width), 1fr));
  gap: var(--grid-gap);
}

.purpose-item {
  background: var(--bg-color);
  padding: 18px;
  border-radius: 10px;
  text-align: center;
  backdrop-filter: blur(4px);
  border-left: 4px solid var(--primary-color);
}

.purpose-item h4 {
  margin: 0 0 10px 0;
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 1.05em;
}

.purpose-item p {
  margin: 0;
  color: var(--text-light);
  font-size: 0.9em;
  line-height: 1.4;
}

/* 联系区域 */
.contact {
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
}
[data-theme="dark"] .contact::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  z-index: 0;
}
.contact > * {
  position: relative;
  z-index: 1;
}

.contact h2 {
  color: white;
  border-bottom-color: rgba(255,255,255,0.3);
}

/* 联系按钮 */
.contact-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
  flex-wrap: wrap;
  padding: 0 10px;
}

.contact-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 25px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 1em;
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  min-width: 160px;
}

.contact-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  border-color: rgba(255, 255, 255, 0.3);
}

.contact-btn svg, .contact-btn i {
  font-size: 1.2em;
}

/* 响应式优化（同步分栏变化） */
@media (max-width: 1024px) {
  :root {
    --content-max-width: 90%;
  }
}

@media (max-width: 860px) {
  /* 当屏幕宽度不足3列时，统一变为2列 */
  .grid-container,
  .interests,
  .purpose {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 560px) {
  /* 当屏幕宽度不足2列时，统一变为1列 */
  .grid-container,
  .interests,
  .purpose {
    grid-template-columns: 1fr;
  }

  .about-page {
    padding: 15px 10px;
  }

  .section {
    padding: 18px 15px;
  }

  .contact-buttons {
    gap: 12px;
  }

  .contact-btn {
    padding: 10px 20px;
    min-width: auto;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .profile {
    padding: 20px 10px;
  }

  .avatar {
    width: 85px;
    height: 85px;
  }

  .grid-item,
  .interest-item,
  .purpose-item {
    padding: 15px 10px;
  }
}

/* 平滑过渡 */
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease,
              backdrop-filter 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
  }
  </style>

<div class="about-page">
  <div class="about-content">
    <div class="profile">
      <img src="https://u.sam7.top/3MiiTn" alt="我的头像" class="avatar" onerror="this.style.display='none'">
      <h1>👋 你好，我是Sam</h1>
      <p class="tagline">一个热爱技术的电源工程师 & 跑步爱好者</p>
      <div class="tags">
        <span class="tag">⚡ 电源设计</span>
        <span class="tag">💻 技术折腾</span>
        <span class="tag">🏃 跑步健身</span>
      </div>
    </div>
    <div class="section">
      <h2>🛠️ 我的技能</h2>
      <div class="grid-container">
        <div class="grid-item">
          <h3>📐 电路设计</h3>
          <ul>
            <li>PCB与原理图设计</li>
            <li>EMC与热综合设计</li>
            <li>可靠性与可制造性设计</li>
          </ul>
        </div>
        <div class="grid-item">
          <h3>⚡ 电源拓扑</h3>
          <ul>
            <li>Buck/Flyback/AHB</li>
            <li>PFC电路设计</li>
            <li>恒压恒流控制</li>
          </ul>
        </div>
        <div class="grid-item">
          <h3>🔍 测试验证</h3>
          <ul>
            <li>性能测试与分析</li>
            <li>元器件选型计算</li>
            <li>问题排查解决</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="section">
      <h2>🚀 正在学习</h2>
      <div class="grid-container">
        <div class="grid-item">
          <h3>🐍 Python开发</h3>
          <ul>
            <li>电路仿真与数据分析</li>
            <li>自动化脚本编写</li>
            <li>工具开发应用</li>
          </ul>
        </div>
        <div class="grid-item">
          <h3>🔧 硬件进阶</h3>
          <ul>
            <li>大功率电源设计</li>
            <li>环路稳定性分析</li>
            <li>电磁兼容仿真</li>
          </ul>
        </div>
        <div class="grid-item">
          <h3>🔌 单片机学习</h3>
          <ul>
            <li>STM32编程与应用</li>
            <li>数字电源控制算法</li>
            <li>DSP数字信号处理</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="section">
      <h2>❤️ 我的兴趣</h2>
      <div class="interests">
        <div class="interest-item">
          <div class="interest-icon">🏃</div>
          <h4>跑步健身</h4>
          <p class="tagline">享受奔跑，健康生活</p>
        </div>
        <div class="interest-item">
          <div class="interest-icon">🎵</div>
          <h4>音乐电影</h4>
          <p class="tagline">音乐放松，电影思考</p>
        </div>
        <div class="interest-item">
          <div class="interest-icon">💻</div>
          <h4>技术折腾</h4>
          <p class="tagline">拥抱开源，探索前沿</p>
        </div>
      </div>
    </div>
    <div class="section">
      <h2>✍️ 为什么写博客</h2>
      <!-- 复用“我的兴趣”的容器类名.interests -->
      <div class="interests">
        <!-- 每个项复用.interest-item类名，保持样式统一 -->
        <div class="interest-item">
          <div class="interest-icon">📝</div> <!-- 图标保持一致风格 -->
          <h4>记录成长</h4>
          <p class="tagline">记录学习收获和经验</p>
        </div>
        <div class="interest-item">
          <div class="interest-icon">🤝</div>
          <h4>分享交流</h4>
          <p class="tagline">与同好交流技术心得</p>
        </div>
        <div class="interest-item">
          <div class="interest-icon">🎯</div>
          <h4>沉淀思考</h4>
          <p class="tagline">整理思路，形成体系</p>
        </div>
      </div>
    </div>
    <div class="section contact">
      <h2>💬 找到我</h2>
      <p>欢迎交流技术、跑步或任何有趣话题！</p>
      <div class="contact-buttons">
        <a href="mailto:2690640537@qq.com" class="contact-btn">📧 发邮件</a>
        <a href="/messages" class="contact-btn">💬 留言板</a>
      </div>
    </div>
  </div>
</div>
