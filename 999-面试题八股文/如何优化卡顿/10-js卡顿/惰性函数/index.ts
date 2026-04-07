// 惰性函数就可以解决一部分的卡顿问题
// 惰性函数就是让函数只在第一次调用时执行，之后都返回第一次执行的结果
/**
 * 惰性函数就是让函数只在第一次调用时执行，之后都返回第一次执行的结果
 * @param fn 需要惰性化的函数
 * @returns 惰性函数
 */
function lazyOnce<TThis, TArgs extends any[], TResult>(
  fn: (this: TThis, ...args: TArgs) => TResult,
) {
  let inited = false;
  let value!: TResult;

  const fnLazy = function (this: TThis, ...args: TArgs): TResult {
    if (!inited) {
      inited = true;
      value = fn.apply(this, args);
    }
    return value;
  };
  const clear = () => {
    inited = false;
    value = undefined as unknown as TResult;
  };
  return {
    fnLazy,
    clear,
  };
}

const { fnLazy: lazyFn, clear } = lazyOnce((a: number = 0, b: number = 0) => {
  console.log("lazyFn,我是执行很久的函数");
  return a + b;
});

// 我先初始一次
console.log(lazyFn(1, 2));
// 我第二次不需要执行那个函数
console.log(lazyFn(), "我第二次不需要执行那个函数");
// 我清空一次
clear();
// 我第三次需要执行那个函数
console.log(lazyFn(1, 3), "我第三次需要执行那个函数");
