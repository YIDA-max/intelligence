# CustomCascaderApi 使用示例

## 示例 1: 站点/店铺选择器（自动加载数据）

### 原始方式（需要手动加载数据，约 30 行）

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

### 使用 CustomCascaderApi（仅需 5 行，自动加载数据）

```vue
<CustomCascaderApi
	v-model:queryForm="register.state.queryForm"
	componentType="siteStoreId"
	code="storeIds"
	@change="getDataList"
/>
```

**代码减少 83%！** 🎉
**无需手动加载数据，组件自动调用 getData 方法！**

---

## 示例 2: 带查询参数的数据加载

### 通过 prop 传递查询参数（优先级最高）

```vue
<CustomCascaderApi
	v-model:queryForm="register.state.queryForm"
	componentType="siteStoreId"
	:getDataParams="{ platformChannelCode: 'Amazon' }"
	@change="getDataList"
/>
```

### 通过 settings 传递查询参数

```vue
<CustomCascaderApi
	v-model:queryForm="register.state.queryForm"
	componentType="siteStoreId"
	:settings="{
		getDataParams: { platformChannelCode: 'Walmart' },
	}"
	@change="getDataList"
/>
```

### 动态查询参数（响应式）

```vue
<template>
	<div>
		<el-select v-model="platform">
			<el-option label="Amazon" value="Amazon" />
			<el-option label="Walmart" value="Walmart" />
		</el-select>

		<CustomCascaderApi
			v-model:queryForm="queryForm"
			componentType="siteStoreId"
			:getDataParams="{ platformChannelCode: platform }"
			@change="handleChange"
		/>
	</div>
</template>

<script setup>
import { ref } from 'vue';

const platform = ref('Amazon');
const queryForm = ref({ storeIds: [] });

// 当 platform 变化时，组件会自动重新加载数据
</script>
```

---

## 示例 3: 手动传入数据（兼容旧方式）

如果你已经有数据，仍然可以手动传入：

```vue
<CustomCascaderApi
	v-model:queryForm="register.state.queryForm"
	componentType="siteStoreId"
	:data="customData"
	@change="getDataList"
/>
```

**注意：** 当传入 `data` 时，组件不会调用 `getData` 方法。

---

## 示例 4: 实际项目中的使用

```vue
<template>
	<div>
		<el-form :inline="true" :model="register.state.queryForm">
			<AdvancedSearchStyle @reset="resetQuery" @search="getDataList">
				<template #default>
					<!-- 站点/店铺选择器 - 自动加载数据 -->
					<el-form-item>
						<CustomCascaderApi
							v-model:queryForm="register.state.queryForm"
							componentType="siteStoreId"
							@change="getDataList"
						/>
					</el-form-item>

					<!-- 平台仓选择器 - 手动传入数据 -->
					<el-form-item>
						<CustomCascaderApi
							v-model:queryForm="register.state.queryForm"
							text="平台仓"
							code="destWarehouseIds"
							:data="warehouseData"
							@change="getDataList"
							:settings="{
								width: '190px',
							}"
						/>
					</el-form-item>
				</template>
			</AdvancedSearchStyle>
		</el-form>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import CustomCascaderApi from '/@/componentsApi/customCascaderApi/index.vue';
import { getWareHouseList } from '/@/api/materialFlow/track/index';

const warehouseData = ref([]);

// 只需要加载仓库数据，站点数据由组件自动加载
const loadWarehouseData = async () => {
	try {
		const res = await getWareHouseList({ warehouseTypes: [2] });
		warehouseData.value = res.data.map((item: any) => ({
			id: item.warehouseType,
			name: item.warehouseTypeText,
			children: item.warehouses.map((val: any) => ({
				id: val.id,
				name: val.warehouseName,
			})),
		}));
	} catch (error) {
		warehouseData.value = [];
	}
};

onMounted(() => {
	loadWarehouseData();
});
</script>
```

---

## 示例 5: 自定义配置

### 自定义宽度和文本

```vue
<CustomCascaderApi
	v-model:queryForm="queryForm"
	componentType="siteStoreId"
	text="选择站点"
	@change="handleChange"
	:settings="{
		width: '250px',
	}"
/>
```

### 启用全选功能

```vue
<CustomCascaderApi
	v-model:queryForm="queryForm"
	componentType="siteStoreId"
	@change="handleChange"
	:settings="{
		showSelectAll: true,
	}"
/>
```

### 严格的父子分离

```vue
<CustomCascaderApi
	v-model:queryForm="queryForm"
	componentType="siteStoreId"
	@change="handleChange"
	:settings="{
		checkStrictly: true,
	}"
/>
```

---

## 示例 6: 完全自定义（不使用 componentType）

```vue
<CustomCascaderApi
	v-model:queryForm="queryForm"
	text="自定义级联选择"
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
		maxTagsToShow: 2,
		showSelectAll: true,
		checkStrictly: false,
	}"
/>
```

---

## 配置对比

| 特性         | 原始方式 | CustomCascaderApi |
| ------------ | -------- | ----------------- |
| 代码行数     | 30+ 行   | 5 行              |
| 配置复用     | ❌       | ✅                |
| 自动加载数据 | ❌       | ✅                |
| 易于维护     | ❌       | ✅                |
| 类型安全     | ⚠️       | ✅                |

---

**最后更新**: 2026-02-13
