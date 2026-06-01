/* eslint-disable no-console */
/*
 * @Description: 对比两个 Excel 文件订单数据是否一致
 * 使用方式：
 *   1. 将两个 Excel 文件放在此目录下，命名为 a.xlsx 和 b.xlsx
 *   2. 运行：node code.js
 *   3. 结果会输出到 c.txt 文件
 *
 * 对比逻辑：
 *   - 以"平台订单编号"作为唯一标识匹配两边的订单
 *   - 对匹配到的订单，对比平台、站点、店铺、订单状态、金额等公共字段
 *   - 输出：a有b没有 / b有a没有 / 两边一致 / 两边不一致（含差异字段详情）
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 获取当前脚本所在目录
const currentDir = __dirname || path.dirname(require.main.filename);

// 文件名称
const NAME_A = 'erp';
const NAME_B = '积加';

// Excel 文件路径（文件名与名称对应）
const fileA = path.join(currentDir, `${NAME_A}.xlsx`);
const fileB = path.join(currentDir, `${NAME_B}.xlsx`);
const outputFile = path.join(currentDir, 'c.txt');

// 唯一标识字段名（用于匹配两边的订单）
const UNIQUE_KEY_FIELD = '平台订单编号';

// 需要对比的公共字段（两个文件都有的字段）
const COMPARE_FIELDS = [
	'平台',
	'站点',
	'店铺',
	'平台订单编号',
	'订单状态',
	'订单币种',
	'订单总金额',
	'买家实付金额',
	'买家账号名',
	'买家邮箱',
	'收件人姓名',
	'收件人电话',
	'收件人国家',
	'收件人省',
	'收件人城市',
	'配送方式',
	'付款方式',
	'付款时间',
	'订购时间',
];

/**
 * 读取 Excel 文件并转换为对象数组
 */
function readExcelToArray(filePath) {
	try {
		if (!fs.existsSync(filePath)) {
			console.error(`❌ 文件不存在: ${filePath}`);
			return [];
		}
		const workbook = XLSX.readFile(filePath);
		const sheetName = workbook.SheetNames[0];
		const worksheet = workbook.Sheets[sheetName];
		const data = XLSX.utils.sheet_to_json(worksheet, {
			raw: false,
			defval: '',
		});
		console.log(
			`✅ 读取文件: ${path.basename(filePath)}，数据行数: ${data.length}`
		);
		return data;
	} catch (error) {
		console.error(`❌ 读取文件失败: ${filePath}`, error.message);
		return [];
	}
}

/**
 * 从一行数据中取唯一标识的值
 */
function getUniqueKey(row) {
	const val = row[UNIQUE_KEY_FIELD];
	return val ? String(val).trim() : null;
}

/**
 * 对比两行在公共字段上的差异
 * @returns {Array} 差异字段列表
 */
function compareCommunFields(rowA, rowB) {
	const diffs = [];
	for (const field of COMPARE_FIELDS) {
		const valA = rowA[field] !== undefined ? String(rowA[field]).trim() : '';
		const valB = rowB[field] !== undefined ? String(rowB[field]).trim() : '';
		if (valA !== valB) {
			diffs.push({
				字段: field,
				[`${NAME_A}的值`]: valA || '(空)',
				[`${NAME_B}的值`]: valB || '(空)',
			});
		}
	}
	return diffs;
}

/**
 * 提取行中需要对比的公共字段
 */
function pickCompareFields(row) {
	const result = {};
	for (const field of COMPARE_FIELDS) {
		if (row[field] !== undefined) {
			result[field] = row[field];
		}
	}
	return result;
}

function normStr(val) {
	return val !== undefined && val !== null ? String(val).trim() : '';
}

function isRakutenFrMerachFitness(row) {
	const platform = normStr(row['平台']);
	const site = normStr(row['站点']);
	const shop = normStr(row['店铺']);
	return (
		platform === 'Rakuten_FR' && site === 'FR' && shop === 'MERACH-FITNESS'
	);
}

function isIgnoreOnlyInA(rowA) {
	const platform = normStr(rowA['平台']);
	const country = normStr(rowA['收件人国家']);
	if (platform === 'Shopline') {
		return true;
	}
	if (isRakutenFrMerachFitness(rowA)) {
		return true;
	}
	return platform === 'Walmart' && country === '加拿大';
}

function isIgnoreOnlyInB(rowB) {
	const platform = normStr(rowB['平台']);
	return platform === 'Shopline';
}

/**
 * 主函数
 */
function main() {
	console.log('🚀 开始对比 Excel 文件...\n');

	if (!fs.existsSync(fileA)) {
		console.error(`❌ 文件不存在: ${fileA}`);
		console.log(`💡 请将 ${NAME_A} 的 Excel 文件命名为 ${NAME_A}.xlsx`);
		return;
	}
	if (!fs.existsSync(fileB)) {
		console.error(`❌ 文件不存在: ${fileB}`);
		console.log(`💡 请将 ${NAME_B} 的 Excel 文件命名为 ${NAME_B}.xlsx`);
		return;
	}

	console.log(`📖 读取文件 A（${NAME_A}）...`);
	const arrayA = readExcelToArray(fileA);
	console.log(`📖 读取文件 B（${NAME_B}）...`);
	const arrayB = readExcelToArray(fileB);
	console.log('');

	if (arrayA.length === 0 && arrayB.length === 0) {
		console.error('❌ 两个文件都为空，无法对比');
		return;
	}

	// 以平台订单编号建立索引
	const mapA = new Map();
	const mapB = new Map();

	for (const row of arrayA) {
		const key = getUniqueKey(row);
		if (key) {
			mapA.set(key, row);
		} else {
			console.warn(`⚠️  ${NAME_A} 文件中存在无法提取平台订单编号的行，已跳过`);
		}
	}

	for (const row of arrayB) {
		const key = getUniqueKey(row);
		if (key) {
			mapB.set(key, row);
		} else {
			console.warn(`⚠️  ${NAME_B} 文件中存在无法提取平台订单编号的行，已跳过`);
		}
	}

	// 分类结果
	const onlyInA = []; // a有b没有
	const onlyInB = []; // b有a没有
	const same = []; // 两边对比字段完全一致
	const different = []; // 两边都有但有差异
	const ignoredOnlyInA = []; // a有b没有，但命中忽略规则
	const ignoredOnlyInB = []; // b有a没有，但命中忽略规则

	// 遍历 A，找出只在 A 或两边都有的
	for (const [key, rowA] of mapA) {
		if (!mapB.has(key)) {
			if (isIgnoreOnlyInA(rowA)) {
				ignoredOnlyInA.push(pickCompareFields(rowA));
				continue;
			}
			onlyInA.push(pickCompareFields(rowA));
		} else {
			const rowB = mapB.get(key);
			const diffs = compareCommunFields(rowA, rowB);
			if (diffs.length === 0) {
				same.push(pickCompareFields(rowA));
			} else {
				different.push({
					平台订单编号: key,
					差异字段: diffs,
					[`${NAME_A}数据`]: pickCompareFields(rowA),
					[`${NAME_B}数据`]: pickCompareFields(rowB),
				});
			}
		}
	}

	// 遍历 B，找出只在 B 的
	for (const [key, rowB] of mapB) {
		if (!mapA.has(key)) {
			if (isIgnoreOnlyInB(rowB)) {
				ignoredOnlyInB.push(pickCompareFields(rowB));
				continue;
			}
			onlyInB.push(pickCompareFields(rowB));
		}
	}

	// 汇总
	const result = {
		汇总: {
			[`${NAME_A}总行数`]: arrayA.length,
			[`${NAME_B}总行数`]: arrayB.length,
			[`${NAME_A}有${NAME_B}没有`]: onlyInA.length,
			[`${NAME_A}有${NAME_B}没有(已忽略)`]: ignoredOnlyInA.length,
			[`${NAME_B}有${NAME_A}没有`]: onlyInB.length,
			[`${NAME_B}有${NAME_A}没有(已忽略)`]: ignoredOnlyInB.length,
			两边一致: same.length,
			两边不一致: different.length,
		},
		对比字段: COMPARE_FIELDS,
		[`${NAME_A}有但${NAME_B}没有`]: {
			数量: onlyInA.length,
			数据: onlyInA,
		},
		[`${NAME_A}有但${NAME_B}没有(已忽略)`]: {
			数量: ignoredOnlyInA.length,
			忽略规则:
				'当平台=Shopline时无视；或(平台=Rakuten_FR且站点=FR且店铺=MERACH-FITNESS)时无视；或平台=Walmart且收件人国家=加拿大时无视(ERP有但积加没有)',
			数据: ignoredOnlyInA,
		},
		[`${NAME_B}有但${NAME_A}没有`]: {
			数量: onlyInB.length,
			数据: onlyInB,
		},
		[`${NAME_B}有但${NAME_A}没有(已忽略)`]: {
			数量: ignoredOnlyInB.length,
			忽略规则: '当平台=Shopline时无视(积加有但ERP没有)',
			数据: ignoredOnlyInB,
		},
		// 两边一致: {
		// 	数量: same.length,
		// 	数据: same,
		// },
		// 两边都有但不一致: {
		// 	数量: different.length,
		// 	数据: different,
		// },
	};

	// 打印汇总
	console.log('📊 对比结果汇总：');
	console.log(`   唯一标识字段：${UNIQUE_KEY_FIELD}`);
	console.log(`   ${NAME_A} 总行数：${arrayA.length}`);
	console.log(`   ${NAME_B} 总行数：${arrayB.length}`);
	console.log(`   ${NAME_A}有${NAME_B}没有：${onlyInA.length} 行`);
	console.log(
		`   ${NAME_A}有${NAME_B}没有(已忽略)：${ignoredOnlyInA.length} 行`
	);
	console.log(`   ${NAME_B}有${NAME_A}没有：${onlyInB.length} 行`);
	console.log(
		`   ${NAME_B}有${NAME_A}没有(已忽略)：${ignoredOnlyInB.length} 行`
	);
	console.log(`   两边一致：${same.length} 行`);
	console.log(`   两边不一致：${different.length} 行`);
	console.log('');

	// 写入 c.txt
	try {
		fs.writeFileSync(outputFile, JSON.stringify(result, null, 2), 'utf-8');
		console.log(`✅ 结果已保存到: ${outputFile}`);
	} catch (error) {
		console.error('❌ 保存结果失败:', error.message);
	}

	// 控制台打印不一致的详情
	if (different.length > 0) {
		console.log(`\n⚠️  两边不一致的前 3 条：`);
		different.slice(0, 3).forEach((item) => {
			console.log(`   订单: ${item.平台订单编号}`);
			item.差异字段.forEach((d) => {
				console.log(
					`     ${d.字段}: ${NAME_A}="${d[`${NAME_A}的值`]}" vs ${NAME_B}="${
						d[`${NAME_B}的值`]
					}"`
				);
			});
		});
		if (different.length > 3) {
			console.log(`   ... 还有 ${different.length - 3} 条差异，详见 c.txt`);
		}
	}
}

main();
