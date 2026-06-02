/* eslint-disable no-console */
/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-02-26 16:28:16
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-02-28 14:05:02
 * @FilePath: \qianyi-ui\js\计算工具\Excel复制整列转数组工具\code.js
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
const fs = require('fs');
const path = require('path');

// 积加
const a = [
	'13-14293-82480',
	'26-14274-83611',
	'25-14276-36649',
	'26-14274-77598',
	'21-14280-87876',
	'26-14273-18437',
	'357834421146-10078735303125',
	'12-14293-53589',
	'18-14286-26909',
	'17-14285-56029',
	'20-14281-23204',
	'16-14288-82538',
	'02-14309-00602',
	'18-14285-72868',
	'11-14295-09044',
	'27-14272-22109',
	'16-14287-36247',
	'07-14299-98473',
	'25-14273-90487',
];
// erp
const b = [
	'27-14272-22109',
	'20-14281-23204',
	'11-14295-09044',
	'07-14299-98473',
	'12-14293-53589',
	'16-14288-82538',
	'17-14285-56029',
	'16-14287-36247',
	'18-14285-72868',
	'02-14309-00602',
	'25-14273-90487',
	'18-14286-26909',
];

// 提取数组值，所有值都视为字符串
const extractStrings = (arr) => {
	// 如果数组格式正确，直接使用，将所有值转换为字符串
	if (Array.isArray(arr) && arr.length > 0) {
		const validStrings = arr
			.filter((item) => {
				// 过滤掉 null、undefined 和空值
				return item !== null && item !== undefined && item !== '';
			})
			.map((item) => {
				// 将所有值转换为字符串
				return String(item).trim();
			})
			.filter((item) => item !== ''); // 再次过滤空字符串

		if (validStrings.length > 0) {
			return validStrings;
		}
	}

	// 如果数组格式有问题，返回空数组
	return [];
};

// 提取并规范化数组（所有值都作为字符串）
let normalizedA, normalizedB;

try {
	normalizedA = extractStrings(a);
	normalizedB = extractStrings(b);

	console.log('数组 a 长度:', normalizedA.length);
	console.log('数组 b 长度:', normalizedB.length);
} catch (error) {
	console.error('解析数组时出错，请确保数组格式正确:', error);
	// 如果出错，尝试直接使用原数组
	normalizedA = Array.isArray(a)
		? a.map(String).filter((item) => item.trim() !== '')
		: [];
	normalizedB = Array.isArray(b)
		? b.map(String).filter((item) => item.trim() !== '')
		: [];
	console.log('使用备用方法提取字符串');
	console.log('数组 a 长度:', normalizedA.length);
	console.log('数组 b 长度:', normalizedB.length);
}

// 将数组转换为 Set 以提高查找性能
const aSet = new Set(normalizedA);
const bSet = new Set(normalizedB);

// 找出积加有但是 erp 没有的值
const onlyInA = normalizedA.filter((item) => !bSet.has(item));

// 找出 erp 有但是积加没有的值
const onlyInB = normalizedB.filter((item) => !aSet.has(item));

// 输出结果
console.log('积加有但 erp 没有的值，共', onlyInA.length, '个：');
console.log(onlyInA);

console.log('\nerp 有但积加没有的值，共', onlyInB.length, '个：');
console.log(onlyInB);

// 将两个结果都写到 c.txt 文件中
const result = {
	积加有但erp没有: {
		数量: onlyInA.length,
		数据: onlyInA,
	},
	erp有但积加没有: {
		数量: onlyInB.length,
		数据: onlyInB,
	},
};

// 获取脚本文件所在目录
const scriptDir = __dirname;
const outputPath = path.join(scriptDir, 'c.txt');

try {
	fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
	console.log('\n结果已写入文件:', outputPath);
	console.log('文件写入成功！');
} catch (error) {
	console.error('写入文件失败:', error.message);
	console.error('错误详情:', error);
}

// 输出为数组格式（方便复制）
// console.log('\n数组格式：');
// console.log(JSON.stringify(onlyInA, null, 2));

// 如果需要复制到剪贴板，可以使用以下代码（在浏览器控制台中）
// copy(onlyInA.join('\n'));
// Aliexpress海外托管
// 订购时间：2026-02-01 ~ 2026-03-01
// 数组 a 长度: 1050
// 数组 b 长度: 964
// 积加有但 erp 没有的值，共 87 个：
// [
//   3069034307829475, 3068953427657571, 3068237541191751, 3068615825517290,
//   3068614868311780, 3068740957727573, 8208549312963175, 8208534995894426,
//   8208534912478628, 3068427652053687, 3068343151944326, 3068587109723863,
//   3068331314886080, 3068695590248650, 3068695351588650, 3068402052678650,
//   3068319399930233, 3068681594995936, 8208510992402428, 3068553584225061,
//   3068275807516610, 3068547989016122, 3068370776487913, 3067942961991660,
//   3068651595178018, 3068525263870459, 3067938482994345, 3068084816848018,
//   3068524148432776, 3068273476162737, 3067933768344820, 3068640074553937,
//   3068346777103937, 3068514387735833, 3068233006937476, 3068123545977476,
//   8208286081300336, 8208991982184381, 3068622798250883, 8208277523792469,
//   8208471158758213, 3068212124977730, 8208876687907455, 3068103626323415,
//   3068231473566017, 8208222972147760, 8208317386637760, 1118840928038305,
//   3068597118335500, 3068476625927212, 3068476703486529, 3068093467988124,
//   3068223632928018, 3068308295697438, 3068474627904980, 3068221236281650,
//   8209332479199142, 8208269606684129, 3068217476405052, 3068300058979143,
//   3068022656184517, 3068082582694508, 3068292858871887, 3068076740126133,
//   3068014975291081, 3068013136893478, 3068577915009016, 3068178528506816,
//   3068007536755915, 8208306987352670, 3068193471365058, 3068277735688674,
//   3068166764779935, 3068441907644909, 3067849128584514, 3068271418467977,
//   3067991859040903, 3068269574749404, 3068160441680149, 3068154844117544,
//   3068177873767544, 3068262772133020, 3068260534735102, 3068547353884190,
//   3068144203644817, 3068164357814115, 3068535432181710
// ]
