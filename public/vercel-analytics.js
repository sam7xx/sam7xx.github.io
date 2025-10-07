// 从 @vercel/analytics 包中提取核心逻辑（适配浏览器环境）
(function() {
  const script = document.createElement('script');
  script.src = 'https://cdn.vercel-insights.com/v1/script.js';
  script.defer = true;
  // 替换为你的 Vercel 项目 ID（可选，不填则自动关联当前部署的项目）
  // script.dataset.project = '你的项目ID'; 
  document.head.appendChild(script);
})();