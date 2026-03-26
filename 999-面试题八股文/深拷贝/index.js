// 手写深拷贝
// 怎么手写深拷贝
// 第一用JSON.parse(JSON.stringify(obj))
/**
 * 准备一个对象
 * 循环传入的值,然后根据key和value给赋值到准备的对象里面
 * 不能处理对象里面包对象的情况
 */
/**
 * 准备一个递归函数
 * 准备一个对象
 * 循环传入的值,然后根据key和value给赋值到准备的对象里面
 * 递归的调用自己,返回,如果是基本的数据类型,就直接返回,如果是对象,或者数组之类的,就递归的调用自己,一直去找,直达全部的基本数据类型为止,然后返回,在这一步可以做很多的边界判断,比如说,我是一个函数我怎么返回,我是一个数组我怎么返回,我是一个对象我怎么返回
 * 不能处理循环引用的情况
 */
/**
 * 准备一个递归函数
 * 准备一个对象
 * 准备一个map,不需要weakMap
 * 每一次递归返回的时候,都把key作为key,value作为value,存到map里面
 * 首先先问一下有没有重复的,如果有,就直接返回map里面的value 同时也可以保证是一样的
 * 如果没有,就继续递归
 * 这样可以解决循环引用
 */
/**
 * 这个是标准答案
 */
/**
 * 手写深拷贝
 * @param {Object} obj 需要深拷贝的对象
 * @returns {Object} 深拷贝后的对象
 */
const deepClone = (obj) => {
  // 1. 判断是否是对象
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  // 2. 判断是否是数组
  if (Array.isArray(obj)) {
    return obj.map(deepClone);
  }
  // 3. 判断是否是函数
  if (typeof obj === "function") {
    return obj;
  }
  // 到这一步基本上就是对象了
  const result = {};
  for (const key in obj) {
    //  这里的就是遍历对象的属性，然后递归调用deepClone
    if (obj.hasOwnProperty(key)) {
      result[key] = deepClone(obj[key]);
    }
  }
  return result;
};

// 例：deepClone
const obj = {
  a: 1,
  b: [1, 2, 3],
  c: { d: 4 },
};
console.log("deepClone:", deepClone(obj));

/**
 * 手写深拷贝 解决循环引用问题
 * @param {Object} obj 需要深拷贝的对象
 * @param {WeakMap} [visited] 原对象 -> 已拷贝结果的映射（递归共用，勿从外部传除非你知道在做什么）
 * @returns {Object} 深拷贝后的对象
 */
const deepClone2 = (obj, visited = new WeakMap()) => {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  if (typeof obj === "function") {
    return obj;
  }
  // 如果map中已经存在该对象，则直接返回 解决循环引用问题
  if (visited.has(obj)) {
    return visited.get(obj);
  }
  // 如果对象是数组，则创建一个空数组，然后递归调用deepClone2
  if (Array.isArray(obj)) {
    const arr = [];
    visited.set(obj, arr);
    for (let i = 0; i < obj.length; i++) {
      arr[i] = deepClone2(obj[i], visited);
    }
    return arr;
  }
  // 如果对象是对象，将对象添加到map中 解决循环引用问题
  // 这个obj其实是 obj的key
  const result = {};
  visited.set(obj, result);
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = deepClone2(obj[key], visited);
    }
  }
  return result;
};

// 例：deepClone2（含循环引用）
const nested = { a: 1, b: [2, { c: 3 }] };
console.log("deepClone2 嵌套:", deepClone2(nested));

const ring = { tag: "ring" };
ring.self = ring;
const ringCopy = deepClone2(ring);
console.log(
  "deepClone2 循环引用, ringCopy.self === ringCopy:",
  ringCopy.self === ringCopy,
);
