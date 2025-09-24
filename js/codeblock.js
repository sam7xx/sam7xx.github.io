
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('pre[class*="language-"]').forEach(addToolbar);
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  initThemeToggle();
});

function addToolbar(codeBlock) {
  const container = codeBlock.closest('.code-toolbar') || createContainer(codeBlock);
  const language = codeBlock.className.match(/language-(\w+)/)[1] || 'unknown';
  const fileName = codeBlock.dataset.filename || 'code.txt';

  // 创建工具栏容器
  const toolbar = document.createElement('div');
  toolbar.className = 'toolbar-container';

  // 代码信息（语言和文件名）
  const codeInfo = document.createElement('div');
  codeInfo.className = 'code-info';
  codeInfo.innerHTML = `
    <span class="language-tag">${language}</span>
    <span class="file-name" title="${fileName}">${fileName}</span>
  `;

  // 工具栏按钮
  const buttons = document.createElement('div');
  buttons.className = 'toolbar-buttons';
  const buttonConfig = [
    { icon: 'fa-compress', tip: '折叠代码', action: 'fold' },
    { icon: 'fa-copy', tip: '复制代码', action: 'copy' },
    { icon: 'fa-download', tip: '下载代码', action: 'download' },
    { icon: 'fa-expand', tip: '全屏预览', action: 'fullscreen' }
  ];

  buttonConfig.forEach(btn => {
    const button = document.createElement('button');
    button.className = 'toolbar-btn';
    button.title = btn.tip;
    button.innerHTML = `<i class="fas ${btn.icon}"></i>`;
    button.dataset.action = btn.action;
    button.addEventListener('click', e => handleButtonClick(e, codeBlock));
    buttons.appendChild(button);
  });

  toolbar.appendChild(codeInfo);
  toolbar.appendChild(buttons);
  container.insertBefore(toolbar, codeBlock.nextSibling);

}

function handleButtonClick(event, codeBlock) {
  const action = event.target.closest('.toolbar-btn').dataset.action;
  switch(action) {
    case 'fold':
      toggleFold(codeBlock);
      break;
    case 'copy':
      copyToClipboard(codeBlock.textContent);
      break;
    case 'download':
      downloadCode(codeBlock.textContent);
      break;
    case 'fullscreen':
      toggleFullscreen(codeBlock);
      break;
  }
}

function toggleFold(codeBlock) {
  const container = codeBlock.closest('.code-toolbar');
  container.classList.toggle('code-collapsed');
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    const toast = document.createElement('div');
    toast.className = 'copy-toast';
    toast.textContent = '已复制！';
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 2000);
  });
}

function downloadCode(code) {
  const blob = new Blob([code], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `code-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function toggleFullscreen(element) {
  const container = element.closest('.code-toolbar');
  if (!document.fullscreenElement) {
    container.classList.add('fullscreen-mode');
    container.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

function handleFullscreenChange() {
  const fullscreenElement = document.fullscreenElement;
  if (!fullscreenElement) {
    document.querySelector('.fullscreen-mode')?.classList.remove('fullscreen-mode');
  }
}

function createContainer(codeBlock) {
  const container = document.createElement('div');
  container.className = 'code-toolbar';
  container.appendChild(codeBlock);
  codeBlock.parentNode.replaceChild(container, codeBlock);
  return container;
}
