/**
 * 什么是节流
 * 节流就是在一定的时间范围内,只运行一次函数
 */

/**
 * @param {Number} delay 延迟时间,默认1000ms
 * @returns {Function} 节流后的函数
 */
const throttle = (fn, delay = 1000) => {
  // 记录上一次执行的时间,默认情况就是0,因为一开始的时候是可以执行
  let lastTime = 0;
  return function (...args) {
    // 当前时间
    const now = Date.now();
    // 如果当前时间减去上一次执行的时间大于延迟时间,则执行函数
    if (now - lastTime > delay) {
      // 执行函数,传递this和args
      fn.apply(this, args);
      // 更新上一次执行的时间
      lastTime = now;
    }
  };
};

const fn = throttle(() => {
  console.log("fn");
}, 1000);

fn();
setTimeout(() => {
  fn();
}, 100);

/**
 * 节流优化版
 *
 * @param {Function} fn 需要节流的函数
 * @param {Number} delay 延迟时间,默认1000ms
 * @param {Object} options 选项,默认{ leading: true, trailing: false }
 * @param {Boolean} options.leading 是否在前面执行,默认true
 * @param {Boolean} options.trailing 是否在后面执行,默认false
 * @returns {Function} 节流后的函数
 */
const throttlePro = (
  fn,
  delay = 1000,
  options = { leading: true, trailing: false },
) => {
  let timer = null;
  let lastTime = 0;

  const throttled = function (...args) {
    const now = Date.now();

    // 1. 如果设置了不立即执行，且是第一次触发，则将 lastTime 设为当前时间
    if (!lastTime && options.leading === false) {
      lastTime = now;
    }

    // 2. 计算距离下次执行还需要多久
    const remaining = delay - (now - lastTime);

    // 3. 时间到了执行（或系统时间调整导致 remaining > delay）
    if (remaining <= 0 || remaining > delay) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastTime = now;
      fn.apply(this, args);
    }
    // 4. 如果允许尾部执行，且当前没有定时器在排队
    else if (options.trailing !== false && !timer) {
      timer = setTimeout(() => {
        // 如果 leading 为 false，重置 lastTime 为 0
        // 否则重置为当前时间，为下一次触发做准备
        lastTime = options.leading === false ? 0 : Date.now();
        timer = null;
        fn.apply(this, args);
      }, remaining);
    }
  };

  // 额外功能：手动取消
  throttled.cancel = function () {
    clearTimeout(timer);
    timer = null;
    lastTime = 0;
  };

  return throttled;
};
