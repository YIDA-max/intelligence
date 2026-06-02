/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-11-21 14:35:16
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-02-24 18:18:27
 * @FilePath: \qianyi-ui\.eslintrc.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	parser: 'vue-eslint-parser',
	parserOptions: {
		ecmaVersion: 12,
		parser: '@typescript-eslint/parser',
		sourceType: 'module',
	},
	extends: [
		'plugin:vue/vue3-essential',
		'plugin:vue/essential',
		'eslint:recommended',
	],
	plugins: ['vue', '@typescript-eslint'],
	overrides: [
		{
			files: ['*.ts', '*.tsx', '*.vue', '*.js'],
			rules: {
				'no-undef': 'off',
			},
		},
		{
			files: ['scripts/**/*.mjs'],
			rules: {
				'no-console': 'off',
			},
		},
	],
	rules: {
		// http://eslint.cn/docs/rules/
		// https://eslint.vuejs.org/rules/
		// https://typescript-eslint.io/rules/no-unused-vars/
		// 允许使用 @ts-ignore 忽略类型检查错误（方便临时绕过，但可能隐藏问题）
		'@typescript-eslint/ban-ts-ignore': 'off',
		// 函数不需要显式声明返回类型（由 TypeScript 自动推导）
		'@typescript-eslint/explicit-function-return-type': 'off',
		// 允许使用 any 类型（降低类型安全性，提升开发灵活性）
		'@typescript-eslint/no-explicit-any': 'off',
		// 允许在 ES 模块中使用 require() 引入 CommonJS 模块
		'@typescript-eslint/no-var-requires': 'off',
		// 允许定义空函数（如事件占位、回调 stub 等场景）
		'@typescript-eslint/no-empty-function': 'off',
		// 允许在声明前使用变量或函数（依赖 JavaScript/TypeScript 的提升机制）
		'@typescript-eslint/no-use-before-define': 'off',
		// 允许使用 @ts-expect-error、@ts-ignore 等 TypeScript 注释指令
		'@typescript-eslint/ban-ts-comment': 'off',
		// 允许使用不推荐的泛化类型（如 Object、Function、{}），而非更精确的类型
		'@typescript-eslint/ban-types': 'off',
		// 允许使用非空断言操作符 !（如 foo!.bar），即使值可能为 null/undefined
		'@typescript-eslint/no-non-null-assertion': 'off',
		// 导出的函数或类成员不需要显式标注类型（由 TS 推导边界类型）
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		// 禁止重复声明变量或函数（error 级别，防止逻辑错误）
		'@typescript-eslint/no-redeclare': 'error',
		// 允许在可选链后使用非空断言（如 a?.b!），尽管可能存在运行时风险
		'@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
		// 禁止未使用的变量（2 = error 级别），保持代码整洁
		'@typescript-eslint/no-unused-vars': ['error'],
		// 自定义事件名不限制命名风格（可 camelCase、PascalCase 等，不强制 kebab-case）
		'vue/custom-event-name-casing': 'off',
		// 模板中属性顺序自由，不强制按类别排序（如 directive、attribute 顺序）
		'vue/attributes-order': 'off',
		// 允许一个 .vue 文件中定义多个组件（不推荐，但某些工具组件场景可用）
		'vue/one-component-per-file': 'off',
		// 标签闭合括号不要求换行（可写在同行或新行）
		'vue/html-closing-bracket-newline': 'off',
		// 不限制每行属性数量（可将多个属性写在同一行）
		'vue/max-attributes-per-line': 'off',
		// 多行 HTML 元素内容前后不要求换行
		'vue/multiline-html-element-content-newline': 'off',
		// 单行 HTML 元素内容内部不要求换行
		'vue/singleline-html-element-content-newline': 'off',
		// 属性名可不用连字符分隔（如 dataId 而非 data-id），注意 DOM 中会转为小写
		'vue/attribute-hyphenation': 'off',
		// 空标签可不自闭合（如 <img> 而非 <img />），浏览器兼容但不符合 XHTML 规范
		'vue/html-self-closing': 'off',
		// 允许多个根节点（Vue 3 支持 Fragment，需确保项目为 Vue 3+）
		'vue/no-multiple-template-root': 'off',
		// props 不强制提供 default 默认值
		'vue/require-default-prop': 'off',
		// 允许 v-model 使用参数（如 v-model:visible）
		'vue/no-v-model-argument': 'off',
		// watch 选项中允许使用箭头函数（但 this 指向可能错误，需开发者自行注意）
		'vue/no-arrow-functions-in-watch': 'off',
		// 允许在 <template> 标签上使用 key（Vue 3.4+ 已原生支持）
		'vue/no-template-key': 'off',
		// 允许使用 v-html（⚠️ 存在 XSS 风险，仅限可信内容）
		'vue/no-v-html': ['warn'],
		// 允许在模板中使用 eslint-disable 等注释指令
		'vue/comment-directive': 'off',
		// ⚠️ 禁止直接修改 props（error 级别），防止破坏单向数据流
		'vue/no-mutating-props': ['error'],
		// 忽略模板解析错误（一般不应关闭，除非使用特殊语法插件）
		'vue/no-parsing-error': ['error'],
		// 允许使用已废弃的 .native 修饰符（仅适用于 Vue 2 项目）
		'vue/no-deprecated-v-on-native-modifier': 'off',
		// 组件名可为单个单词（如 <Button>），但可能与原生 HTML 标签冲突
		'vue/multi-word-component-names': 'off',
		// 允许无意义的转义字符（如 \.、\*），虽无害但冗余
		'no-useless-escape': ['warn'],
		// 允许稀疏数组（如 [1,,2]），但遍历时可能跳过索引
		'no-sparse-arrays': ['warn'],
		// 允许直接调用对象原型方法（如 obj.hasOwnProperty('x')），有被覆盖风险
		'no-prototype-builtins': 'off',
		// 允许常量条件表达式（如 while(true)），用于无限循环等场景
		'no-constant-condition': ['warn'],
		// 允许在声明前使用变量或函数（依赖变量提升）
		'no-use-before-define': ['off'],
		// 不限制使用特定全局变量（如 event、name 等）
		'no-restricted-globals': ['error'],
		// 不限制使用特定语法（如 with、label 等）
		'no-restricted-syntax': 'off',
		// generator 函数的 * 位置自由（function* foo 或 function * foo 均可）
		'generator-star-spacing': 'off',
		// 允许不可达代码（如 return 后仍有语句）
		'no-unreachable': ['warn'],
		// （重复项，实际由 vue/no-multiple-template-root 覆盖）允许多根模板
		'no-multiple-template-root': 'off',
		// ⚠️ 禁止未使用的变量（error 级别），保持代码干净
		'no-unused-vars': ['error'],
		// （重复项，实际由 vue/no-v-model-argument 覆盖）允许 v-model 参数
		'no-v-model-argument': 'off',
		// 允许在 switch case 中直接声明变量（不加 {} 块）
		'no-case-declarations': 'off',
		// ⚠️ 禁止使用 console（防止上线遗留调试日志）
		'no-console': ['error'],
		// 允许重复声明变量（var 可提升，let/const 仍会报错）
		'no-redeclare': ['error'],
		// 允许混用空格和 Tab 缩进（格式应交由 Prettier 统一处理）
		'no-mixed-spaces-and-tabs': ['warn'],
		// ⚠️ 禁止使用 debugger（防止上线遗留调试断点）
		'no-debugger': ['error'],
	},
};
