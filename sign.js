/* eslint-disable */
/**
 * canvas签名
 */
class Sign {
  constructor(canvas, config) {
    if (!canvas) {
      return new Error('canvas is must be added');
    }
    this.width = canvas.offsetWidth;
    this.height = canvas.offsetHeight;
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.config = config;
    
    this.init();
  }
  init() {
    const canvas = this.canvas;
    const context = this.context;
  
    // 根据设备像素比优化canvas绘图
    const devicePixelRatio = window.devicePixelRatio;
    if (devicePixelRatio) {
      canvas.style.width = `${this.width}px`;
      canvas.style.height = `${this.height}px`;
      canvas.height = this.height * devicePixelRatio;
      canvas.width = this.width * devicePixelRatio;
      context.scale(devicePixelRatio, devicePixelRatio);
    } else {
      canvas.width = this.width;
      canvas.height = this.height;
    }
  
    context.lineWidth = 6;
    context.strokeStyle = 'black';
    context.lineCap = 'round';
    context.lineJoin = 'round';
    Object.assign(context, this.config);
  
    const isMobile = /phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone/i.test(navigator.userAgent);
    // 移动端性能太弱, 去掉模糊以提高手写渲染速度
    if (!isMobile) {
      context.shadowBlur = 1;
      context.shadowColor = 'black';
    }
  
    let pressed = false;
    const point = {};
    const { left, top } = canvas.getBoundingClientRect();
  
    const paint = (signal) => {
      switch (signal) {
        case 1:
          context.beginPath();
          context.moveTo(point.x, point.y);
        case 2:
          context.lineTo(point.x, point.y);
          context.stroke();
          break;
        default:
      }
    };
    const create = signal => (e) => {
      e.preventDefault();
      if (signal === 1) {
        pressed = true;
      }
      if (signal === 1 || pressed) {
        e = isMobile ? e.touches[0] : e;
        point.x = e.clientX - left;
        point.y = e.clientY - top;
        paint(signal);
      }
    };
    const start = create(1);
    const move = create(2);
    const requestAnimationFrame = window.requestAnimationFrame;
    const optimizedMove = requestAnimationFrame ? (e) => {
      requestAnimationFrame(() => {
        move(e);
      });
    } : move;
  
    if (isMobile) {
      canvas.addEventListener('touchstart', start);
      canvas.addEventListener('touchmove', optimizedMove);
    } else {
      canvas.addEventListener('mousedown', start);
      canvas.addEventListener('mousemove', optimizedMove);
      ['mouseup', 'mouseleave'].forEach((event) => {
        canvas.addEventListener(event, () => {
          pressed = false;
        });
      });
    }
  }
  export(type = 'png', blob = false, quality = 0.5) {
    let res;
    if (type === 'jpg') {
      res = this.canvas.toDataURL('image/jpeg', quality);
    } else {
      res = this.canvas.toDataURL('image/png');
    }
    if (blob) {
      const arr = res.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bStr = atob(arr[1]);
      let n = bStr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bStr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    }
    return res;
  }
  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  }
}

export default Sign;
