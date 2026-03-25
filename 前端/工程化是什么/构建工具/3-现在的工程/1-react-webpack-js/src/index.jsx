/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-03-12 18:47:44
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-03-12 19:05:44
 * @FilePath: \qianyi-ui\intelligence\工程化是什么\构建工具\3-现在的工程\1-react-js\src\index.jsx
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
// 引入组件
import App from './app.jsx';
// 获取根元素
const container = document.getElementById('root');
// 创建根节点
const root = createRoot(container); // 现在的 React 19 必须这样用
// 渲染组件
root.render(<App />);
