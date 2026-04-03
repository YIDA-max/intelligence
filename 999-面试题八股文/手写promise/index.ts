// promose 的a+规范 只要有then方法,就是promise
const promiseA = {
  then: () => {
    console.log("我是then方法,我符合promisea+规范");
  },
};
// 调用then方法 写完了
promiseA.then();

const a = new Promise((resolve) => {
  setTimeout(() => {
    resolve("promise成功1");
  }, 1000);
})
  .then((value) => {
    console.log(value);
    return new MyPromise((resolve) => {
      resolve("promise成功2");
    });
  })
  .then((value) => {
    console.log(value);
  });

// esScript 实现的 promise手写
// Promise 本质上是一个包含三种状态（Pending、Fulfilled、Rejected）的状态机，且状态一旦转变（从等待变为成功或失败）就不可逆
// 首先他肯定是一个类 一个工厂函数
class MyPromise {
  // 定义状态
  private state = "pending";
  // 定义成功后的值
  private value: any;
  // 定义失败后的原因
  private reason: any;
  // 发布订阅模式
  // 定义成功后的回调
  private onFulfilledCallbacks: ((value: any) => void)[] = [];
  // 定义失败后的回调
  private onRejectedCallbacks: ((reason: any) => void)[] = [];
  // promise 的生成是需要一个参数的
  constructor(
    executor: (
      resolve: (value: any) => void,
      reject: (reason: any) => void,
    ) => void,
  ) {
    // 首先状态肯定是pending
    this.state = "pending";
    const resolve = (value: any) => {
      if (this.state === "pending") {
        this.value = value;
        this.state = "fulfilled";
        // 执行回调函数
        if (this.onFulfilledCallbacks.length > 0) {
          this.onFulfilledCallbacks.forEach((callback) => {
            callback(value);
          });
        }
      }
    };
    const reject = (reason: any) => {
      if (this.state === "pending") {
        this.reason = reason;
        this.state = "rejected";
        // 执行回调函数
        if (this.onRejectedCallbacks.length > 0) {
          this.onRejectedCallbacks.forEach((callback) => {
            callback(reason);
          });
        }
      }
    };
    // 执行构造器
    executor(resolve, reject);
  }
  public then(
    onFulfilled: (value: any) => any,
    onRejected?: (reason: any) => any,
  ) {
    //  then是返回一个promise对象
    return new MyPromise((resolve, reject) => {
      if (this.state === "fulfilled") {
        // 如果是成功状态,则直接执行回调函数
        queueMicrotask(() => {
          // 确保异步
          const x = onFulfilled(this.value);
          // 只要是有then方法,就是promise,就手动帮忙执行then方法
          if (x && typeof x.then === "function") {
            x.then(resolve, reject);
          } else {
            resolve(x);
          }
        });
      } else if (this.state === "rejected") {
        // 如果是失败状态,则直接执行回调函数
        queueMicrotask(() => {
          const x = onRejected?.(this.reason);
          resolve(x);
        });
      } else if (this.state === "pending") {
        // 如果是等等,就意味着还没执行完,所以把回调函数存起来
        this.onFulfilledCallbacks.push((value) => {
          // resolve
          const x = onFulfilled(value);
          // 只要是有then方法,就是promise,就手动帮忙执行then方法
          if (x && typeof x.then === "function") {
            x.then(resolve, reject);
          } else {
            resolve(x);
          }
        });
        this.onRejectedCallbacks.push((reason) => {
          // reject
          reject(onRejected?.(reason));
        });
      }
    });
  }
  public catch(onRejected: (reason: any) => void) {
    if (this.state === "rejected") {
      onRejected?.(this.reason);
    }
  }
}
const b = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    console.log("settimeout");
    resolve("MyPromise成功1");
  }, 2000);
})
  .then((value) => {
    console.log(value);
    return new Promise((resolve, reject) => {
      resolve("MyPromise成功2");
    });
  })
  .then((value) => {
    console.log(value);
  });
