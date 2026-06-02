/*
 * @Description:
 */
/**
 * 版本文件生成脚本
 * 在构建时生成 version.json 文件
 */
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

// 读取 package.json 获取版本号
const packageJson = require('../package.json');
// 生成版本信息
const versionInfo = {
	version: packageJson.version,
	buildTime: new Date().getTime(),
	buildDate: new Date().toISOString(),
};

// 定义输出目录列表
const outputDirs = [
	path.resolve(__dirname, '../public'), // 开发环境使用
	path.resolve(__dirname, '../html'), // 生产环境打包输出目录
];

// 遍历所有输出目录，生成版本文件
outputDirs.forEach((outputDir) => {
	// 确保目录存在
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	const outputFile = path.join(outputDir, 'version.json');

	// 写入版本文件
	fs.writeFileSync(outputFile, JSON.stringify(versionInfo, null, 2), 'utf-8');

	console.log('✅ 版本文件生成成功:', outputFile);
});

module.exports = versionInfo;
