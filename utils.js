/**
 * 防抖函数
 * @param fn
 * @param delay
 * @returns {Function}
 */
export const debounce = (fn, delay) => {
  // fn 需要防抖执行的函数  delay 防抖的时间间隔
  let timer;
  return function () {
    let _args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, _args);
    }, delay)
  };
};
/**
 * 节流函数
 * @param fn
 * @param delay
 * @returns {Function}
 */
export const throttle = (fn, delay) => {
  let last, timer;
  return function () {
    let _args = arguments;
    let now = +new Date();
    if (last && now < last + delay) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        last = now;
        fn.apply(this, _args);
      }, delay);
    } else {
      last = now;
      fn.apply(this, _args);
    }
  };
};