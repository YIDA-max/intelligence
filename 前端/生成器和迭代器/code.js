/* eslint-disable no-console */
/*
 * 生成器（Generator）和迭代器（Iterator）的概念与示例
 *
 * 本文件包含：
 * 1. 迭代器的概念和实现
 * 2. 生成器的概念和实现
 * 3. 两者的关系和区别
 * 4. 实际应用场景
 */

// ============================================
// 第一部分：迭代器（Iterator）
// ============================================
// 数据类型 number string boolean null undefined symbol BigInt object
// 那么为什么会有数组这种东西呢？ 他的本质是什么
/**
 * 什么是迭代器？
 *
 * 迭代器是一个协议（Protocol），定义了如何遍历数据集合。
 * 任何实现了迭代器协议的对象都可以被迭代。
 *
 * 迭代器协议要求对象必须有一个 next() 方法，该方法返回：
 * { value: any, done: boolean }
 * - value: 当前迭代的值
 * - done: 是否迭代完成
 */

// 示例1：手动实现一个简单的迭代器
console.log('=== 示例1：手动实现迭代器 ===');

const simpleIterator = {
	data: [1, 2, 3],
	index: 0,

	// 实现迭代器协议：必须有 next() 方法
	next() {
		if (this.index < this.data.length) {
			return {
				value: this.data[this.index++],
				done: false,
			};
		}
		return { done: true };
	},
};

// 使用迭代器
let result = simpleIterator.next();
while (!result.done) {
	console.log('迭代值:', result.value);
	result = simpleIterator.next();
}

// 示例2：使用 Symbol.iterator 创建可迭代对象
console.log('\n=== 示例2：可迭代对象 ===');

/**
 * 可迭代对象（Iterable）：
 * 实现了 Symbol.iterator 方法的对象，该方法返回一个迭代器。
 * 可迭代对象可以使用 for...of 循环、扩展运算符等。
 */

const myIterable = {
	items: ['a', 'b', 'c'],

	// 实现 Symbol.iterator，使其成为可迭代对象
	[Symbol.iterator]() {
		let index = 0;
		const items = this.items;

		// 返回一个迭代器对象
		return {
			next() {
				if (index < items.length) {
					return {
						value: items[index++],
						done: false,
					};
				}
				return { done: true };
			},
		};
	},
};

// 现在可以使用 for...of 遍历
console.log('使用 for...of 遍历:');
for (const item of myIterable) {
	console.log(item);
}

// 也可以使用扩展运算符
console.log('使用扩展运算符:', [...myIterable]);

// 示例3：内置的可迭代对象
console.log('\n=== 示例3：内置可迭代对象 ===');

// 数组是可迭代的
const arr = [10, 20, 30];
console.log('数组迭代:');
for (const num of arr) {
	console.log(num);
}

// 字符串也是可迭代的
const str = 'Hello';
console.log('字符串迭代:');
for (const char of str) {
	console.log(char);
}

// Map 和 Set 也是可迭代的
const map = new Map([
	['a', 1],
	['b', 2],
]);
console.log('Map 迭代:');
for (const [key, value] of map) {
	console.log(`${key}: ${value}`);
}

// ============================================
// 第二部分：生成器（Generator）
// ============================================

/**
 * 什么是生成器？
 *
 * 生成器是一个特殊的函数，使用 function* 声明。
 * 生成器函数返回一个生成器对象，该对象实现了迭代器协议。
 *
 * 生成器的特点：
 * 1. 可以使用 yield 关键字暂停执行
 * 2. 每次调用 next() 会从上次暂停的地方继续执行
 * 3. 可以暂停和恢复，用于异步控制
 */

// 示例4：基础生成器函数
console.log('\n=== 示例4：基础生成器 ===');

function* simpleGenerator() {
	console.log('开始执行');
	yield 1; // 暂停点1，返回 1
	console.log('继续执行');
	yield 2; // 暂停点2，返回 2
	console.log('即将结束');
	yield 3; // 暂停点3，返回 3
	console.log('执行完成');
	return 4; // 返回值
}

const gen = simpleGenerator();

console.log('第一次调用 next():', gen.next());
// 输出: { value: 1, done: false }
// 控制台: "开始执行"

console.log('第二次调用 next():', gen.next());
// 输出: { value: 2, done: false }
// 控制台: "继续执行"

console.log('第三次调用 next():', gen.next());
// 输出: { value: 3, done: false }
// 控制台: "即将结束"

console.log('第四次调用 next():', gen.next());
// 输出: { value: 4, done: true }
// 控制台: "执行完成"

// 示例5：生成器传递值
console.log('\n=== 示例5：生成器传递值 ===');

/**
 * yield 是双向的：
 * - 右侧的值会作为 next() 的返回值
 * - 左侧可以接收 next(value) 传入的值
 */

function* valuePassingGenerator() {
	const a = yield '第一个值'; // yield 右侧的值会返回
	console.log('接收到 a =', a);

	const b = yield '第二个值';
	console.log('接收到 b =', b);

	return `最终结果: ${a} + ${b}`;
}

const gen2 = valuePassingGenerator();

console.log('next():', gen2.next()); // { value: '第一个值', done: false }
console.log('next(10):', gen2.next(10)); // { value: '第二个值', done: false }，a = 10
console.log('next(20):', gen2.next(20)); // { value: '最终结果: 10 + 20', done: true }，b = 20

// 示例6：生成器作为迭代器使用
console.log('\n=== 示例6：生成器作为迭代器 ===');

/**
 * 生成器返回的对象实现了迭代器协议，可以直接用于迭代
 */

function* numberGenerator() {
	yield 1;
	yield 2;
	yield 3;
}

// 可以直接用 for...of 遍历
console.log('使用 for...of 遍历生成器:');
for (const num of numberGenerator()) {
	console.log(num);
}

// 也可以手动调用 next()
const gen3 = numberGenerator();
console.log('手动调用 next():', gen3.next());
console.log('手动调用 next():', gen3.next());
console.log('手动调用 next():', gen3.next());
console.log('手动调用 next():', gen3.next());

// ============================================
// 第三部分：两者的关系和区别
// ============================================

console.log('\n=== 第三部分：关系和区别 ===');

/**
 * 关系：
 * 1. 生成器是创建迭代器的工具
 * 2. 生成器返回的对象实现了迭代器协议
 * 3. 生成器是迭代器的一种实现方式
 *
 * 区别：
 * 1. 迭代器是协议/接口，生成器是具体实现
 * 2. 手动实现迭代器需要管理状态，生成器自动管理
 * 3. 生成器可以暂停/恢复，普通迭代器只能顺序执行
 */

// 对比示例：实现相同的功能

// 方式1：手动实现迭代器（同时也是可迭代对象）
const manualIterator = {
	data: [1, 2, 3],
	index: 0,
	next() {
		if (this.index < this.data.length) {
			return { value: this.data[this.index++], done: false };
		}
		return { done: true };
	},
	// 实现 Symbol.iterator，使其成为可迭代对象
	[Symbol.iterator]() {
		// 返回一个新的迭代器对象，避免状态冲突
		let index = 0;
		const data = this.data;
		return {
			next() {
				if (index < data.length) {
					return { value: data[index++], done: false };
				}
				return { done: true };
			},
		};
	},
};

// 方式2：使用生成器
function* generatorIterator() {
	yield 1;
	yield 2;
	yield 3;
}

console.log('手动迭代器:', [...manualIterator]);
console.log('生成器迭代器:', [...generatorIterator()]);

// ============================================
// 第四部分：实际应用场景
// ============================================

// 示例7：无限序列生成
console.log('\n=== 示例7：无限序列生成 ===');

/**
 * 生成器非常适合生成无限序列，因为它是惰性求值的
 * 只有在需要时才计算下一个值
 */

function* fibonacci() {
	let [prev, curr] = [0, 1];
	while (true) {
		yield curr;
		[prev, curr] = [curr, prev + curr];
	}
}

const fib = fibonacci();
console.log('斐波那契数列前10项:');
for (let i = 0; i < 10; i++) {
	console.log(fib.next().value);
}

// 示例8：异步控制（配合 Promise）
console.log('\n=== 示例8：异步控制 ===');

/**
 * 生成器可以用于异步流程控制
 * 这是 async/await 出现之前的方案
 */

function fetchData(url) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(`数据来自 ${url}`);
		}, 100);
	});
}

function* asyncGenerator() {
	const data1 = yield fetchData('/api/user');
	console.log('获取到:', data1);
	console.log('ps:如果能知道为什么这句话是在后面执行的');

	const data2 = yield fetchData('/api/orders');
	console.log('获取到:', data2);
	console.log('ps:并且能搞清楚顺序和他是怎么实现的');
	return [data1, data2];
}

// 执行器函数（类似 async/await 的底层实现）
async function runGenerator(gen) {
	const iterator = gen();
	let result = iterator.next();

	while (!result.done) {
		if (result.value instanceof Promise) {
			const value = await result.value;
			result = iterator.next(value);
		} else {
			result = iterator.next(result.value);
		}
	}

	return result.value;
}

// 使用
runGenerator(asyncGenerator).then((result) => {
	console.log('最终结果:', result);
	console.log(
		'ps:那么恭喜你,已经基本掌握了所谓的异步和同步和async/await语法糖了'
	);
});

// 示例9：数据流处理
console.log('\n=== 示例9：数据流处理 ===');

/**
 * 生成器可以用于处理数据流，实现管道式处理
 */

function* dataSource() {
	for (let i = 1; i <= 5; i++) {
		yield i;
	}
}

function* mapGenerator(iterable, fn) {
	for (const item of iterable) {
		yield fn(item);
	}
}

function* filterGenerator(iterable, fn) {
	for (const item of iterable) {
		if (fn(item)) {
			yield item;
		}
	}
}

// 组合使用：数据源 -> 映射 -> 过滤
const source = dataSource();
const mapped = mapGenerator(source, (x) => x * 2); // 每个数乘以2
const filtered = filterGenerator(mapped, (x) => x > 5); // 过滤大于5的数

console.log('数据流处理结果:');
for (const value of filtered) {
	console.log(value);
}

// 示例10：生成器委托（yield*）
console.log('\n=== 示例10：生成器委托 ===');

/**
 * yield* 可以委托给另一个生成器或可迭代对象
 */

function* generator1() {
	yield 1;
	yield 2;
}

function* generator2() {
	yield* generator1(); // 委托给 generator1
	yield 3;
	yield 4;
}

console.log('生成器委托结果:');
for (const value of generator2()) {
	console.log(value); // 输出: 1, 2, 3, 4
}

// ============================================
// 第五部分：生成器函数的内部实现原理
// ============================================

console.log('\n=== 示例11：手动实现生成器（状态机方式） ===');

/**
 * 生成器函数本质上是一个状态机
 * 每次调用 next() 时，函数会从上次暂停的地方继续执行
 * 我们可以手动实现一个类似生成器的状态机
 */

// 手动实现一个类似生成器的状态机
function createManualGenerator() {
	// 状态：0=初始, 1=第一个yield后, 2=第二个yield后, 3=完成
	let state = 0;
	let value1, value2;

	return {
		next(input) {
			switch (state) {
				case 0:
					// 相当于 function* gen() { const a = yield 1; ... }
					console.log('状态0: 开始执行，yield 1');
					state = 1;
					return { value: 1, done: false };

				case 1:
					// 接收 next() 传入的值，赋值给 a
					value1 = input;
					console.log(`状态1: 接收到输入值 ${value1}，yield 2`);
					state = 2;
					return { value: 2, done: false };

				case 2:
					// 接收 next() 传入的值，赋值给 b
					value2 = input;
					console.log(`状态2: 接收到输入值 ${value2}，返回结果`);
					state = 3;
					return {
						value: `结果: ${value1} + ${value2} = ${value1 + value2}`,
						done: true,
					};

				default:
					return { done: true };
			}
		},
		[Symbol.iterator]() {
			return this;
		},
	};
}

console.log('手动实现的生成器:');
const manualGen = createManualGenerator();
console.log('next():', manualGen.next()); // { value: 1, done: false }
console.log('next(10):', manualGen.next(10)); // { value: 2, done: false }
console.log('next(20):', manualGen.next(20)); // { value: '结果: 10 + 20 = 30', done: true }

// 对比：使用真正的生成器
function* realGenerator() {
	const a = yield 1;
	console.log(`接收到 a = ${a}`);
	const b = yield 2;
	console.log(`接收到 b = ${b}`);
	return `结果: ${a} + ${b} = ${a + b}`;
}

console.log('\n真正的生成器:');
const realGen = realGenerator();
console.log('next():', realGen.next());
console.log('next(10):', realGen.next(10));
console.log('next(20):', realGen.next(20));

// 示例12：生成器对象的内部结构
console.log('\n=== 示例12：生成器对象的内部结构 ===');

function* inspectGenerator() {
	yield 'first';
	yield 'second';
	return 'done';
}

const inspectGen = inspectGenerator();

console.log('生成器对象类型:', inspectGen.constructor.name); // Generator
console.log('生成器对象:', inspectGen);
console.log('是否有 next 方法:', typeof inspectGen.next === 'function');
console.log('是否有 return 方法:', typeof inspectGen.return === 'function');
console.log('是否有 throw 方法:', typeof inspectGen.throw === 'function');
console.log(
	'是否实现了 Symbol.iterator:',
	typeof inspectGen[Symbol.iterator] === 'function'
);

// 查看生成器对象的所有属性
console.log('\n生成器对象的属性:');
console.log(
	'Object.getOwnPropertyNames:',
	Object.getOwnPropertyNames(inspectGen)
);
console.log(
	'Object.getOwnPropertySymbols:',
	Object.getOwnPropertySymbols(inspectGen)
);

// 示例13：模拟 yield 的暂停和恢复机制
console.log('\n=== 示例13：模拟 yield 的暂停和恢复 ===');

/**
 * yield 的工作原理：
 * 1. 遇到 yield 时，函数暂停执行
 * 2. 返回 yield 右侧的值
 * 3. 下次调用 next() 时，从 yield 处继续执行
 * 4. next(value) 传入的值会成为 yield 表达式的值
 */

// 使用闭包和状态机模拟 yield
function createYieldSimulator() {
	let pausedAt = null; // 暂停位置
	let resumeValue = null; // 恢复时传入的值
	let isDone = false;

	// 模拟的生成器函数体
	const generatorBody = {
		step1() {
			console.log('执行步骤1: 准备 yield 第一个值');
			pausedAt = 'step2';
			return { value: 'value1', done: false };
		},
		step2() {
			console.log(`执行步骤2: 从 yield 恢复，接收到 ${resumeValue}`);
			console.log('执行步骤2: 准备 yield 第二个值');
			pausedAt = 'step3';
			return { value: 'value2', done: false };
		},
		step3() {
			console.log(`执行步骤3: 从 yield 恢复，接收到 ${resumeValue}`);
			console.log('执行步骤3: 完成');
			isDone = true;
			return { value: `最终结果: ${resumeValue}`, done: true };
		},
	};

	return {
		next(input) {
			if (isDone) {
				return { done: true };
			}

			resumeValue = input; // 保存传入的值

			if (!pausedAt) {
				// 第一次调用
				return generatorBody.step1();
			} else {
				// 从暂停处恢复
				return generatorBody[pausedAt]();
			}
		},
		[Symbol.iterator]() {
			return this;
		},
	};
}

console.log('模拟 yield 机制:');
const sim = createYieldSimulator();
console.log('next():', sim.next());
console.log('next("input1"):', sim.next('input1'));
console.log('next("input2"):', sim.next('input2'));
console.log('next():', sim.next());

// 示例14：生成器的状态转换
console.log('\n=== 示例14：生成器的状态转换 ===');

/**
 * 生成器有三种状态：
 * 1. suspended (挂起) - 未开始执行或已暂停
 * 2. executing (执行中) - 正在执行
 * 3. closed (已关闭) - 执行完成或已关闭
 */

function* stateGenerator() {
	console.log('生成器开始执行');
	yield 'state1';
	console.log('从 state1 恢复');
	yield 'state2';
	console.log('从 state2 恢复');
	return 'completed';
}

const stateGen = stateGenerator();

console.log('初始状态 - 生成器已创建但未执行');

console.log('\n第一次 next():');
const result1 = stateGen.next();
console.log('结果:', result1);
console.log('状态: suspended (在 yield 处暂停)');

console.log('\n第二次 next():');
const result2 = stateGen.next();
console.log('结果:', result2);
console.log('状态: suspended (在 yield 处暂停)');

console.log('\n第三次 next():');
const result3 = stateGen.next();
console.log('结果:', result3);
console.log('状态: closed (执行完成)');

console.log('\n第四次 next() (已完成):');
const result4 = stateGen.next();
console.log('结果:', result4);
console.log('状态: closed (已关闭，返回 { done: true })');

// 示例15：生成器的 return 和 throw 方法
console.log('\n=== 示例15：生成器的 return 和 throw 方法 ===');

function* returnThrowGenerator() {
	try {
		yield 1;
		yield 2;
		yield 3;
	} catch (error) {
		console.log('捕获到错误:', error);
		yield 'error handled';
	}
	return 'normal end';
}

const rtGen = returnThrowGenerator();

console.log('正常执行:');
console.log('next():', rtGen.next()); // { value: 1, done: false }
console.log('next():', rtGen.next()); // { value: 2, done: false }

console.log('\n使用 return() 提前终止:');
console.log('return("early"):', rtGen.return('early')); // { value: 'early', done: true }
console.log('再次 next():', rtGen.next()); // { value: undefined, done: true }

// 重新创建生成器测试 throw
const rtGen2 = returnThrowGenerator();
console.log('\n使用 throw() 抛出错误:');
console.log('next():', rtGen2.next()); // { value: 1, done: false }
console.log('throw("error"):', rtGen2.throw('error')); // { value: 'error handled', done: false }
console.log('next():', rtGen2.next()); // { value: undefined, done: true }

// 示例16：生成器的嵌套和委托实现
console.log('\n=== 示例16：生成器的嵌套和委托实现原理 ===');

/**
 * yield* 的实现原理：
 * 它会遍历被委托的迭代器，逐个 yield 其值
 */

// 手动实现 yield* 的行为
function* manualYieldStar(iterable) {
	const iterator = iterable[Symbol.iterator]();
	let result = iterator.next();

	while (!result.done) {
		yield result.value; // 逐个 yield 值
		result = iterator.next();
	}

	return result.value; // 返回最终值
}

function* sourceGen() {
	yield 'a';
	yield 'b';
	return 'source done';
}

function* wrapperGen() {
	yield 1;
	// 使用手动实现的 yield* 函数
	yield* manualYieldStar(sourceGen());
	yield 2;
}

console.log('手动实现 yield*:');
for (const value of wrapperGen()) {
	console.log(value); // 1, 'a', 'b', 2
}

// 对比：使用真正的 yield*
function* realYieldStar() {
	yield 1;
	yield* sourceGen(); // 真正的 yield*
	yield 2;
}

console.log('\n使用真正的 yield*:');
for (const value of realYieldStar()) {
	console.log(value); // 1, 'a', 'b', 2
}

// 示例17：生成器的内存管理
console.log('\n=== 示例17：生成器的内存管理 ===');

/**
 * 生成器是惰性的，只有在需要时才计算值
 * 这可以节省内存，特别是对于大序列
 */

function* largeSequence() {
	console.log('生成器函数被调用，但还未执行');
	for (let i = 0; i < 1000000; i++) {
		yield i;
	}
	console.log('生成器执行完成');
}

const largeGen = largeSequence();
console.log('生成器已创建，但内存中还没有 1000000 个数字');

console.log('只获取前 3 个值:');
for (let i = 0; i < 3; i++) {
	console.log(largeGen.next().value);
}

console.log('只计算了需要的值，没有创建完整的数组');

// 对比：如果使用数组
console.log('\n对比：使用数组（会立即创建所有值）');
const largeArray = Array.from({ length: 1000000 }, (_, i) => i);
console.log('数组已创建，内存中已有 1000000 个数字');
console.log('前 3 个值:', largeArray.slice(0, 3));

// ============================================
// 总结
// ============================================

console.log('\n=== 总结 ===');
console.log(`
1. 迭代器（Iterator）：
   - 是一个协议，定义了 next() 方法
   - 返回 { value, done } 对象
   - 用于遍历数据集合

2. 生成器（Generator）：
   - 使用 function* 声明的特殊函数
   - 使用 yield 暂停执行
   - 返回的对象实现了迭代器协议
   - 可以暂停/恢复，用于异步控制

3. 关系：
   - 生成器是创建迭代器的工具
   - 生成器返回的对象也是迭代器
   - async/await 底层基于生成器机制

4. 应用：
   - 无限序列生成
   - 异步流程控制
   - 数据流处理
   - 惰性求值
`);
