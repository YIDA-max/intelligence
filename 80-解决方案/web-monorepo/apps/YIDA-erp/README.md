# qianyi-ui

一个基于 [Vite](https://vitejs.dev/) 构建的现代化前端 UI 项目。

## 📋 项目说明

本项目包含两个核心脚本用于开发和构建：

- `scripts/dev.mjs` - 本地开发服务器启动脚本
- `scripts/build.mjs` - 生产构建脚本

## 📦 快速开始

### 前置要求

- Node.js >= 18.x
- npm / pnpm / yarn（推荐 pnpm）

### 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

---

## ▶️ 本地开发

启动本地开发服务器：

```bash
# 默认端口 8888
npm run dev

# 指定端口（例如 3000）
npm run dev 3000
```

**功能说明：**

- 启动 Vite 开发服务器
- 支持热更新 (HMR)
- 可通过命令行参数指定端口号
- 默认端口为 8888
- 进程错误和退出状态会被正确处理

---

## 🧱 构建项目

构建生产版本：

```bash
# 开发环境构建
npm run build dev

# 生产环境构建（默认）
npm run build
# 或
npm run build prod
```

**功能说明：**

- 支持不同环境构建（dev/production）
- 自动设置环境变量 `VITE_APP_ENV`
- 构建时增加内存限制（4096MB）
- 显示构建进度和耗时信息
- 构建失败时返回错误码

---

## 🛠️ 脚本说明

### 开发脚本 (`scripts/dev.mjs`)

- **功能**：启动本地开发服务器
- **参数**：端口号（可选，默认 8888）
- **用法**：`node scripts/dev.mjs [port]`
- **特点**：子进程继承父进程的输入输出流

### 构建脚本 (`scripts/build.mjs`)

- **功能**：执行生产构建
- **参数**：环境标识（可选，dev/prod，默认 dev）
- **用法**：`npm run build [environment]`
- **特点**：支持环境变量配置，显示构建耗时统计

---

## 🌐 环境变量

项目通过以下环境变量区分运行环境：

- **VITE_APP_ENV**: 构建环境标识
  - `development` - 开发环境
  - `production` - 生产环境

---

## 📁 项目结构

```
qianyi-ui/
├── public/               # 静态资源（不经过构建）
├── src/                  # 源代码目录
│   ├── assets/           # 静态资源
│   ├── components/       # 组件
│   ├── views/            # 页面视图
│   └── ...
├── scripts/              # 构建脚本
│   ├── dev.mjs           # 开发服务器脚本
│   └── build.mjs         # 构建脚本
├── dist/                 # 构建输出目录
├── index.html            # 入口 HTML 文件
├── vite.config.js        # Vite 配置文件
├── package.json          # 项目配置
└── README.md             # 项目说明
```

---

## 🚀 部署

构建完成后，`dist/` 目录中的文件可以直接部署到任何静态文件服务器。

```bash
# 构建生产版本
npm run build prod

# 构建文件位于 dist/ 目录
ls dist/
```

---

## 📄 License

Copyright (c) 2025-present. All rights reserved.

---
