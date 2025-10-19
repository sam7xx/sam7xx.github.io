// 主题切换按钮逻辑
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme); // 给根元素设置data-theme属性，值为传入的主题
  localStorage.setItem('theme', theme); // 将主题值存入localStorage，持久化保存
}
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme'); // 获取当前根元素的data-theme属性值
  setTheme(current === 'dark' ? 'light' : 'dark'); // 如果当前是暗色模式则切换为亮色，反之切换为暗色
}
// 自动读取本地存储
(function() {
  const saved = localStorage.getItem('theme'); // 从localStorage获取保存的主题
  if (saved) setTheme(saved); // 如果有保存的主题，则应用该主题
})();
// 跟随系统颜色变化
(function() {
  // 优先本地存储
  const saved = localStorage.getItem('theme'); // 从localStorage获取保存的主题
  if (saved) {
    setTheme(saved); // 若有保存的主题，应用该主题
  } else {
    // 跟随系统
    const mq = window.matchMedia('(prefers-color-scheme: dark)'); // 创建媒体查询对象，检测系统是否为暗色模式
    setTheme(mq.matches ? 'dark' : 'light'); // 根据系统主题设置网站主题（暗色/亮色）
    mq.addEventListener('change', function(e) { // 监听系统主题变化事件
      // 仅当未手动切换时才跟随系统
      if (!localStorage.getItem('theme')) { // 若localStorage中没有保存的主题（即未手动切换过）
        setTheme(e.matches ? 'dark' : 'light'); // 根据系统主题变化更新网站主题
      }
    });
  }
})();
// 绑定页脚按钮点击事件
window.addEventListener('DOMContentLoaded', function () { // 监听DOM加载完成事件
  // 支持多种渲染方式，自动识别按钮
  const themeBtns = document.querySelectorAll('.fa-circle-half-stroke'); // 选择所有类名为fa-circle-half-stroke的元素（主题切换按钮）
  themeBtns.forEach(function(btn) { // 遍历所有找到的按钮
    btn.addEventListener('click', function (e) { // 给每个按钮绑定点击事件
      e.preventDefault(); // 阻止默认行为（如链接跳转）
      toggleTheme(); // 点击时切换主题
    });
  });
});
