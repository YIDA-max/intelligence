// 什么是惰性函数
// 使用闭包让函数只在第一次调用时执行，之后都返回第一次执行的结果
const lazyFn = (fn: Function) => {
  return (...args: any[]) => {
    return fn.apply(this, args);
  };
};
