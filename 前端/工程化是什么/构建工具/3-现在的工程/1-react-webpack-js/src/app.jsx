/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-03-12 18:49:35
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-03-16 17:26:16
 * @FilePath: \qianyi-ui\intelligence\工程化是什么\构建工具\3-现在的工程\1-react-webpack-js\src\app.jsx
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
// 引入 React
import React, { useState } from 'react';
import './app.css';

function App() {
	// 用一个很小的 state 来演示“数据变化会触发重新渲染”
	const [state, setState] = useState(1);
	return (
		<div className="container">
			<section className="section section-intro">
				<h1>React 的本质是什么？</h1>
				<p>
					React
					本质上是一个更高维度的抽象框架，它从“架构视角”出发，替我们处理了前端开发中大量繁琐、重复的工作。
				</p>
				<p>
					虽然 React 最终仍然编译为
					<code>HTML + CSS + JS</code>，但它构建了属于自己的完整生态系统。
				</p>

				<div className="divider"></div>

				<h2>先思考：前端的本质是什么？</h2>
				<p>
					前端的本质是 <code>HTML + CSS + JS</code>，让我们逐一分析：
				</p>

				<h3>CSS 的本质是什么？（简化版）</h3>
				<p>
					CSS（层叠样式表）的本质是
					<code>样式计算</code>。虽然目前没有一套非常完善和好用的 CSS 框架，但
					CSS 的样式计算必须依托于 HTML 结构。
				</p>
				<blockquote>
					<p>
						<strong>重点提示</strong>：因此，CSS 离不开 HTML，换句话说，
						<strong>CSS 是严格依赖 HTML 结构的</strong>。
					</p>
				</blockquote>

				<h3>那么问题来了：HTML 的本质是什么？</h3>
				<p>它是什么东西？它和 JS 又有什么关系呢？</p>
				<p>
					首先要明确一个前提：我们所说的运行环境是指基于浏览器的环境，而不是
					Node.js 或其他运行环境。
				</p>
			</section>

			<div className="divider"></div>

			<section className="section section-runtime">
				<h2>JavaScript 与运行环境（选修）</h2>

				<h3>JavaScript 的本质</h3>
				<p>
					<code>JS</code>
					是一种编程语言，它本身是一个“规范集合”。ES 规范（ECMAScript）定义了
					<code>const</code>、<code>let</code> 等语言特性。
				</p>
				<p>
					各家引擎（V8、JavaScriptCore
					等）负责“实现”这些规范，实现得越完整、越高效， JavaScript
					运行就越快、越稳定。
				</p>

				<h3>JavaScript 引擎</h3>
				<p>
					本质的执行层是
					<strong>JavaScript 引擎</strong>。只要有这个引擎，就可以执行
					JavaScript 代码。
				</p>
				<ul>
					<li>
						<code>V8 引擎</code>：大名鼎鼎的 Chrome 和 Node.js 使用的引擎
					</li>
					<li>
						<code>JavaScriptCore</code>：苹果的 Safari 浏览器使用的引擎
					</li>
					<li>
						<code>SpiderMonkey</code>：Firefox 浏览器使用的引擎
					</li>
				</ul>

				<h3>运行环境（浏览器 vs Node.js）</h3>
				<p>
					运行环境就是 JavaScript 执行的场所，比如浏览器、Node.js
					等。它们都提供了引擎支持，有了这个引擎就可以执行 JavaScript
					了，也就是说，它们是 JavaScript 的运行环境。
				</p>
				<blockquote>
					<p>
						<strong>浏览器和 Node.js 运行环境的特性差异</strong>
					</p>
					<p>
						各种运行环境都要实现 <code>ES 规范</code>，但在实现 ES
						规范之后，它们又会有自己的一些特性。
					</p>
					<h4>共同特性</h4>
					<ul>
						<li>
							<strong>网络请求</strong>：两者都支持网络请求功能
						</li>
					</ul>
					<h4>浏览器环境特性</h4>
					<ul>
						<li>
							<strong>DOM 操作</strong>：可以操作文档对象模型
						</li>
						<li>
							<strong>网络请求</strong>：基于
							<code>XMLHttpRequest</code>，后续添加了 <code>fetch</code>
						</li>
						<li>
							<strong>文件系统</strong>：部分现代浏览器支持文件系统 API
						</li>
					</ul>
					<h4>Node.js 环境特性</h4>
					<ul>
						<li>
							<strong>文件系统</strong>：完整的文件系统操作能力
						</li>
						<li>
							<strong>网络请求</strong>：基于 <code>http</code>{' '}
							模块，后续也添加了
							<code>fetch</code>
						</li>
						<li>
							<strong>DOM 操作</strong>：不支持（需要额外库如 <code>jsdom</code>
							）
						</li>
					</ul>
					<p>
						<strong>总结</strong>：有了 JavaScript
						运行环境之后，我们就可以在这个环境中执行代码，操作
						DOM、访问文件或调用各种 API。
					</p>
					<h3>对比表格</h3>
					<table>
						<thead>
							<tr>
								<th>特性</th>
								<th>浏览器环境</th>
								<th>Node.js 环境</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>DOM 操作</td>
								<td>✅ 支持</td>
								<td>❌ 不支持</td>
							</tr>
							<tr>
								<td>文件系统</td>
								<td>❌ 不支持</td>
								<td>✅ 支持</td>
							</tr>
						</tbody>
					</table>
				</blockquote>
			</section>

			<section className="section section-js-html">
				<h2>JS 和 HTML 的关系思考（重点）</h2>
				<div>
					<div>进入正题：</div>
					<div>尝试用“架构师视角”来重新看前端</div>
					<br />
					<div>前提1：运行环境是浏览器；前提2：浏览器提供了 DOM 操作能力。</div>
					<br />
				</div>
				<div>
					<div>
						在很久很久以前，大家基本都是“直接用 JS 操作 DOM”
						<br />
						<pre>
							<code>{`const div = document.createElement('div');
div.innerHTML = 'Hello World';
document.body.appendChild(div);`}</code>
						</pre>
					</div>
					<div>
						然后根据数据的不同，去创建一个个 DOM，或者修改、删除已有 DOM。
					</div>
					<br />
				</div>
				<div>
					开始思考：我们究竟在干什么？本质上，我们是“根据数据构建用户可见的视图”。前端其实是数字世界的入口和操作界面。
				</div>
				<div>
					想到这里，会发现真正需要关注的是“数据”。只有数据正确，视图才有意义。换句话说：数据优先于视图，也就是“数据驱动视图”（MVVM
					的核心）。
				</div>
				<br />
				<div>
					<div>
						接着问：视图的本质是什么？在浏览器环境中，视图的载体就是 DOM。
						<br />
						而我们平时是这样操作 DOM 的：
					</div>
					<div>
						<pre>
							<code>{`const div = document.createElement('div');
div.innerHTML = 'Hello World';
document.body.appendChild(div);`}</code>
						</pre>
						那么这段代码他的本质是什么？
					</div>
					<div>
						于是可以抽象出一个结论：这段行为可以被“收敛”为一个函数
						<pre>
							<code>{`function fn() {
  const div = document.createElement('div');
  div.innerHTML = 'Hello World';
  document.body.appendChild(div);
}`}</code>
						</pre>
					</div>
					<div>
						走到这里，我们已经很接近 React
						的核心：当数据变化时，我们真正想要的，是“有人帮我们自动重新执行这个
						render 函数，从而更新视图”。
					</div>
					<div>
						不如给这个函数取一个更语义化的名字吧：<code>render</code> 函数。
					</div>
					<div>
						接下来会分成两个主流分支：Vue 和 React。这里我们只聚焦 React。
					</div>
					<div>
						当我们有了一个 render 函数之后，就有了“数据 ↔
						视图”的对应关系：当某个数据变化时，只要“有人”帮我们自动执行 render
						函数即可。那怎么做呢？
						<br />
						<button
							onClick={() => {
								setState(state + 1);
							}}
						>
							点击 +1：{state}
						</button>
						<br />
						这段小代码的细节先不展开，本质含义是：当 state 变化时，React
						会自动帮我们重新执行 App（也就是重新“渲染视图”）。
					</div>
					<div>
						走到这一步，我们已经从“手动操作 DOM”升级为“声明状态，由框架自动操作
						DOM”。
						<br />
						内部细节非常多，但核心转变只有一句话：从命令式编程，变成了声明式编程。
						<br />
						可以用两个小例子对比一下这一点：
						<br />
						<span>1）命令式写法（手动操作 DOM）：</span>
						<pre>
							<code>{`const title = document.createElement('h1');
title.textContent = '当前计数：' + count;
root.innerHTML = '';
root.appendChild(title);`}</code>
						</pre>
						<span>2）声明式写法（在 React 中）：</span>
						<pre>
							<code>{`function App() {
  const [count, setCount] = useState(0);
  return <h1>当前计数：{count}</h1>;
}`}</code>
						</pre>
						<span>
							同样是“显示当前计数”，前者要自己想办法清空、创建、挂载
							DOM；后者只要“声明好视图长什么样”，更新交给 React 处理。
						</span>
						<br />
						再往下就是大家熟悉的虚拟 DOM、Diff 算法等实现细节，这里就不展开了。
					</div>
					<div>
						此时我们会发现：HTML “淡出舞台中心”，一切都被 JS 接管。
						<br />
						大多数时候，我们只需要关心 JS
						中的数据和页面结构，而不用再手动维护每一个 DOM 操作。
						<br />
						这其实就是“工程化”的价值：把重复、易错的部分交给框架，让开发者专注在“数据”和“抽象”本身。
					</div>
				</div>
			</section>

			<div className="divider"></div>

			<section className="section section-jsx">
				<h2>JS 与 JSX 的思考</h2>
				<div>
					当架构师们决定要搞一套新的工程化方案之后，在经过一轮架构设计和讨论，他们敲定了顶层架构：MVVM
					和声明式编程。
				</div>
				<div>
					在一段开发之后，他们搞出了 React
					源码，然后开始思考：我们应该怎么去构建这个 React 项目呢？
				</div>
				<div>
					React 源码的本质就是一个 JS 库，我们当然可以像以前一样，直接用
					&lt;script&gt; 标签引入，然后用它提供的 API 来构建项目：
				</div>
				<pre>
					<code>{`<!-- 传统 script 引入 React 的方式 -->
<script src="https://unpkg.com/react/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom/umd/react-dom.development.js"></script>

<div id="root"></div>

<script>
  const App = () => React.createElement('h1', null, 'Hello React');
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(React.createElement(App));
</script>`}</code>
				</pre>
				<div>这个方式本质上就是“直接拿 React 这个 JS 库来用”。</div>
				<br />
				<div>
					但是这相比 jQuery 虽然效率高了很多，本质上还是 “HTML + JS + CSS”
					那一套，只是少写了一些 DOM
					操作。架构师们并不满足：辛辛苦苦搞出的高效库，如果只是当成“更舒服的
					DOM 封装”来用，未免太浪费了。
				</div>
				<br />
				<div>
					所以，<code>JSX</code> 闪亮登场。它的本质是：在 JS
					基础上的一层语法扩展——JS 能写的，JSX 都能写；JSX 能表达的 UI
					结构，用纯 JS 也能写，但会非常啰嗦。
				</div>
				<div>
					<div>这个又回到了“语法层”的选修课：js / jsx / ts / tsx / vue。</div>
					<div>
						这些文件本质上都是在“实现或扩展 ES
						标准”，浏览器的运行环境其实最终只认 JS / HTML / CSS 这三样东西。
					</div>
					<div>所以说 JSX 最终必须被编译为 JS，才能在浏览器中运行。</div>
					<div>
						理论上来说，我完全可以声明一个YIDA.yida
						文件格式，再写一套编译器，把它编译为 JS，最后在浏览器中运行。
					</div>
					<div>
						额外提一嘴，他们的编译原理是用是 <code>AST（抽象语法树）</code>{' '}
						来实现的，也就是词法分析，语法分析，语义分析，代码生成等步骤来实现的
					</div>
					<div>
						JSX 就是这样的：React 提供的一套语法糖，本质是“在 JS 里写 UI
						结构”的一套规则。
					</div>
					<div>
						可以简单理解为：JSX
						是一套“状态切换机制”，编译器通过两个关键符号来决定当前是在“画
						UI”还是在“算逻辑”：
					</div>
					<pre>
						<code>{`遇到 < ：开启 UI 模式
- 识别类型：
  - 小写字母（如 <div>） → 转为 HTML 标签字符串
  - 大写字母（如 <MyTab />） → 转为 JS 变量 / 组件
- 打包属性：把 class、id、onClick 等收集成一个 props 对象
- 生成对象：最终翻译成 React.createElement(...)，得到“虚拟 DOM”对象

遇到 { ：切回 JS 模式
- 开启“逃生舱”：暂时离开 UI 语法，进入纯 JavaScript 表达式
- 执行逻辑：运行变量、函数调用、三元运算等
- 填回结果：把运算后的值（字符串、数字或新的 JSX）塞回前面的 UI 结构里

核心逻辑：
- < 是用来“画结构”的
- { 是用来“塞数据 / 写逻辑”的
两者不断嵌套，就组成了逻辑与 UI 混写的 React 视图。`}</code>
					</pre>
					<br />
					<div>
						然后,在经过 React.createElement
						等等一系列的函数调用之后，最终会得到一个虚拟DOM对象，
						接下来的流程就是上诉所说，一系列流程，不过多赘述
					</div>
					<div>
						然后，问题来了，浏览器的运行环境只认JS / HTML / CSS
						这三样东西，我们写jsx，他又不识别，那应该怎么办呢？
					</div>
				</div>
			</section>

			<div className="divider"></div>

			<section className="section section-webpack">
				<h2>webpack的构建过程</h2>
				<div>
					当架构师们开开心心的搞定了jsx之后，他们开始思考，我这个jsx人家浏览器又不识别，那应该怎么办呢？
				</div>
				<div>
					于是，<code>webpack</code> 闪亮登场。它的本质是
					一个模块打包工具，可以抽象的理解为 一个 “文件 → 文件”
					的转换器，通过不同的配置，和插件 可以实现很多不同的功能
				</div>
				<div>
					举个例子，webpack 的转换过程可以这样理解：
					<pre>
						<code>{`// 输入：src/app.jsx（浏览器不认识）
function App() {
  return <h1>Hello React</h1>;
}

// ↓ webpack + babel-loader 转换 ↓

// 输出：dist/bundle.js（浏览器能运行）
function App() {
  return React.createElement('h1', null, 'Hello React');
}`}</code>
					</pre>
				</div>
				<div>
					架构师们盯上了 webpack 这个工具，他说，我给你输入jsx，你给我输出js
					并且这个js 是可以直接在浏览器中运行的
					,这里面有一套繁重的规则，他是使用 <code>babel-loader</code> 来实现的
					babel-loader是 webpack 的 loader 之一，它可以将 jsx 转换为
					js，然后让浏览器识别。
					<br />
					loader 是 webpack 的核心之一，它可以将不同的文件转换为 webpack
					可以识别的文件
					因为webpack，只认识js和json，必须要装对应的loader才能识别
					<br />
					举个例子，loader 的配置是这样的：
					<pre>
						<code>{`module.exports = {
  module: {
    rules: [
      {
        test: /\\.(js|jsx)$/,  // 匹配 .js 或 .jsx 文件
        use: {
          loader: 'babel-loader',  // 使用 babel-loader 转换
          options: {
            presets: ['@babel/preset-react']  // 预设：把 JSX 转为 JS
          }
        }
      },
      {
        test: /\\.css$/,  // 匹配 .css 文件
        use: ['style-loader', 'css-loader']  // 先用 css-loader 解析，再用 style-loader 注入
      }
    ]
  }
};`}</code>
					</pre>
				</div>
				<div>
					剩下的核心是 Entry plugin Output Mode
					<br />
					plugin 是 webpack 的插件核心，它可以在 webpack
					的编译过程中，执行一些特定的任务
					<br />
					Entry 是 webpack 的入口，它是指定 webpack 从哪个文件开始编译
					<br />
					Output 是 webpack 的出口，它是指定 webpack 的输出目录和文件名
					<br />
					Mode 是 webpack 的模式，它是指定 webpack 的打包模式
					<br />
					一个完整的 webpack.config.js 配置示例：
					<pre>
						<code>{`const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // Mode：开发模式（development）或生产模式（production）
  mode: 'development',
  
  // Entry：入口文件，webpack 从这里开始编译
  entry: './src/index.jsx',
  
  // Output：输出配置
  output: {
    path: path.resolve(__dirname, 'dist'),  // 输出目录
    filename: 'bundle.js',  // 输出文件名
    clean: true  // 打包前清空 dist 目录
  },
  
  // Module：模块规则（loader 配置）
  module: {
    rules: [
      {
        test: /\\.(js|jsx)$/,
        use: 'babel-loader'
      }
    ]
  },
  
  // Plugins：插件配置
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'  // 自动生成 HTML，并注入打包后的 JS
    })
  ]
};`}</code>
					</pre>
				</div>
				<div>
					当所有的配置都准备好之后，webpack
					会开始编译，把jsx转换为js，然后输出到dist目录下（默认）
					当然这里面的花活就很多了，基本上各种各样有趣或者有想法的功能都可以在这里面实现
					<br />
					执行流程可以这样理解：
					<pre>
						<code>{`1. 读取 entry（入口文件）：src/index.jsx
2. 解析依赖：发现 import App from './app.jsx'
3. 使用 loader 转换：
   - app.jsx → babel-loader → app.js（JSX 转为 JS）
   - app.css → css-loader + style-loader → 注入到 JS 中
4. 打包：把所有模块合并成一个 bundle.js
5. 输出到 output.path：dist/bundle.js
6. 插件执行：HtmlWebpackPlugin 生成 dist/index.html`}</code>
					</pre>
				</div>
				<div>
					这里就可以衍生出前端工具链这个概念（未完待续）
					<br />
					课后作业
					<hr />
					为什么我的webpack可以启动一个服务来跑项目呢？（webpack-dev-server）
					<br />
					为什么我修改了代码，webpack就可以快速知道哪里变了，他就会刷新呢（热更新）
				</div>
			</section>

			<section className="section section-vite">
				<h2>看完之后应该掌握的知识</h2>
				<div>1 理解前端工程化</div>
				<div>2 知道构建工具的本质是什么</div>
				<div>3 能知道mvvm是在干什么</div>
				<div>4 知道webpack的在干什么</div>
				<div>5 能手动的，不依赖脚手架的来搭一个react框架</div>
				<div>6 能理解运行环境的概念</div>
			</section>
		</div>
	);
}

export default App;
