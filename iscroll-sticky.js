/* eslint-disable */
export const extendSticky = (iScroll) => {
  let m = Math;
  let vendor = (/webkit/i).test(navigator.appVersion) ? 'webkit' :
      (/firefox/i).test(navigator.userAgent) ? 'Moz' :
        'opera' in window ? 'O' : '',
    has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(),
    trnOpen = 'translate' + (has3d ? '3d(' : '('),
    trnClose = has3d ? ',0)' : ')';
  
  /**
   *
   * @param selector 需要sticky的对象集合
   * @param mode 模式，默认autocover自动叠加吸顶， custom用户自定义位置模式
   * @return { iScrollStickyHeaders }
   */
  iScroll.prototype.enableStickyHeaders = function (selector, mode = 'autocover') {
    return new iScrollStickyHeaders(this, selector, mode);
  };

  let iScrollStickyHeaders = function (iscroll, selector, mode) {
    if (!iscroll.options.useTransform) {
      return;
    }
    this.iscroll = iscroll;
    if (mode === 'autocover') {
      this.selector = selector.map(obj => obj.el);
    }
    if (mode === 'custom') {
      this.selector = selector;
    }
    this.mode = mode;
    this.initialize();
  };
  iScrollStickyHeaders.prototype = {
    headers: [],
    initialize() {
      let that = this;
      this._augment();
      this.iscroll.on('refresh', function() {
        that._refresh()
      });
      this.iscroll.refresh()
    },
    _refresh() {
      let elms = this.selector;
      this.headers = [];
      if (this.mode === 'autocover') {
        elms.forEach((el, index) => {
          let header = {
            el: el,
            minY: el.offsetTop,
            maxY: el.offsetHeight + el.offsetTop
          };
          let prevHeader = this.headers[index - 1];
          if (prevHeader) {
            prevHeader.maxY = m.abs(prevHeader.maxY - header.minY);
          }
          this.headers.push(header);
        });
      }
      if (this.mode === 'custom') {
        this.headers = [
          ...elms,
        ]
      }
      this._translate();
    },
    _translate(x, y) {
      let absY = m.abs(y);
      let preventTranslate = y > 0;
      if (this.mode === 'autocover') {
        this.headers.forEach((stickyObj, index) => {
          let translateY = absY - stickyObj.minY;
          if (preventTranslate || translateY < 0) {
            translateY = 0;
          } else if (translateY > stickyObj.maxY) {
            if (index + 1 !== this.headers.length)
              translateY = stickyObj.maxY;
          }
          stickyObj.el.style[vendor + 'Transform'] = trnOpen + ('0, ' + translateY + 'px') + trnClose;
        });
      }
      if (this.mode === 'custom') {
        this.headers.forEach((stickyObj) => {
          let translateY = 0;
          let yy = m.abs(absY - stickyObj.el.offsetTop);
          if (absY - stickyObj.el.offsetTop > 0 || yy <= stickyObj.top) {
            translateY = absY - (stickyObj.el.offsetTop - stickyObj.top);
          } else {
            translateY = 0;
          }
          stickyObj.el.style[vendor + 'Transform'] = trnOpen + ('0, ' + translateY + 'px') + trnClose;
        });
      }
    },
    _augment() {
      let that = this;
      this.iscroll.on('scroll', function() {
        that._translate(this.x, this.y)
      });
      this.iscroll.on('beforeScrollStart', function() {
        that._translate(this.x, this.y)
      });
      this.iscroll.on('scrollStart', function() {
        that._translate(this.x, this.y)
      });
    }
  };
};
export default extendSticky;
