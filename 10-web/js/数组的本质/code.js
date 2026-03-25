/* eslint-disable no-console */
/*
 * 数组的本质：用对象手写一个数组
 *
 * 本文件包含：
 * 1. 数组的本质是什么
 * 2. 用对象手写实现数组
 * 3. 官方数组实现 vs 手写数组实现的区别
 */
console.log(
	'js的数据类型有 number string boolean null undefined symbol BigInt object'
);
console.log('那么为什么会有数组这种东西呢？ 他的本质是什么');

// ============================================
// 数组的本质：用对象手写一个数组
// ============================================
console.log('\n=== 数组的本质：用对象手写数组 ===');

/**
 * 数组的本质是什么？
 *
 * 1. 数组是对象（typeof array === 'object'）
 * 2. 数组使用数字索引作为键名（0, 1, 2...）
 * 3. 数组有 length 属性，自动维护长度
 * 4. 数组实现了可迭代协议（Symbol.iterator）
 * 5. 数组有特殊的原型方法（Array.prototype）
 *
 * 下面我们用普通对象来手写实现一个数组：
 */

// 手写数组构造函数
function MyArray(...args) {
	// 使用对象存储数据，数字索引作为键
	for (let i = 0; i < args.length; i++) {
		this[i] = args[i];
	}

	// length 属性：使用 getter/setter 自动维护
	Object.defineProperty(this, 'length', {
		get() {
			// 计算最大的数字索引 + 1
			let maxIndex = -1;
			for (const key in this) {
				const numKey = Number(key);
				if (!isNaN(numKey) && numKey >= 0 && numKey % 1 === 0) {
					maxIndex = Math.max(maxIndex, numKey);
				}
			}
			return maxIndex + 1;
		},
		set(newLength) {
			const currentLength = this.length;
			if (newLength < currentLength) {
				// 如果新长度小于当前长度，删除多余的索引
				for (let i = newLength; i < currentLength; i++) {
					delete this[i];
				}
			} else if (newLength > currentLength) {
				// 如果新长度大于当前长度，填充 undefined
				for (let i = currentLength; i < newLength; i++) {
					this[i] = undefined;
				}
			}
		},
		enumerable: false, // length 不可枚举
		configurable: true,
	});
}

// 实现 Symbol.iterator，使其成为可迭代对象
MyArray.prototype[Symbol.iterator] = function () {
	let index = 0;
	const self = this;

	return {
		next() {
			if (index < self.length) {
				return {
					value: self[index++],
					done: false,
				};
			}
			return { done: true };
		},
	};
};

// 实现 push 方法：添加元素到末尾
MyArray.prototype.push = function (...items) {
	for (let i = 0; i < items.length; i++) {
		this[this.length] = items[i];
	}
	return this.length;
};

// 实现 pop 方法：移除并返回最后一个元素
MyArray.prototype.pop = function () {
	if (this.length === 0) {
		return undefined;
	}
	const lastIndex = this.length - 1;
	const lastItem = this[lastIndex];
	delete this[lastIndex];
	return lastItem;
};

// 实现 forEach 方法：遍历数组
MyArray.prototype.forEach = function (callback, thisArg) {
	for (let i = 0; i < this.length; i++) {
		if (i in this) {
			callback.call(thisArg, this[i], i, this);
		}
	}
};

// 实现 map 方法：映射数组
MyArray.prototype.map = function (callback, thisArg) {
	const result = new MyArray();
	for (let i = 0; i < this.length; i++) {
		if (i in this) {
			result[i] = callback.call(thisArg, this[i], i, this);
		}
	}
	return result;
};

// 实现 toString 方法：转换为字符串
MyArray.prototype.toString = function () {
	if (this.length === 0) {
		return '';
	}
	const result = [];
	for (let i = 0; i < this.length; i++) {
		result.push(this[i] == null ? '' : String(this[i]));
	}
	return result.join(',');
};

// 测试手写的数组
console.log('\n--- 测试1：创建和基本访问 ---');
const myArr = new MyArray(1, 2, 3);
console.log('myArr:', myArr);
console.log('myArr[0]:', myArr[0]); // 1
console.log('myArr[1]:', myArr[1]); // 2
console.log('myArr.length:', myArr.length); // 3
console.log('typeof myArr:', typeof myArr); // "object"

console.log('\n--- 测试2：可迭代协议 ---');
console.log('Symbol.iterator in myArr:', Symbol.iterator in myArr); // true
console.log('使用 for...of 遍历:');
for (const item of myArr) {
	console.log('  ', item);
}
console.log('使用扩展运算符:', [...myArr]); // [1, 2, 3]

console.log('\n--- 测试3：push 和 pop 方法 ---');
myArr.push(4, 5);
console.log('push(4, 5) 后:', [...myArr]); // [1, 2, 3, 4, 5]
console.log('length:', myArr.length); // 5
const popped = myArr.pop();
console.log('pop() 返回:', popped); // 5
console.log('pop() 后:', [...myArr]); // [1, 2, 3, 4]
console.log('length:', myArr.length); // 4

console.log('\n--- 测试4：forEach 方法 ---');
myArr.forEach((item, index) => {
	console.log(`  [${index}]: ${item}`);
});

console.log('\n--- 测试5：map 方法 ---');
const doubled = myArr.map((item) => item * 2);
console.log('原数组:', [...myArr]); // [1, 2, 3, 4]
console.log('map(x => x * 2):', [...doubled]); // [2, 4, 6, 8]

console.log('\n--- 测试6：toString 方法 ---');
console.log('toString():', myArr.toString()); // "1,2,3,4"

console.log('\n--- 测试7：length 属性自动维护 ---');
myArr[10] = 'test';
console.log('设置 myArr[10] = "test"');
console.log('length:', myArr.length); // 11（自动更新）
console.log('数组内容:', [...myArr]); // [1, 2, 3, 4, undefined, undefined, undefined, undefined, undefined, undefined, "test"]

myArr.length = 3;
console.log('设置 length = 3');
console.log('length:', myArr.length); // 3
console.log('数组内容:', [...myArr]); // [1, 2, 3]（后面的元素被删除）

console.log('\n--- 总结：数组的本质 ---');
console.log(`
数组的本质：
1. 数组是对象（typeof === 'object'）
2. 使用数字索引作为键名（0, 1, 2...）
3. 有 length 属性，自动维护长度
4. 实现了 Symbol.iterator，是可迭代对象
5. 有特殊的原型方法（push, pop, map 等）

我们手写的 MyArray 虽然功能简单，但已经展示了数组的核心特征！
`);

// ============================================
// 官方数组实现 vs 手写数组实现的区别
// ============================================
console.log('\n=== 官方数组实现 vs 手写数组实现的区别 ===');

/**
 * 为什么官方实现的数组和我们手写的不一样？
 *
 * 1. 性能优化层面
 * 2. 功能完整性
 * 3. 引擎集成深度
 * 4. 内存管理
 * 5. 类型优化
 */

// 对比1：性能差异
console.log('\n--- 对比1：性能差异 ---');
const officialArr = [1, 2, 3, 4, 5];
const myArr2 = new MyArray(1, 2, 3, 4, 5);

// 官方数组：引擎级别的优化
console.log('官方数组的特点：');
console.log('  - 使用连续内存存储（大多数情况下）');
console.log('  - 引擎可以进行类型推断和优化（如 SMI - Small Integer）');
console.log('  - 访问速度接近 C/C++ 数组');
console.log('  - 使用 JIT 编译优化');

// 手写数组：JavaScript 对象
console.log('\n手写数组的特点：');
console.log('  - 使用普通对象存储，键值对查找');
console.log('  - 每次访问都需要哈希查找');
console.log('  - 没有类型优化');
console.log('  - 性能相对较慢');

// 性能测试（简单对比）
console.log('\n性能测试（仅供参考）：');

console.time('官方数组 push');
for (let i = 0; i < 1000; i++) {
	officialArr.push(i);
}
console.timeEnd('官方数组 push');

console.time('手写数组 push');
for (let i = 0; i < 1000; i++) {
	myArr2.push(i);
}
console.timeEnd('手写数组 push');

// 对比2：功能完整性
console.log('\n--- 对比2：功能完整性 ---');
console.log('官方数组有 30+ 个方法：');
console.log(
	'  - 修改方法：push, pop, shift, unshift, splice, sort, reverse...'
);
console.log('  - 访问方法：indexOf, lastIndexOf, includes, find, findIndex...');
console.log('  - 迭代方法：forEach, map, filter, reduce, some, every...');
console.log('  - 其他方法：concat, slice, join, flat, flatMap...');
console.log('\n手写数组只实现了基础方法：');
console.log('  - push, pop, forEach, map, toString');

// 对比3：引擎集成深度
console.log('\n--- 对比3：引擎集成深度 ---');
console.log('官方数组：');
console.log('  - 是引擎原生实现（C++/Rust 等）');
console.log('  - 与垃圾回收器深度集成');
console.log('  - 支持数组的特殊优化（如稀疏数组、密集数组）');
console.log('  - 可以直接操作内存');
console.log('\n手写数组：');
console.log('  - 纯 JavaScript 实现');
console.log('  - 依赖 JavaScript 引擎的对象系统');
console.log('  - 无法直接操作内存');
console.log('  - 受 JavaScript 对象限制');

// 对比4：特殊行为
console.log('\n--- 对比4：特殊行为和优化 ---');

// 官方数组的特殊行为
console.log('官方数组的特殊行为：');
const sparseArr = [];
sparseArr[0] = 1;
sparseArr[100] = 2;
console.log('  稀疏数组 length:', sparseArr.length); // 101
console.log('  但实际只有 2 个元素');
console.log('  引擎会优化存储方式（稀疏 vs 密集）');

// 类型优化
const intArr = [1, 2, 3];
const mixedArr = [1, '2', 3.5];
console.log('\n  类型优化：');
console.log('    intArr 可能被优化为整数数组（更快）');
console.log('    intArr:', intArr);
console.log('    mixedArr 需要存储为通用数组（较慢）');
console.log('    mixedArr:', mixedArr);

// 手写数组的限制
console.log('\n手写数组的限制：');
const mySparse = new MyArray();
mySparse[0] = 1;
mySparse[100] = 2;
console.log('  稀疏数组 length:', mySparse.length); // 101
console.log('  但无法享受引擎的优化');

// 对比5：原型链和方法
console.log('\n--- 对比5：原型链和方法 ---');
console.log('官方数组：');
console.log('  Array.prototype 有大量优化过的方法');
console.log('  方法使用原生代码实现，性能极高');
console.log('  支持链式调用：arr.map().filter().reduce()');

console.log('\n手写数组：');
console.log('  MyArray.prototype 只有基础方法');
console.log('  方法使用 JavaScript 实现，性能较低');
console.log('  需要手动实现所有需要的功能');

// 对比6：实际使用场景
console.log('\n--- 对比6：实际使用场景 ---');
console.log('官方数组适用于：');
console.log('  ✓ 所有生产环境');
console.log('  ✓ 需要高性能的场景');
console.log('  ✓ 需要完整功能的场景');
console.log('  ✓ 需要与其他 API 兼容的场景');

console.log('\n手写数组适用于：');
console.log('  ✓ 学习理解数组本质');
console.log('  ✓ 特殊需求的自定义实现');
console.log('  ✓ 教学演示');
console.log('  ✗ 不适用于生产环境（性能问题）');

// 对比7：内部实现细节
console.log('\n--- 对比7：内部实现细节 ---');
console.log('官方数组（引擎内部，简化理解）：');
console.log(`
  class Array {
    // 使用连续内存块（大多数情况）
    data: MemoryBlock;
    
    // 类型标记（整数数组、双精度数组、通用数组）
    type: ArrayType;
    
    // 长度（直接存储，O(1) 访问）
    length: number;
    
    // 原生方法（C++/Rust 实现）
    push() { /* 原生代码 */ }
    pop() { /* 原生代码 */ }
    // ... 30+ 个方法
  }
`);

console.log('手写数组（我们的实现）：');
console.log(`
  function MyArray() {
    // 使用普通对象
    this[0] = value1;
    this[1] = value2;
    
    // length 通过 getter 计算（O(n) 复杂度）
    Object.defineProperty(this, 'length', {
      get() { /* 遍历所有键计算 */ }
    });
    
    // JavaScript 方法
    this.push = function() { /* JS 代码 */ }
  }
`);

// 总结
console.log('\n=== 总结 ===');
console.log(`
为什么官方实现和手写实现不一样？

1. 性能优化
   - 官方：引擎级别优化，接近原生性能
   - 手写：JavaScript 对象，性能较低

2. 功能完整性
   - 官方：30+ 个方法，功能完整
   - 手写：只实现核心功能

3. 引擎集成
   - 官方：与引擎深度集成，原生实现
   - 手写：纯 JavaScript，受语言限制

4. 内存管理
   - 官方：连续内存，类型优化
   - 手写：哈希表，无类型优化

5. 特殊优化
   - 官方：稀疏数组优化、类型推断、JIT 优化
   - 手写：无法享受这些优化

结论：
- 手写数组帮助我们理解数组的本质和原理
- 官方数组是生产环境的最佳选择
- 理解原理有助于更好地使用官方数组
`);
