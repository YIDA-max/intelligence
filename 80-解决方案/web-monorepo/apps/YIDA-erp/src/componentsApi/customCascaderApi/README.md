# CustomCascaderApi 组件

> 基于 CustomCascader 的简单封装，提供配置复用、自动数据加载和更简洁的 API

## 🚀 快速开始

```vue
<template>
	<CustomCascaderApi
		v-model:queryForm="queryForm"
		componentType="siteStoreId"
		@change="handleChange"
	/>
</template>

<script setup lang="ts">
import CustomCascaderApi from '/@/componentsApi/customCascaderApi/index.vue';

const queryForm = ref({ storeIds: [] });

const handleChange = (value: any) => {
	console.log('Selected:', value);
};
</script>
```

**无需手动加载数据！** 组件会自动调用配置文件中的 `getData` 方法获取数据。

## ✨ 核心特性

### 1. 自动数据加载

组件会自动调用配置文件中的 `getData` 方法，无需手动加载数据

### 2. 配置复用

通过 `componentType` 加载预设配置，避免重复代码

### 3. 代码简化

从 30+ 行减少到 5 行，代码减少 83%

**原来：**

```vue
<template>
	<custom-cascader
		v-model:queryForm="register.state.queryForm"
		:data="storeData"
		:settings="{
			code: 'storeIds',
			text: '站点/店铺',
			width: '190px',
			props: {
				value: 'id',
				label: 'name',
				children: 'children',
			},
			checkStrictly: false,
			showSelectAll: false,
		}"
		@change="getDataList"
	/>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getGroupStoreByPlatform } from '/@/api/base/store/index';

const storeData = ref([]);

const loadStoreData = async () => {
	try {
		const res = await getGroupStoreByPlatform({});
		storeData.value = res.data.map((item: any) => ({
			id: item.siteCode,
			name: item.siteCode,
			children: item.stores.map((val: any) => ({
				id: val.id,
				name: val.storeName,
			})),
		}));
	} catch (error) {
		storeData.value = [];
	}
};

onMounted(() => {
	loadStoreData();
});
</script>
```

**现在：**

```vue
<CustomCascaderApi
	v-model:queryForm="register.state.queryForm"
	componentType="siteStoreId"
	@change="getDataList"
/>
```

## 📋 Props

| 参数          | 说明                                               | 类型      | 默认值  | 优先级          |
| ------------- | -------------------------------------------------- | --------- | ------- | --------------- |
| queryForm     | 查询表单对象（必填）                               | `Object`  | -       | -               |
| data          | 数据源（可选，如果不传则自动调用 getData）         | `Array`   | `[]`    | -               |
| componentType | 组件类型，用于加载预设配置                         | `String`  | `''`    | -               |
| settings      | 自定义配置，会与内置配置深度合并                   | `Object`  | `{}`    | 中              |
| text          | 显示文本（可在 prop 或 settings 中使用）           | `String`  | -       | 高              |
| code          | queryForm 字段名（可在 prop 或 settings 中使用）   | `String`  | -       | 高              |
| getDataParams | 获取数据的查询参数（可在 prop 或 settings 中使用） | `Object`  | `{}`    | prop > settings |
| showError     | 是否显示错误状态                                   | `Boolean` | `false` | -               |

## 📦 当前可用配置

| 配置名        | 说明                            | 使用示例                                            |
| ------------- | ------------------------------- | --------------------------------------------------- |
| `siteStoreId` | 站点/店铺选择器（自动加载数据） | `<CustomCascaderApi componentType="siteStoreId" />` |

## 🎯 使用场景

### 场景 1: 标准选择器（推荐，自动加载数据）

```vue
<CustomCascaderApi
	v-model:queryForm="queryForm"
	componentType="siteStoreId"
	@change="handleChange"
/>
```

### 场景 2: 带查询参数（通过 prop，优先级最高）

```vue
<CustomCascaderApi
	v-model:queryForm="queryForm"
	componentType="siteStoreId"
	:getDataParams="{ platformChannelCode: 'Amazon' }"
	@change="handleChange"
/>
```

### 场景 3: 带查询参数（通过 settings）

```vue
<CustomCascaderApi
	v-model:queryForm="queryForm"
	componentType="siteStoreId"
	:settings="{
		getDataParams: { platformChannelCode: 'Walmart' },
	}"
	@change="handleChange"
/>
```

### 场景 4: 覆盖部分配置

```vue
<CustomCascaderApi
	v-model:queryForm="queryForm"
	componentType="siteStoreId"
	text="选择店铺"
	@change="handleChange"
	:settings="{
		width: '250px',
		showSelectAll: true,
	}"
/>
```

### 场景 5: 手动传入数据（兼容旧方式）

```vue
<CustomCascaderApi
	v-model:queryForm="queryForm"
	componentType="siteStoreId"
	:data="customData"
	@change="handleChange"
/>
```

**注意：** 当传入 `data` 时，组件不会调用 `getData` 方法。

### 场景 6: 完全自定义（不使用 componentType）

```vue
<CustomCascaderApi
	v-model:queryForm="queryForm"
	text="自定义选择器"
	code="customIds"
	:data="customData"
	@change="handleChange"
	:settings="{
		width: '300px',
		props: {
			value: 'id',
			label: 'name',
			children: 'children',
		},
		checkStrictly: true,
	}"
/>
```

## 📚 配置优先级

配置的合并优先级从低到高：

1. **默认配置**（`defaultConfig.ts`）- 最低优先级
2. **文件配置**（`confige/{componentType}.ts`）
3. **Props 的 settings 对象**
4. **Props 一级参数**（`text`、`code`、`getDataParams`）- 最高优先级

## 🔧 如何创建新的配置文件

在 `confige/` 目录下创建新的配置文件，例如 `myConfig.ts`：

```typescript
import type { CustomCascaderSettings } from '../types';
import { getMyData } from '/@/api/myApi';

export const defaultConfigData: Partial<CustomCascaderSettings> = {
	code: 'myIds',
	text: '我的选择器',
	width: '190px',
	props: {
		value: 'id',
		label: 'name',
		children: 'children',
	},
	checkStrictly: false,
	showSelectAll: false,
};

export function preConfigDefault(
	configData: Partial<CustomCascaderSettings>,
	props: Record<string, any>
) {
	if (!props) return configData;
	return configData;
}

/**
 * 获取数据
 * @param params - 查询参数
 * @returns 返回格式化后的树形数据，失败或无数据返回空数组
 */
export async function getData(params?: Record<string, any>): Promise<any[]> {
	try {
		const res = await getMyData(params || {});
		if (!res?.data || !Array.isArray(res.data)) {
			return [];
		}
		return res.data.map((item: any) => ({
			id: item.id,
			name: item.name,
			children: item.children || [],
		}));
	} catch (error) {
		console.error('Failed to load data:', error);
		return [];
	}
}
```

然后使用：

```vue
<CustomCascaderApi
	v-model:queryForm="queryForm"
	componentType="myConfig"
	@change="handleChange"
/>
```

---

**版本**: 2.0.0  
**最后更新**: 2026-02-13  
**维护者**: 开发团队
