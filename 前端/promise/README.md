# Promise 学习指南

## 📚 简介

本目录包含关于 JavaScript Promise 的完整学习资料，包括概念说明、示例代码和实际应用场景。

Promise 是 ES6（ES2015）引入的重要特性，它为 JavaScript 的异步编程提供了强大的解决方案，是现代异步编程的基础。

## 📁 文件说明

- **`code.js`** - 完整的示例代码文件，包含所有概念演示和实际应用
- **`README.md`** - 本文件，学习指南和文档

## 📖 内容结构

### 第一部分：Promise 基础

#### 什么是 Promise

- Promise 是一个表示异步操作最终完成或失败的对象
- Promise 有三种状态：pending（等待中）、fulfilled（已成功）、rejected（已失败）
- 状态一旦改变就不会再变（从 pending 到 fulfilled 或 rejected）

#### Promise 的创建

- 使用 `new Promise()` 构造函数创建
- 构造函数接收一个执行器函数 `(resolve, reject) => {}`
- `resolve` 用于将 Promise 状态变为 fulfilled
- `reject` 用于将 Promise 状态变为 rejected

#### Promise 的基本使用

- 使用 `.then()` 处理成功情况
- 使用 `.catch()` 处理失败情况
- 使用 `.finally()` 处理无论成功或失败都要执行的代码

### 第二部分：Promise 链式调用

#### then 方法的链式调用

- `.then()` 方法返回一个新的 Promise
- 可以连续调用多个 `.then()` 形成链式调用
- 前一个 `.then()` 的返回值会作为下一个 `.then()` 的参数

#### 错误传播

- 错误会沿着 Promise 链向下传播
- 可以在链的任意位置使用 `.catch()` 捕获错误
- 一旦被捕获，错误就不会继续传播

#### Promise 链的执行顺序

- Promise 的执行是异步的
- 多个 Promise 的执行顺序和完成顺序可能不同
- 理解事件循环和微任务队列

### 第三部分：Promise 静态方法

#### Promise.all()

- 等待所有 Promise 完成
- 如果有一个失败，整个 Promise.all() 就会失败
- 返回结果数组，顺序与输入顺序一致

#### Promise.race()

- 返回第一个完成（成功或失败）的 Promise
- 其他 Promise 的结果会被忽略
- 适用于超时控制等场景

#### Promise.allSettled()

- 等待所有 Promise 完成（无论成功或失败）
- 返回结果数组，包含每个 Promise 的状态和值
- ES2020 引入

#### Promise.any()

- 返回第一个成功的 Promise
- 如果全部失败，返回 AggregateError
- ES2021 引入

#### Promise.resolve() 和 Promise.reject()

- 快速创建已解决的 Promise
- 用于将值转换为 Promise

### 第四部分：Promise 与 async/await

#### async/await 语法

- `async` 函数返回一个 Promise
- `await` 用于等待 Promise 完成
- 使异步代码看起来像同步代码

#### async/await 与 Promise 的关系

- `async/await` 是 Promise 的语法糖
- 底层仍然使用 Promise
- 可以混合使用 Promise 和 async/await

#### 错误处理对比

- Promise 使用 `.catch()`
- async/await 使用 `try/catch`
- 两种方式的对比和选择

### 第五部分：实际应用场景

#### 异步请求处理

- 使用 Promise 处理 HTTP 请求
- 处理多个异步请求
- 错误处理和重试机制

#### 并发控制

- 限制并发数量
- 实现请求队列
- 批量处理数据

#### 超时控制

- 使用 Promise.race() 实现超时
- 取消长时间运行的请求

#### 顺序执行

- 按顺序执行多个异步操作
- 使用 reduce 实现顺序执行

## 🚀 快速开始

### 运行示例代码

```bash
# 使用 Node.js 运行
node intelligence/promise/code.js

# 或在浏览器控制台中运行
# 复制代码到浏览器控制台执行
```

### 学习路径建议

1. **第一步**：理解 Promise 基础

   - 阅读第一部分：Promise 基础概念
   - 运行示例 1-3，理解 Promise 的创建和使用

2. **第二步**：掌握链式调用

   - 阅读第二部分：Promise 链式调用
   - 运行示例 4-6，理解链式调用和错误处理

3. **第三步**：学习静态方法

   - 阅读第三部分：Promise 静态方法
   - 运行示例 7-11，理解各种静态方法的用法

4. **第四步**：理解 async/await

   - 阅读第四部分：Promise 与 async/await
   - 运行示例 12-14，理解两者的关系和转换

5. **第五步**：实际应用
   - 阅读第五部分：实际应用场景
   - 运行示例 15-18，理解实际应用

## 💡 核心概念

### Promise 状态

```javascript
// Promise 的三种状态
pending; // 等待中
fulfilled; // 已成功
rejected; // 已失败
```

### Promise 基本用法

```javascript
// 创建 Promise
const promise = new Promise((resolve, reject) => {
	// 异步操作
	if (success) {
		resolve(value); // 成功
	} else {
		reject(error); // 失败
	}
});

// 使用 Promise
promise
	.then((value) => {
		// 处理成功
	})
	.catch((error) => {
		// 处理失败
	})
	.finally(() => {
		// 无论成功失败都执行
	});
```

### async/await

```javascript
// async/await 语法
async function fetchData() {
	try {
		const result = await someAsyncOperation();
		return result;
	} catch (error) {
		console.error(error);
	}
}
```

## 🔗 相关知识点

- **ES6（ES2015）**：Promise 首次引入
- **ES2017**：`async/await` 语法糖
- **ES2020**：`Promise.allSettled()` 引入
- **ES2021**：`Promise.any()` 引入
- **事件循环（Event Loop）**：Promise 的执行机制
- **微任务（Microtask）**：Promise 的回调是微任务
- **回调地狱（Callback Hell）**：Promise 解决的问题

## 📝 示例代码说明

示例代码文件 `code.js` 包含以下示例：

1. **示例 1**：创建 Promise
2. **示例 2**：Promise 的基本使用（then/catch/finally）
3. **示例 3**：Promise 的状态变化
4. **示例 4**：Promise 链式调用
5. **示例 5**：错误传播和捕获
6. **示例 6**：Promise 链的执行顺序
7. **示例 7**：Promise.all() - 等待所有完成
8. **示例 8**：Promise.race() - 第一个完成
9. **示例 9**：Promise.allSettled() - 等待所有完成（无论成功失败）
10. **示例 10**：Promise.any() - 第一个成功
11. **示例 11**：Promise.resolve() 和 Promise.reject()
12. **示例 12**：async/await 基础
13. **示例 13**：async/await 错误处理
14. **示例 14**：Promise 与 async/await 混合使用
15. **示例 15**：异步请求处理
16. **示例 16**：并发控制
17. **示例 17**：超时控制
18. **示例 18**：顺序执行

每个示例都有详细的中文注释和说明。

## 🎯 学习目标

完成本指南的学习后，你应该能够：

- ✅ 理解 Promise 的概念和三种状态
- ✅ 创建和使用 Promise
- ✅ 掌握 Promise 链式调用
- ✅ 理解 Promise 的错误处理机制
- ✅ 熟练使用 Promise 的静态方法
- ✅ 理解 async/await 与 Promise 的关系
- ✅ 在实际项目中应用 Promise 解决异步问题
- ✅ 避免常见的 Promise 使用错误

## 📚 延伸阅读

- [MDN - Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [MDN - async/await](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function)
- [ES6 标准文档](https://262.ecma-international.org/6.0/)
- [JavaScript 异步编程](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Asynchronous)
- [Promise A+ 规范](https://promisesaplus.com/)

## ❓ 常见问题

### Q: Promise 和回调函数有什么区别？

A: Promise 解决了回调地狱问题，提供了更好的错误处理机制，支持链式调用，使异步代码更易读易维护。

### Q: Promise 的状态可以改变吗？

A: Promise 的状态一旦从 pending 变为 fulfilled 或 rejected，就不会再改变。这是 Promise 的核心特性。

### Q: async/await 和 Promise 哪个更好？

A: 两者本质相同，async/await 是 Promise 的语法糖。async/await 使代码更易读，但在某些场景下（如并发控制）Promise 更灵活。

### Q: Promise.all() 和 Promise.allSettled() 有什么区别？

A: Promise.all() 如果有一个失败就会立即失败；Promise.allSettled() 会等待所有 Promise 完成，无论成功或失败。

### Q: 如何取消一个 Promise？

A: Promise 本身不支持取消，但可以通过包装、使用 AbortController 或 Promise.race() 实现取消效果。

---

**最后更新**：2026-02-24
