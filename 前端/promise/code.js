/* eslint-disable no-console, @typescript-eslint/no-unused-vars, no-unused-vars */
/*
 * Promise 的概念与示例
 *
 * 本文件包含：
 * 1. Promise 基础概念和创建
 * 2. Promise 链式调用和错误处理
 * 3. Promise 静态方法
 * 4. Promise 与 async/await
 * 5. 实际应用场景
 */

// ============================================
// 第一部分：Promise 基础
// ============================================

/**
 * 什么是 Promise？
 *
 * Promise 是一个表示异步操作最终完成或失败的对象。
 * Promise 有三种状态：
 * - pending（等待中）：初始状态
 * - fulfilled（已成功）：操作成功完成
 * - rejected（已失败）：操作失败
 *
 * 状态一旦改变就不会再变（从 pending 到 fulfilled 或 rejected）
 */

// 示例1：创建 Promise
console.log('=== 示例1：创建 Promise ===');

/**
 * Promise 构造函数接收一个执行器函数
 * 执行器函数接收两个参数：resolve 和 reject
 * - resolve: 将 Promise 状态变为 fulfilled
 * - reject: 将 Promise 状态变为 rejected
 */

const promise1 = new Promise((resolve, reject) => {
	// 模拟异步操作
	setTimeout(() => {
		const success = true; // 模拟操作是否成功
		if (success) {
			resolve('操作成功！'); // 成功时调用 resolve
		} else {
			reject(new Error('操作失败！')); // 失败时调用 reject
		}
	}, 1000);
});

console.log('Promise 已创建，状态：pending');
console.log('1秒后会完成...');

// 示例2：Promise 的基本使用
console.log('\n=== 示例2：Promise 的基本使用 ===');

/**
 * Promise 的使用方法：
 * - .then() 处理成功情况
 * - .catch() 处理失败情况
 * - .finally() 处理无论成功失败都要执行的代码
 */

const promise2 = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve('数据获取成功');
	}, 500);
});

promise2
	.then((value) => {
		console.log('成功:', value);
		return '处理后的数据';
	})
	.then((value) => {
		console.log('链式调用:', value);
	})
	.catch((error) => {
		console.error('失败:', error);
	})
	.finally(() => {
		console.log('无论成功失败都会执行');
	});

// 示例3：Promise 的状态变化
console.log('\n=== 示例3：Promise 的状态变化 ===');

const promise3 = new Promise((resolve, reject) => {
	console.log('Promise 创建，当前状态：pending');

	setTimeout(() => {
		resolve('状态变为 fulfilled');
		console.log('resolve 被调用');
	}, 100);
});

promise3.then((value) => {
	console.log('状态：fulfilled, 值:', value);
});

// 注意：Promise 的状态一旦改变就不会再变
const promise4 = new Promise((resolve, reject) => {
	resolve('第一次 resolve');
	resolve('第二次 resolve'); // 这行不会生效
	reject('reject'); // 这行也不会生效
});

promise4.then((value) => {
	console.log('值:', value); // 只会输出 "第一次 resolve"
});

// ============================================
// 第二部分：Promise 链式调用
// ============================================

// 示例4：Promise 链式调用
console.log('\n=== 示例4：Promise 链式调用 ===');

/**
 * .then() 方法返回一个新的 Promise
 * 可以连续调用多个 .then() 形成链式调用
 * 前一个 .then() 的返回值会作为下一个 .then() 的参数
 */

function fetchUser() {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({ id: 1, name: '张三' });
		}, 100);
	});
}

function fetchOrders(userId) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve([
				{ id: 1, product: '商品A' },
				{ id: 2, product: '商品B' },
			]);
		}, 100);
	});
}

fetchUser()
	.then((user) => {
		console.log('获取用户:', user);
		return fetchOrders(user.id); // 返回新的 Promise
	})
	.then((orders) => {
		console.log('获取订单:', orders);
		return orders.length; // 返回普通值
	})
	.then((count) => {
		console.log('订单数量:', count);
	});

// 示例5：错误传播和捕获
console.log('\n=== 示例5：错误传播和捕获 ===');

/**
 * 错误会沿着 Promise 链向下传播
 * 可以在链的任意位置使用 .catch() 捕获错误
 * 一旦被捕获，错误就不会继续传播
 */

function step1() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject(new Error('步骤1失败'));
		}, 100);
	});
}

function step2() {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve('步骤2成功');
		}, 100);
	});
}

step1()
	.then(() => step2())
	.then((result) => {
		console.log('结果:', result);
	})
	.catch((error) => {
		console.error('捕获错误:', error.message);
		// 错误在这里被捕获，不会继续传播
		return '错误已处理';
	})
	.then((result) => {
		console.log('错误处理后的结果:', result);
	});

// 示例6：Promise 链的执行顺序
console.log('\n=== 示例6：Promise 链的执行顺序 ===');

/**
 * Promise 的执行是异步的
 * 多个 Promise 的执行顺序和完成顺序可能不同
 */

console.log('1. 同步代码开始');

const promise5 = new Promise((resolve) => {
	console.log('2. Promise 执行器函数执行');
	resolve('Promise 完成');
});

promise5.then((value) => {
	console.log('4. Promise then 回调执行:', value);
});

console.log('3. 同步代码继续');

// 注意：Promise 的回调是微任务，会在当前同步代码执行完后执行

// ============================================
// 第三部分：Promise 静态方法
// ============================================

// 示例7：Promise.all() - 等待所有完成
console.log('\n=== 示例7：Promise.all() ===');

/**
 * Promise.all() 等待所有 Promise 完成
 * 如果有一个失败，整个 Promise.all() 就会失败
 * 返回结果数组，顺序与输入顺序一致
 */

const promiseA = new Promise((resolve) => {
	setTimeout(() => resolve('A'), 300);
});

const promiseB = new Promise((resolve) => {
	setTimeout(() => resolve('B'), 200);
});

const promiseC = new Promise((resolve) => {
	setTimeout(() => resolve('C'), 100);
});

Promise.all([promiseA, promiseB, promiseC])
	.then((results) => {
		console.log('所有 Promise 都完成:', results); // ['A', 'B', 'C']
	})
	.catch((error) => {
		console.error('有一个失败:', error);
	});

// 如果有一个失败
const promiseD = new Promise((resolve, reject) => {
	setTimeout(() => reject(new Error('D 失败')), 100);
});

Promise.all([promiseA, promiseB, promiseD])
	.then((results) => {
		console.log('结果:', results);
	})
	.catch((error) => {
		console.error('Promise.all 失败:', error.message); // 'D 失败'
	});

// 示例8：Promise.race() - 第一个完成
console.log('\n=== 示例8：Promise.race() ===');

/**
 * Promise.race() 返回第一个完成（成功或失败）的 Promise
 * 其他 Promise 的结果会被忽略
 * 适用于超时控制等场景
 */

const fastPromise = new Promise((resolve) => {
	setTimeout(() => resolve('快速完成'), 100);
});

const slowPromise = new Promise((resolve) => {
	setTimeout(() => resolve('慢速完成'), 500);
});

Promise.race([fastPromise, slowPromise]).then((result) => {
	console.log('第一个完成:', result); // '快速完成'
});

// 超时控制示例
function fetchWithTimeout(url, timeout = 2000) {
	const fetchPromise = new Promise((resolve) => {
		setTimeout(() => resolve(`数据来自 ${url}`), 1500);
	});

	const timeoutPromise = new Promise((_, reject) => {
		setTimeout(() => reject(new Error('请求超时')), timeout);
	});

	return Promise.race([fetchPromise, timeoutPromise]);
}

fetchWithTimeout('/api/data', 1000)
	.then((data) => {
		console.log('获取成功:', data);
	})
	.catch((error) => {
		console.error('错误:', error.message); // '请求超时'
	});

// 示例9：Promise.allSettled() - 等待所有完成（无论成功失败）
console.log('\n=== 示例9：Promise.allSettled() ===');

/**
 * Promise.allSettled() 等待所有 Promise 完成（无论成功或失败）
 * 返回结果数组，包含每个 Promise 的状态和值
 * ES2020 引入
 */

const promiseE = new Promise((resolve) => {
	setTimeout(() => resolve('E 成功'), 100);
});

const promiseF = new Promise((_, reject) => {
	setTimeout(() => reject(new Error('F 失败')), 200);
});

const promiseG = new Promise((resolve) => {
	setTimeout(() => resolve('G 成功'), 300);
});

Promise.allSettled([promiseE, promiseF, promiseG]).then((results) => {
	console.log('所有 Promise 都完成（无论成功失败）:');
	results.forEach((result, index) => {
		if (result.status === 'fulfilled') {
			console.log(`  Promise ${index}: 成功 - ${result.value}`);
		} else {
			console.log(`  Promise ${index}: 失败 - ${result.reason.message}`);
		}
	});
});

// 示例10：Promise.any() - 第一个成功
console.log('\n=== 示例10：Promise.any() ===');

/**
 * Promise.any() 返回第一个成功的 Promise
 * 如果全部失败，返回 AggregateError
 * ES2021 引入
 */

const promiseH = new Promise((_, reject) => {
	setTimeout(() => reject(new Error('H 失败')), 100);
});

const promiseI = new Promise((resolve) => {
	setTimeout(() => resolve('I 成功'), 200);
});

const promiseJ = new Promise((resolve) => {
	setTimeout(() => resolve('J 成功'), 300);
});

Promise.any([promiseH, promiseI, promiseJ])
	.then((result) => {
		console.log('第一个成功:', result); // 'I 成功'
	})
	.catch((error) => {
		console.error('全部失败:', error);
	});

// 如果全部失败
const promiseK = new Promise((_, reject) => {
	setTimeout(() => reject(new Error('K 失败')), 100);
});

Promise.any([promiseH, promiseK])
	.then((result) => {
		console.log('成功:', result);
	})
	.catch((error) => {
		console.error('全部失败:', error.name); // 'AggregateError'
	});

// 示例11：Promise.resolve() 和 Promise.reject()
console.log('\n=== 示例11：Promise.resolve() 和 Promise.reject() ===');

/**
 * Promise.resolve() 快速创建已解决的 Promise
 * Promise.reject() 快速创建已拒绝的 Promise
 * 用于将值转换为 Promise
 */

// Promise.resolve() 创建已解决的 Promise
const resolvedPromise = Promise.resolve('立即解决');
resolvedPromise.then((value) => {
	console.log('已解决的 Promise:', value);
});

// 如果传入的值是 Promise，则直接返回
const existingPromise = new Promise((resolve) => resolve('现有 Promise'));
Promise.resolve(existingPromise).then((value) => {
	console.log('现有 Promise:', value);
});

// Promise.reject() 创建已拒绝的 Promise
const rejectedPromise = Promise.reject(new Error('立即拒绝'));
rejectedPromise.catch((error) => {
	console.error('已拒绝的 Promise:', error.message);
});

// 将值转换为 Promise 的辅助函数
function toPromise(value) {
	if (value instanceof Promise) {
		return value;
	}
	return Promise.resolve(value);
}

toPromise('普通值').then((value) => {
	console.log('转换为 Promise:', value);
});

// ============================================
// 第四部分：Promise 与 async/await
// ============================================

// 示例12：async/await 基础
console.log('\n=== 示例12：async/await 基础 ===');

/**
 * async/await 语法：
 * - async 函数返回一个 Promise
 * - await 用于等待 Promise 完成
 * - 使异步代码看起来像同步代码
 */

async function fetchUserData() {
	const user = await fetchUser();
	console.log('async/await 获取用户:', user);

	const orders = await fetchOrders(user.id);
	console.log('async/await 获取订单:', orders);

	return { user, orders };
}

fetchUserData().then((data) => {
	console.log('async 函数返回:', data);
});

// 示例13：async/await 错误处理
console.log('\n=== 示例13：async/await 错误处理 ===');

/**
 * async/await 使用 try/catch 处理错误
 * 比 Promise 的 .catch() 更直观
 */

async function fetchDataWithError() {
	try {
		const user = await fetchUser();
		console.log('用户:', user);

		// 模拟错误
		const errorPromise = new Promise((_, reject) => {
			setTimeout(() => reject(new Error('获取订单失败')), 100);
		});

		const orders = await errorPromise;
		console.log('订单:', orders);
	} catch (error) {
		console.error('捕获错误:', error.message);
	} finally {
		console.log('无论成功失败都执行');
	}
}

fetchDataWithError();

// 示例14：Promise 与 async/await 混合使用
console.log('\n=== 示例14：Promise 与 async/await 混合使用 ===');

/**
 * Promise 和 async/await 可以混合使用
 * 根据场景选择最合适的方式
 */

async function mixedUsage() {
	// 使用 Promise.all() 并发执行
	const [user, orders] = await Promise.all([fetchUser(), fetchOrders(1)]);

	console.log('并发获取:', { user, orders });

	// 使用 Promise.race() 实现超时
	const data = await Promise.race([
		fetchUser(),
		new Promise((_, reject) => {
			setTimeout(() => reject(new Error('超时')), 50);
		}),
	]).catch((error) => {
		console.error('超时错误:', error.message);
		return null;
	});

	return data;
}

mixedUsage();

// ============================================
// 第五部分：实际应用场景
// ============================================

// 示例15：异步请求处理
console.log('\n=== 示例15：异步请求处理 ===');

/**
 * 使用 Promise 处理 HTTP 请求
 * 处理多个异步请求
 * 错误处理和重试机制
 */

function mockHttpRequest(url, delay = 100) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (Math.random() > 0.2) {
				// 80% 成功率
				resolve(`数据来自 ${url}`);
			} else {
				reject(new Error(`请求 ${url} 失败`));
			}
		}, delay);
	});
}

// 处理多个请求
async function fetchMultipleUrls() {
	const urls = ['/api/user', '/api/orders', '/api/products'];

	try {
		const results = await Promise.all(urls.map((url) => mockHttpRequest(url)));
		console.log('所有请求成功:', results);
	} catch (error) {
		console.error('有请求失败:', error.message);
	}
}

fetchMultipleUrls();

// 带重试的请求
async function fetchWithRetry(url, maxRetries = 3) {
	for (let i = 0; i < maxRetries; i++) {
		try {
			return await mockHttpRequest(url);
		} catch (error) {
			if (i === maxRetries - 1) {
				throw error;
			}
			console.log(`第 ${i + 1} 次重试...`);
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
	}
}

fetchWithRetry('/api/data', 3)
	.then((data) => {
		console.log('重试后成功:', data);
	})
	.catch((error) => {
		console.error('重试后仍失败:', error.message);
	});

// 示例16：并发控制
console.log('\n=== 示例16：并发控制 ===');

/**
 * 限制并发数量
 * 实现请求队列
 * 批量处理数据
 */

class ConcurrencyController {
	constructor(maxConcurrency) {
		this.maxConcurrency = maxConcurrency;
		this.running = 0;
		this.queue = [];
	}

	async add(task) {
		return new Promise((resolve, reject) => {
			this.queue.push({ task, resolve, reject });
			this.run();
		});
	}

	async run() {
		if (this.running >= this.maxConcurrency || this.queue.length === 0) {
			return;
		}

		this.running++;
		const { task, resolve, reject } = this.queue.shift();

		try {
			const result = await task();
			resolve(result);
		} catch (error) {
			reject(error);
		} finally {
			this.running--;
			this.run();
		}
	}
}

// 使用并发控制器
const controller = new ConcurrencyController(2); // 最多2个并发

const tasks = Array.from({ length: 5 }, (_, i) => () => {
	return mockHttpRequest(`/api/task${i}`, 200);
});

Promise.all(tasks.map((task) => controller.add(task))).then((results) => {
	console.log('并发控制完成:', results.length, '个任务');
});

// 示例17：超时控制
console.log('\n=== 示例17：超时控制 ===');

/**
 * 使用 Promise.race() 实现超时
 * 取消长时间运行的请求
 */

function withTimeout(promise, timeout) {
	return Promise.race([
		promise,
		new Promise((_, reject) => {
			setTimeout(() => {
				reject(new Error(`操作超时（${timeout}ms）`));
			}, timeout);
		}),
	]);
}

// 使用超时控制
const longRunningTask = new Promise((resolve) => {
	setTimeout(() => resolve('任务完成'), 2000);
});

withTimeout(longRunningTask, 1000)
	.then((result) => {
		console.log('任务成功:', result);
	})
	.catch((error) => {
		console.error('任务失败:', error.message); // '操作超时（1000ms）'
	});

// 示例18：顺序执行
console.log('\n=== 示例18：顺序执行 ===');

/**
 * 按顺序执行多个异步操作
 * 使用 reduce 实现顺序执行
 */

const tasks2 = [
	() => mockHttpRequest('/api/step1', 100),
	() => mockHttpRequest('/api/step2', 100),
	() => mockHttpRequest('/api/step3', 100),
];

// 方式1：使用 async/await
async function executeSequentially1() {
	const results = [];
	for (const task of tasks2) {
		const result = await task();
		results.push(result);
	}
	return results;
}

executeSequentially1().then((results) => {
	console.log('顺序执行结果:', results);
});

// 方式2：使用 reduce
function executeSequentially2(tasks) {
	return tasks.reduce(async (previousPromise, currentTask) => {
		await previousPromise;
		return currentTask();
	}, Promise.resolve());
}

executeSequentially2(tasks2).then(() => {
	console.log('顺序执行完成');
});

// ============================================
// 总结
// ============================================

console.log('\n=== 总结 ===');
console.log(`
1. Promise 基础：
   - Promise 有三种状态：pending, fulfilled, rejected
   - 使用 new Promise() 创建
   - 使用 .then(), .catch(), .finally() 处理结果

2. Promise 链式调用：
   - .then() 返回新的 Promise
   - 错误会沿着链向下传播
   - 可以在任意位置捕获错误

3. Promise 静态方法：
   - Promise.all(): 等待所有完成
   - Promise.race(): 第一个完成
   - Promise.allSettled(): 等待所有完成（无论成功失败）
   - Promise.any(): 第一个成功
   - Promise.resolve() / Promise.reject(): 快速创建

4. async/await：
   - async 函数返回 Promise
   - await 等待 Promise 完成
   - 使用 try/catch 处理错误
   - 是 Promise 的语法糖

5. 实际应用：
   - 异步请求处理
   - 并发控制
   - 超时控制
   - 顺序执行
`);
