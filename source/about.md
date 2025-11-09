---
title: 关于作者
layout: page
comments: false
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

[data-theme="light"] {
  --primary-color: #A8B8E0;
  --primary-light: #B8C8F0;
  --primary-dark: #7A95D6;
  --bg-color: #fefefe;
  --card-bg: #f9fafb;
  --text-color: #374151;
  --text-light: #6b7280;
  --border-color: #e5e7eb;
  --shadow: 0 2px 8px rgba(0,0,0,0.05);
}

[data-theme="dark"] {
  --primary-color: #6B8CD8;
  --primary-light: #8BA6F0;
  --primary-dark: #5A7BC7;
  --bg-color: #1f2937;
  --card-bg: #374151;
  --text-color: #f3f4f6;
  --text-light: #d1d5db;
  --border-color: #4b5563;
  --shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.about-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 15px;
  font-family: "LXGW WenKai Screen";
  line-height: 1.5;
  color: var(--text-color);
  background-color: var(--bg-color);
  transition: all 0.3s ease;
  position: relative;
}

/* 个人简介卡片 */
.profile-card {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
  color: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: var(--shadow);
  margin-top: 40px;
}

.avatar-container {
  margin-right: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid rgba(255,255,255,0.3);
  object-fit: cover;
}

.profile-content h1 {
  margin: 0 0 8px 0;
  font-size: 1.4em;
  font-weight: 600;
}

.subtitle {
  margin: 0 0 12px 0;
  opacity: 0.9;
  font-size: 1em;
}

.expertise-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  background: rgba(255,255,255,0.25);
  padding: 4px 10px;
  border-radius: 14px;
  font-size: 0.85em;
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  gap: 5px;
}

/* 通用区块样式 */
.section {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
  box-shadow: var(--shadow);
  margin-bottom: 20px;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.section h2 {
  margin-top: 0;
  margin-bottom: 15px;
  color: var(--text-color);
  font-size: 1.3em;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 技能网格 */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 15px;
}

.skill-card {
  background: var(--bg-color);
  padding: 15px;
  border-radius: 6px;
  border-left: 3px solid var(--primary-color);
  transition: all 0.3s ease;
}

.skill-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.skill-icon {
  font-size: 1.5em;
  margin-right: 10px;
  width: 35px;
  text-align: center;
  color: var(--primary-color);
}

.skill-card h3 {
  margin: 0;
  color: var(--text-color);
  font-size: 1.1em;
}

.skill-card ul {
  margin: 0;
  padding-left: 18px;
}

.skill-card li {
  margin-bottom: 6px;
  color: var(--text-light);
  font-size: 0.9em;
}

/* 学习方向 */
.learning-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 15px;
}

.learning-card {
  background: var(--bg-color);
  padding: 15px;
  border: 1px solid var(--primary-light);
  border-radius: 6px;
  transition: all 0.3s ease;
}

.learning-card h3 {
  margin-top: 0;
  margin-bottom: 12px;
  color: var(--text-color);
  font-size: 1.1em;
  display: flex;
  align-items: center;
  gap: 8px;
}

.learning-card ul {
  margin: 0;
  padding-left: 18px;
}

.learning-card li {
  margin-bottom: 6px;
  color: var(--text-light);
  font-size: 0.9em;
}

/* 兴趣网格 */
.interests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.interest-item {
  display: flex;
  align-items: center;
  background: var(--bg-color);
  padding: 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.interest-icon {
  font-size: 1.5em;
  margin-right: 12px;
  width: 35px;
  text-align: center;
  color: var(--primary-color);
}

.interest-content h4 {
  margin: 0 0 4px 0;
  color: var(--text-color);
  font-size: 1em;
}

.interest-content p {
  margin: 0;
  color: var(--text-light);
  font-size: 0.85em;
}

/* 目的网格 */
.purpose-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.purpose-card {
  background: var(--bg-color);
  padding: 15px;
  border-radius: 6px;
  text-align: center;
  transition: all 0.3s ease;
}

.purpose-card h4 {
  margin: 0 0 8px 0;
  color: var(--text-color);
  font-size: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.purpose-card p {
  margin: 0;
  color: var(--text-light);
  font-size: 0.85em;
  line-height: 1.4;
}

/* 联系区块 */
.contact-section {
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
  color: white;
  text-align: center;
}

.contact-section h2 {
  color: white;
  border-bottom-color: rgba(255,255,255,0.3);
}

.contact-intro {
  margin-bottom: 15px;
  opacity: 0.9;
  font-size: 0.95em;
}

.contact-info {
  background: rgba(255,255,255,0.15);
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 15px;
  text-align: left;
  font-size: 0.9em;
}

.contact-info p {
  margin: 0 0 8px 0;
}

.contact-info p:last-child {
  margin-bottom: 0;
}

.contact-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.contact-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(255,255,255,0.25);
  color: white;
  text-decoration: none;
  border-radius: 20px;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255,255,255,0.3);
  font-size: 0.9em;
}

.contact-btn:hover {
  background: rgba(255,255,255,0.35);
  transform: translateY(-1px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .about-page {
    padding: 10px;
  }

  .profile-card {
    flex-direction: column;
    text-align: center;
    padding: 15px;
    margin-top: 30px;
  }

  .avatar-container {
    margin-right: 0;
    margin-bottom: 12px;
  }

  .skills-grid,
  .learning-grid,
  .interests-grid,
  .purpose-grid {
    grid-template-columns: 1fr;
  }

  .contact-buttons {
    flex-direction: column;
    align-items: center;
  }

  .contact-btn {
    width: 180px;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .profile-content h1 {
    font-size: 1.2em;
  }

  .section {
    padding: 15px 12px;
  }

  .interest-item {
    flex-direction: column;
    text-align: center;
  }

  .interest-icon {
    margin-right: 0;
    margin-bottom: 8px;
  }
}

/* 平滑过渡效果 */
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  }
  </style>

<!-- 个人简介 -->
<div class="profile-card">
<div class="avatar-container">
    <img src="https://u.sam7.top/3MiiTn" alt="作者头像" class="avatar" onerror="this.style.display='none'">
</div>
<div class="profile-content">
    <h1><i class="fas fa-bolt"></i> 开关电源设计 · 五年搬砖经验</h1>
    <p class="subtitle">擅长140W及以下功率的开关电源设计与优化</p>
    <div class="expertise-tags">
    <span class="tag"><i class="fas fa-plug"></i> 电源适配器</span>
    <span class="tag"><i class="fas fa-mobile-screen-button"></i> 快充充电器</span>
    <span class="tag"><i class="fas fa-plug-circle-bolt"></i> 车载充电器</span>
    <span class="tag"><i class="fas fa-tachometer-alt"></i> 仪表电源</span>
    </div>
</div>
</div>

<!-- 专业技能 -->
<div class="section">
<h2><i class="fas fa-tools"></i> 专业能力</h2>
<div class="skills-grid">
    <div class="skill-card">
    <div class="skill-header">
        <span class="skill-icon"><i class="fas fa-microchip"></i></span>
        <h3>电路设计</h3>
    </div>
    <ul>
        <li>熟练使用 Altium Designer、KiCad 等软件进行原理图与PCB设计</li>
        <li>熟悉开关电源PCB设计规范与安规要求</li>
        <li>综合考虑EMC、热管理、可制造性等因素</li>
    </ul>
    </div>
    <div class="skill-card">
    <div class="skill-header">
        <span class="skill-icon"><i class="fas fa-project-diagram"></i></span>
        <h3>电路拓扑</h3>
    </div>
    <ul>
        <li>熟练掌握 Buck、Boost、Buck-Boost、Flyback、AHB等拓扑</li>
        <li>熟练掌握PFC电路、恒压恒流等电路</li>
    </ul>
    </div>
    <div class="skill-card">
    <div class="skill-header">
        <span class="skill-icon"><i class="fas fa-search"></i></span>
        <h3>设计验证</h3>
    </div>
    <ul>
        <li>熟悉元器件选型计算与性能分析</li>
        <li>了解开关电源性能指标</li>
        <li>熟练掌握电源性能测试方法</li>
    </ul>
    </div>
</div>
</div>

<!-- 学习规划 -->
<div class="section">
<h2><i class="fas fa-rocket"></i> 学习方向</h2>
<div class="learning-grid">
    <div class="learning-card">
    <h3><i class="fas fa-code"></i> 软件技能提升</h3>
    <ul>
        <li>Python - 电路仿真与数据分析</li>
        <li>自动化脚本开发与应用</li>
        <li>C语言与嵌入式系统学习</li>
        <li>电源设计工具开发</li>
    </ul>
    </div>
    <div class="learning-card">
    <h3><i class="fas fa-microchip"></i> 硬件技术深化</h3>
    <ul>
        <li>大功率电源设计技术</li>
        <li>大功率电源拓扑学习</li>
        <li>环路稳定性分析与优化</li>
        <li>电磁兼容性设计与仿真</li>
    </ul>
    </div>
</div>
</div>

<!-- 个人兴趣 -->
<div class="section">
<h2><i class="fas fa-heart"></i> 个人兴趣</h2>
<div class="interests-grid">
    <div class="interest-item">
    <span class="interest-icon"><i class="fas fa-running"></i></span>
    <div class="interest-content">
        <h4>跑步爱好者</h4>
        <p>科学训练 · 运动康复</p>
    </div>
    </div>
    <div class="interest-item">
    <span class="interest-icon"><i class="fas fa-music"></i></span>
    <div class="interest-content">
        <h4>音乐娱乐</h4>
        <p>音乐欣赏 · 游戏动漫</p>
    </div>
    </div>
    <div class="interest-item">
    <span class="interest-icon"><i class="fab fa-creative-commons"></i></span>
    <div class="interest-content">
        <h4>拥抱开源</h4>
        <p>开源软件 · 技术分享</p>
    </div>
    </div>
</div>
</div>

<!-- 建站目的 -->
<div class="section">
<h2><i class="fas fa-star"></i> 写作初衷</h2>
<div class="purpose-grid">
    <div class="purpose-card">
    <h4><i class="fas fa-book"></i> 技术沉淀</h4>
    <p>记录工作中的技术难题与解决方案，形成个人知识体系</p>
    </div>
    <div class="purpose-card">
    <h4><i class="fas fa-running"></i> 跑步记录</h4>
    <p>分享训练心得、伤痛管理经验与科学训练方法</p>
    </div>
    <div class="purpose-card">
    <h4><i class="fas fa-share-alt"></i> 经验分享</h4>
    <p>整理个人在电源设计中的一些心得，希望能与同行交流探讨</p>
    </div>
    <div class="purpose-card">
    <h4><i class="fas fa-graduation-cap"></i> 学习成长</h4>
    <p>记录学习历程，见证个人技能与认知的持续提升</p>
    </div>
</div>
</div>

<!-- 联系方式 -->
<div class="section contact-section">
<h2><i class="fa-solid fa-phone-volume"></i> 交流联系</h2>
<p class="contact-intro">如果您对电源设计、技术分享或跑步相关有兴趣，欢迎与我交流探讨！</p>
<div class="contact-info">
    <p><strong>擅长领域：</strong>开关电源设计 · PCB设计 · 电源测试</p>
    <p><strong>学习方向：</strong>大功率电源拓扑 · 电源仿真 · Python</p>
</div>
<div class="contact-buttons">
    <a href="mailto:2690640537@qq.com" class="contact-btn"><i class="fas fa-envelope"></i> 邮箱</a>
    <a href="https://github.com/sam7xx" class="contact-btn"><i class="fab fa-github"></i> GitHub</a>
    <a href="/messages" class="contact-btn"><i class="fas fa-comments"></i> 留言</a>
    <a href="/" class="contact-btn"><i class="fas fa-home"></i> 首页</a>
    <a href="/archives" class="contact-btn"><i class="fas fa-archive"></i> 归档</a>
    <a href="/categories" class="contact-btn"><i class="fa-solid fa-list"></i> 分类</a>
    <a href="/tags" class="contact-btn"><i class="fas fa-tag"></i> 标签 </a>
    <a href="/atom.xml" class="contact-btn"><i class="fas fa-rss"></i> RSS </a>
    <a href="/links" class="contact-btn"><i class="fas fa-link"></i> 友链 </a>
</div>
</div>
