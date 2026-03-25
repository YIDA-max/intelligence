/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-03-12 18:55:56
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-03-12 19:14:35
 * @FilePath: \qianyi-ui\intelligence\工程化是什么\构建工具\3-现在的工程\1-react-js\webpack.config.js
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
// 引入插件 解析html文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 引入路径
const path = require('path');
module.exports = {
	mode: 'development', // 开发模式
	entry: './src/index.jsx', // 项目入口
	// 打包后的输出配置
	output: {
		path: path.resolve(__dirname, 'dist'),
		// [contenthash] 会根据文件内容生成唯一的哈希值
		filename: 'bundle.[contenthash:8].js',
		clean: true, // 每次打包前自动清理 dist 目录，防止旧文件堆积
	},
	// 模块的解析配置
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/, // 匹配 js 或 jsx 文件
				exclude: /node_modules/,
				use: {
					// 使用 babel 编译
					loader: 'babel-loader',
					options: {
						// 使用什么预设
						presets: ['@babel/preset-env', '@babel/preset-react'],
					},
				},
			},
			{
				test: /\.css$/i, // 处理 .css 文件
				use: ['style-loader', 'css-loader'],
			},
		],
	},
	// 插件的配置
	plugins: [
		// 解析html文件
		new HtmlWebpackPlugin({
			template: './public/index.html', // 模板文件
		}),
	],
	// 开发服务器配置
	devServer: {
		port: 3000, // 端口号
		open: true, // 自动打开浏览器
	},
};
