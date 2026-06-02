# TreeSelectInputApi 组件

> 基于 TreeSelectInput 的简单封装，提供配置复用和更简洁的 API

## 🚀 快速开始

```vue
<template>
	<TreeSelectInputApi
		v-model:queryForm="queryForm"
		componentType="userList"
		:searchFn="handleSearch"
	/>
</template>

<script setup lang="ts">
import TreeSelectInputApi from '/@/componentsApi/TreeSelectInputApi/index.vue';

const queryForm = ref({ createNames: [] });
const handleSearch = async (data: any) => {
	console.log('Selected:', data);
};
</script>
```

## ✨ 核心特性

### 1. 配置复用

通过 `componentType` 加载预设配置，避免重复代码

### 2. 代码简化

从 15 行减少到 4 行，代码减少 73%

**原来：**

```vue
<TreeSelectInput
	v-model:queryForm="queryForm"
	:settings="{
		getTreeData: getUserListByCondition,
		text: '金蝶单据创建人',
		searchFn: handleSearch,
		code: 'createNames',
		width: '220px',
		selectTreeProps: {
			value: 'name',
			label: 'name',
			children: 'children',
		},
		getIdsCode: 'name',
	}"
/>
```

**现在：**

```vue
<TreeSelectInputApi
	v-model:queryForm="queryForm"
	componentType="userList"
	:searchFn="handleSearch"
/>
```

### 3. 配置覆盖

支持自定义配置覆盖内置配置

```vue
<TreeSelectInputApi
	v-model:queryForm="queryForm"
	componentType="userList"
	:searchFn="handleSearch"
	:settings="{
		width: '300px',
		text: '选择用户',
	}"
/>
```

## 📋 Props

| 参数            | 说明                                             | 类型       | 默认值  | 优先级 |
| --------------- | ------------------------------------------------ | ---------- | ------- | ------ |
| queryForm       | 查询表单对象（必填）                             | `Object`   | -       | -      |
| componentType   | 组件类型，用于加载预设配置                       | `String`   | `''`    | -      |
| settings        | 自定义配置，会与内置配置深度合并                 | `Object`   | `{}`    | 中     |
| text            | 显示文本（可在 prop 或 settings 中使用）         | `String`   | -       | 高     |
| code            | queryForm 字段名（可在 prop 或 settings 中使用） | `String`   | -       | 高     |
| searchFn        | 搜索回调函数（可在 prop 或 settings 中使用）     | `Function` | -       | 高     |
| disabled        | 是否禁用                                         | `Boolean`  | `false` | -      |
| showInputSearch | 是否显示搜索框                                   | `Boolean`  | `true`  | -      |

### 参数优先级说明

`text`、`code`、`searchFn` 这三个参数支持两种使用方式：

1. **在 prop 一级使用**（推荐，优先级最高）

```vue
<TreeSelectInputApi
	componentType="userList"
	text="选择用户"
	code="userIds"
	:searchFn="handleSearch"
/>
```

2. **在 settings 中使用**（优先级较低）

```vue
<TreeSelectInputApi
	componentType="userList"
	:settings="{
		text: '选择用户',
		code: 'userIds',
		searchFn: handleSearch,
	}"
/>
```

**配置优先级**（从低到高）：

1. 默认配置（`defaultConfig.ts`）
2. 文件配置（`confige/{componentType}.ts`）
3. Props 的 `settings` 对象
4. Props 一级参数（`text`、`code`、`searchFn`）← 最高优先级

## 📦 当前可用配置

| 配置名     | 说明         | 使用示例                                                              |
| ---------- | ------------ | --------------------------------------------------------------------- |
| `userList` | 用户列表     | `<TreeSelectInputApi componentType="userList" />`                     |
| `dicts`    | 字典（通用） | `<TreeSelectInputApi componentType="dicts" dictType="bill_status" />` |

## 🔧 添加新配置

在 `confige/` 目录下创建新的配置文件：

```typescript
// confige/warehouse.ts
import type { TreeSelectInputSettings } from '../types';
import { getWarehouseList } from '/@/api/warehouse';

export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: getWarehouseList,
	getTreeDataParams: {
		status: 1,
	},
	text: '仓库',
	code: 'warehouseIds',
	width: '220px',
	selectTreeProps: {
		value: 'id',
		label: 'name',
		children: 'children',
	},
	getIdsCode: 'id',
};

export function preConfigDefault(
	configData: Partial<TreeSelectInputSettings>,
	props: Record<string, any>
) {
	// 可以根据 props 动态调整配置
	return configData;
}
```

使用：

```vue
<TreeSelectInputApi
	v-model:queryForm="queryForm"
	componentType="warehouse"
	:searchFn="handleSearch"
/>
```

## 🎯 使用场景

### 场景 1: 标准选择器（推荐）

```vue
<TreeSelectInputApi
	v-model:queryForm="queryForm"
	componentType="userList"
	:searchFn="handleSearch"
/>
```

### 场景 2: 覆盖部分配置（使用 prop 一级参数）

```vue
<TreeSelectInputApi
	v-model:queryForm="queryForm"
	componentType="userList"
	text="选择创建人"
	code="createUserIds"
	:searchFn="handleSearch"
/>
```

### 场景 3: 覆盖部分配置（使用 settings）

```vue
<TreeSelectInputApi
	v-model:queryForm="queryForm"
	componentType="userList"
	:searchFn="handleSearch"
	:settings="{
		width: '300px',
		getTreeDataParams: {
			lockFlag: 0,
			deptId: currentDeptId,
		},
	}"
/>
```

### 场景 4: 混合使用（prop 优先级更高）

```vue
<TreeSelectInputApi
	v-model:queryForm="queryForm"
	componentType="userList"
	text="选择用户"
	:searchFn="handleSearch"
	:settings="{
		text: '这个会被覆盖',
		width: '300px',
	}"
/>
<!-- 最终 text 为 "选择用户"，width 为 "300px" -->
```

### 场景 5: 字典选择器

```vue
<TreeSelectInputApi
	v-model:queryForm="queryForm"
	componentType="dicts"
	dictType="bill_status"
	text="生成单据状态"
	code="billStatuses"
	:searchFn="handleSearch"
/>
```

### 场景 6: 完全自定义（不使用 componentType）

```vue
<TreeSelectInputApi
	v-model:queryForm="queryForm"
	text="自定义选择器"
	code="customCodes"
	:searchFn="handleSearch"
	:settings="{
		getTreeData: customApi,
		width: '250px',
		selectTreeProps: {
			value: 'id',
			label: 'name',
			children: 'children',
		},
		getIdsCode: 'id',
	}"
/>
```

## 📚 配置优先级

配置的合并优先级从低到高：

1. **默认配置**（`defaultConfig.ts`）- 最低优先级
2. **文件配置**（`confige/{componentType}.ts`）
3. **Props 的 settings 对象**
4. **Props 一级参数**（`text`、`code`、`searchFn`）- 最高优先级

### 示例

```vue
<!-- 配置文件 userList.ts 中定义：text: '金蝶单据创建人' -->
<!-- settings 中定义：text: '选择用户' -->
<!-- prop 一级定义：text="创建人" -->

<TreeSelectInputApi
	componentType="userList"
	text="创建人"
	:settings="{
		text: '选择用户',
		width: '300px',
	}"
/>

<!-- 最终结果：
  text: '创建人' (来自 prop 一级，优先级最高)
  width: '300px' (来自 settings)
  其他配置来自 userList.ts
-->
```

高优先级的配置会覆盖低优先级的配置，对象类型会进行深度合并。

## 📖 详细文档

更多详细文档请查看 `doc/` 目录：

- [快速开始](./doc/START_HERE.md)
- [完整文档](./doc/README.md)
- [使用示例](./doc/example.md)
- [架构设计](./doc/ARCHITECTURE.md)

---

**版本**: 1.0.0  
**最后更新**: 2026-02-11  
**维护者**: 开发团队
