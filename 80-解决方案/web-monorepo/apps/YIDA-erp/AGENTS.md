# AGENTS.md - 千易 UI (qianyi-ui)

> AI Agent 协作指南。PIGCLOUD 微服务开发平台前端。

## 技术栈

- **Vue 3.4.15** + Composition API + `<script setup>`
- **TypeScript 5.9.2**
- **Element Plus 2.10.3**（UI 组件库）
- **Pinia 2.0.32**（状态管理）
- **Vue Router 4.x**（路由）
- **Vite 4.3.3**（构建工具）
- **Tailwind CSS 3.4.17**（样式）
- **Vue i18n 9.2.2**（国际化）
- **Axios**（HTTP 客户端）

---

## 开发命令

```bash
# 安装依赖（使用 pnpm - Volta 已配置）
pnpm install

# 开发
pnpm dev                    # 启动开发服务器（默认端口 8888）
pnpm dev 3000              # 指定端口启动

# 构建
pnpm build                  # 生产环境构建
pnpm build dev              # 开发环境构建
pnpm build:analyze           # 构建并分析包体积

# 代码检查与格式化
pnpm lint                    # ESLint + TypeScript 检查
pnpm lint:fix                # ESLint 自动修复
pnpm lint:tsc                # TypeScript 类型检查
pnpm prettier                # 格式化所有文件
pnpm p                       # 格式化未暂存文件

# 提交
pnpm commit                  # 使用 Commitizen 交互式提交
```

### Git Hooks (lint-staged)

提交时会自动执行：

1. ESLint 修复
2. Prettier 格式化
3. TypeScript 检查

---

## 代码风格

### 通用规范

- **缩进**：2 空格
- **引号**：单引号
- **分号**：语句末尾需要分号
- **注释**：使用中文
- 变量/函数名使用英文

### Prettier 配置 (.prettierrc.js)

```javascript
{
  printWidth: 80,
  tabWidth: 2,
  useTabs: true,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'lf'
}
```

### ESLint 规则要点

- `no-console`: **error**（禁止 console.log）
- `no-debugger`: **error**（禁止 debugger 语句）
- `no-unused-vars`: **error**
- `@typescript-eslint/no-unused-vars`: **error**
- `vue/no-mutating-props`: **error**（禁止直接修改 props）
- `vue/no-v-html`: **warn**（XSS 风险）
- `no-redeclare`: **error**

---

## Vue 组件规范

### 文件命名

- 组件：`PascalCase.vue`（如 `UserProfile.vue`）
- 普通文件：`kebab-case.ts`（如 `use-user.ts`）

### Script Setup 语法

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

interface Props {
	modelValue?: boolean;
	title?: string;
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: false,
	title: '',
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void;
	(e: 'confirm'): void;
}>();
</script>
```

### Props/Emits 类型定义

使用 TypeScript 泛型语法（不用对象语法）：

```typescript
defineProps<{ modelValue?: boolean }>();
defineEmits<{ (e: 'update:modelValue', value: boolean): void }>();
```

---

## TypeScript 规范

- **接口**：`I` 前缀（如 `interface IUserInfo`）
- **类型别名**：PascalCase（如 `type UserRole = 'admin' | 'user'`）
- **枚举**：PascalCase
- 尽量避免 `any`，优先使用严格类型
- API 响应必须定义类型

```typescript
interface IApiResponse<T = any> {
	code: number;
	msg: string;
	data: T;
}
```

---

## 项目结构

```
src/
├── api/                    # API 定义（axios 封装）
│   ├── admin/             # 系统管理 API
│   ├── warehouse/         # 仓库 API
│   └── ...
├── assets/                # 静态资源
├── components/            # 公共组件
├── componentsApi/         # 组件 API 配置
├── directive/             # 自定义指令
├── enum/                  # 枚举
├── hooks/                 # 可复用组合式函数
│   ├── table.ts           # 表格 hook（useTable）
│   └── ...
├── layout/                 # 应用布局组件
├── router/                 # Vue Router 配置
├── stores/                 # Pinia 状态管理
│   ├── userInfo.ts
│   └── ...
├── theme/                 # Element Plus 主题覆盖
├── types/                 # TypeScript 类型定义
├── utils/                 # 工具函数
│   ├── request.ts         # Axios 实例
│   └── ...
├── views/                 # 页面组件
│   └── ...
├── App.vue
└── main.ts
```

---

## Pinia Store 规范

- 文件命名：`useXxxStore.ts`（如 `useUserStore.ts`）
- 使用 Setup Store 语法（函数式）

```typescript
// stores/userInfo.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
	const token = ref('');

	const setToken = (newToken: string) => {
		token.value = newToken;
	};

	return { token, setToken };
});
```

---

## API 请求规范

```typescript
// src/api/admin/user.ts
import request from '/@/utils/request';

export const pageList = (params?: object) => {
	return request({
		url: '/admin/user/page',
		method: 'get',
		params,
	});
};

export const addObj = (obj: object) => {
	return request({
		url: '/admin/user',
		method: 'post',
		data: obj,
	});
};
```

---

## Hooks（src/hooks/）

### useTable（table.ts）

表格功能的主要 hook：

```typescript
const {
	tableStyle,
	getDataList,
	getDataListDebounced, // 300ms 防抖
	getDataListThrottled, // 800ms 节流
	resetTableQuery,
	sizeChangeHandle,
	currentChangeHandle,
	sortChangeHandle,
} = useTable(options, tableRef);
```

---

## Element Plus 使用规范

- 使用自动导入（unplugin-auto-import 自动处理大部分）
- 图标：`@element-plus/icons-vue`
- 消息提示：`ElMessage`、`ElNotification`、`ElMessageBox`
- 表单：使用 Element Plus 验证规则

---

## 国际化（i18n）

```typescript
// 模板中
$t('menu.home');

// setup 中
const { t } = useI18n();
const message = t('common.submit');
```

---

## 性能优化

- v-for 必须使用 `:key` 绑定唯一标识
- 使用路由级代码分割：`component: () => import('@/views/xxx.vue')`
- 重组件使用懒加载
- 大列表考虑虚拟滚动
- 清理定时器/debounce/throttle 在 `onBeforeUnmount` 中处理

---

## Git 提交规范

使用 Commitizen（交互式提示）：

```
<type>(<scope>): <subject>

类型：feat, fix, docs, style, refactor, test, chore
示例：feat(warehouse): 添加仓库管理页面
```

---

## 常用代码模式

### 异步函数错误处理

```typescript
try {
	const res = await apiCall();
	// 处理成功
} catch (err: any) {
	ElMessage.error(err.msg || err.data?.msg || '请求失败');
}
```

### Ref vs Reactive

- 原始类型：`ref()`
- 对象/数组：`ref()` 或 `reactive()`
- 为保持一致性，优先使用 `ref()`

### 空值检查

```typescript
// 可选链
value?.property;

// 空值合并
value ?? 'default';

// 非空断言（慎用）
value!.property;
```

---

## 路径别名

```typescript
// tsconfig.json 配置
'/@/*': ['src/*']

// 使用示例
import userApi from '/@/api/admin/user';
import { useUserStore } from '/@/stores/userInfo';
```

---

## 禁止事项

- ❌ 使用 Vue 2 Options API
- ❌ 直接修改 props
- ❌ 循环中使用 index 作为 `:key`
- ❌ 使用 `console.log` / `debugger`
- ❌ 绕过 ESLint（禁止 eslint-disable）
- ❌ 提交未格式化的代码

---

## 环境变量

前缀：`VITE_`

```
VITE_APP_ENV=development|production
```

敏感信息存储在 `.env` 文件中，切勿提交到仓库。
