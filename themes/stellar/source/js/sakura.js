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

