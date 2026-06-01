/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

// 获取当前文件夹路径
const currentDir = __dirname;

// 读取 a.txt 文件
const aFilePath = path.join(currentDir, 'a.txt');
const bFilePath = path.join(currentDir, 'b.txt');

try {
	// 读取文件内容
	const fileContent = fs.readFileSync(aFilePath, 'utf-8');

	// 按行分割
	const lines = fileContent.split(/\r?\n/);

	// 创建数组，存储数字
	const numbers = [];

	// 遍历每一行
	lines.forEach((line) => {
		// 去除首尾空白
		const trimmedLine = line.trim();

		// 如果行为空，跳过
		if (!trimmedLine) {
			return;
		}

		numbers.push(`'${trimmedLine}'`);
	});

	// 将数组转换为 JavaScript 数组格式字符串   去重
	const outputContent =
		'[\n' + [...new Set(numbers)].map((num) => `\t${num}`).join(',\n') + '\n]';

	// 写入 b.txt 文件
	fs.writeFileSync(bFilePath, outputContent, 'utf-8');

	console.log(`成功处理 ${lines.length} 行，找到 ${numbers.length} 个数字`);
	console.log(`数组已写入到: ${bFilePath}`);
	console.log(`数组内容预览（前10个）:`, numbers.slice(0, 10));
} catch (error) {
	console.error('处理文件时出错:', error.message);
	if (error.code === 'ENOENT') {
		console.error(`文件不存在: ${aFilePath}`);
		console.error('请确保 a.txt 文件存在于当前文件夹中');
	}
	process.exit(1);
}
