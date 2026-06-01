# customCascaderApi 配置说明

## 📋 当前配置

### siteStoreId - 站点/店铺选择器（支持自动加载数据）

- **字段映射**: `id/name/children`
- **默认参数**: `{ checkStrictly: false, showSelectAll: false }`
- **数据加载**: 自动调用 `getData` 方法从 API 获取数据
- **使用方式**:

```vue
<!-- 自动加载数据（推荐） -->
<CustomCascaderApi
	v-model:queryForm="queryForm"
	componentType="siteStoreId"
	@change="handleChange"
/>

<!-- 带查询参数 -->
<CustomCascaderApi
	v-model:queryForm="queryForm"
	componentType="siteStoreId"
	:getDataParams="{ platformChannelCode: 'Amazon' }"
	@change="handleChange"
/>

<!-- 手动传入数据（兼容旧方式） -->
<CustomCascaderApi
	v-model:queryForm="queryForm"
	componentType="siteStoreId"
	:data="storeData"
	@change="handleChange"
/>
```

## 🔧 添加新配置

### 步骤 1: 创建配置文件（不带数据加载）

在 `confige/` 目录下创建新文件，例如 `warehouse.ts`：

```typescript
import type { CustomCascaderSettings } from '../types';

export const defaultConfigData: Partial<CustomCascaderSettings> = {
	code: 'warehouseIds',
	text: '仓库',
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
	return configData;
}
```

### 步骤 2: 创建配置文件（带自动数据加载）

推荐方式，添加 `getData` 方法实现自动数据加载：

```typescript
import type { CustomCascaderSettings } from '../types';
import { getWarehouseList } from '/@/api/warehouse/index';

export const defaultConfigData: Partial<CustomCascaderSettings> = {
	code: 'warehouseIds',
	text: '仓库',
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
	return configData;
}

/**
 * 获取仓库数据
 * @param params - 查询参数，可选传入 warehouseType 等参数
 * @returns 返回格式化后的仓库树形数据，失败或无数据返回空数组
 */
export async function getData(params?: Record<string, any>): Promise<any[]> {
	try {
		const res = await getWarehouseList(params || {});
		if (!res?.data || !Array.isArray(res.data)) {
			return [];
		}
		// 根据实际 API 返回的数据结构进行转换
		return res.data.map((item: any) => ({
			id: item.id,
			name: item.warehouseName,
			children:
				item.subWarehouses?.map((sub: any) => ({
					id: sub.id,
					name: sub.warehouseName,
				})) || [],
		}));
	} catch (error) {
		console.error('Failed to load warehouse data:', error);
		return [];
	}
}
```

### 步骤 3: 使用配置

```vue
<!-- 自动加载数据 -->
<CustomCascaderApi
	v-model:queryForm="queryForm"
	componentType="warehouse"
	@change="handleChange"
/>

<!-- 带查询参数 -->
<CustomCascaderApi
	v-model:queryForm="queryForm"
	componentType="warehouse"
	:getDataParams="{ warehouseType: 2 }"
	@change="handleChange"
/>

<!-- 手动传入数据 -->
<CustomCascaderApi
	v-model:queryForm="queryForm"
	componentType="warehouse"
	:data="warehouseData"
	@change="handleChange"
/>
```

## 📝 配置规范

### 必填字段

- `code` - queryForm 中的字段名
- `text` - 显示文本
- `props` - 字段映射

### 可选字段

- `width` - 组件宽度（默认 280px）
- `maxTagsToShow` - 最大显示标签数（默认 1）
- `showSelectAll` - 是否显示全选（默认 false）
- `checkStrictly` - 是否严格的父子分离（默认 false）
- `emitPath` - 是否返回完整路径（默认 false）
- `getDataParams` - 获取数据的查询参数（可在 settings 中配置）

### 字段映射说明

根据数据结构配置 `props`：

```typescript
// 数据结构
{
  "id": 1,
  "name": "站点A",
  "children": [...]
}

// 配置
props: {
  value: 'id',      // 节点值字段
  label: 'name',    // 节点显示字段
  children: 'children'  // 子节点字段
}
```

## 🎯 getData 方法规范

### 方法签名

```typescript
export async function getData(params?: Record<string, any>): Promise<any[]>;
```

### 参数说明

- `params` - 可选的查询参数对象，由组件的 `getDataParams` prop 或 settings 传入

### 返回值

- 必须返回数组类型
- 失败或无数据时返回空数组 `[]`
- 数据格式需要符合配置的 `props` 字段映射

### 实现要点

1. **错误处理**: 使用 try-catch 捕获异常，返回空数组
2. **数据验证**: 检查 API 返回的数据是否有效
3. **数据转换**: 将 API 数据转换为组件需要的格式
4. **日志记录**: 记录错误信息便于调试

### 完整示例

```typescript
import type { CustomCascaderSettings } from '../types';
import { getGroupStoreByPlatform } from '/@/api/base/store/index';

export const defaultConfigData: Partial<CustomCascaderSettings> = {
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
};

export function preConfigDefault(
	configData: Partial<CustomCascaderSettings>,
	props: Record<string, any>
) {
	if (!props) return configData;
	return configData;
}

/**
 * 获取站点/店铺数据
 * @param params - 查询参数，可选传入 platformChannelCode 等参数
 * @returns 返回格式化后的站点店铺树形数据，失败或无数据返回空数组
 */
export async function getData(params?: Record<string, any>): Promise<any[]> {
	try {
		// 1. 调用 API
		const res = await getGroupStoreByPlatform(params || {});

		// 2. 验证数据
		if (!res?.data || !Array.isArray(res.data)) {
			return [];
		}

		// 3. 转换数据格式
		return res.data.map((item: any) => ({
			id: item.siteCode,
			name: item.siteCode,
			children:
				item.stores?.map((val: any) => ({
					id: val.id,
					name: val.storeName,
				})) || [],
		}));
	} catch (error) {
		// 4. 错误处理
		console.error('Failed to load store data:', error);
		return [];
	}
}
```

## 💡 最佳实践

### 1. 优先使用自动数据加载

```vue
<!-- ✅ 推荐：自动加载 -->
<CustomCascaderApi
	v-model:queryForm="queryForm"
	componentType="siteStoreId"
	@change="handleChange"
/>

<!-- ❌ 不推荐：手动加载 -->
<CustomCascaderApi
	v-model:queryForm="queryForm"
	componentType="siteStoreId"
	:data="storeData"
	@change="handleChange"
/>
```

### 2. 使用查询参数过滤数据

```vue
<!-- 根据平台过滤店铺 -->
<CustomCascaderApi
	v-model:queryForm="queryForm"
	componentType="siteStoreId"
	:getDataParams="{ platformChannelCode: selectedPlatform }"
	@change="handleChange"
/>
```

### 3. 响应式查询参数

```vue
<template>
	<div>
		<el-select v-model="platform">
			<el-option label="Amazon" value="Amazon" />
			<el-option label="Walmart" value="Walmart" />
		</el-select>

		<!-- 当 platform 变化时，组件会自动重新加载数据 -->
		<CustomCascaderApi
			v-model:queryForm="queryForm"
			componentType="siteStoreId"
			:getDataParams="{ platformChannelCode: platform }"
			@change="handleChange"
		/>
	</div>
</template>

<script setup>
const platform = ref('Amazon');
</script>
```

### 4. 配置优先级

```vue
<!-- prop 级别的 getDataParams 优先级最高 -->
<CustomCascaderApi
	v-model:queryForm="queryForm"
	componentType="siteStoreId"
	:getDataParams="{ platformChannelCode: 'Amazon' }"
	:settings="{
		getDataParams: { platformChannelCode: 'Walmart' }, // 会被 prop 覆盖
	}"
	@change="handleChange"
/>
```

---

**最后更新**: 2026-02-13
