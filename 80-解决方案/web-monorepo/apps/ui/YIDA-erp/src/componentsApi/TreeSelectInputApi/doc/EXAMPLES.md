# TreeSelectInputApi 使用示例

## 示例 1: 用户列表选择器

### 最简单的用法

```vue
<TreeSelectInputApi
	v-model:queryForm="queryForm"
	componentType="userList"
	:searchFn="handleSearch"
/>
```

### 自定义文本和字段名

```vue
<TreeSelectInputApi
	v-model:queryForm="queryForm"
	componentType="userList"
	text="选择创建人"
	code="createUserIds"
	:searchFn="handleSearch"
/>
```

### 添加额外的 API 参数

```vue
<TreeSelectInputApi
	v-model:queryForm="queryForm"
	componentType="userList"
	:searchFn="handleSearch"
	:settings="{
		getTreeDataParams: {
			lockFlag: 0,
			deptId: currentDeptId,
		},
	}"
/>
```

---

## 示例 2: 字典选择器

### 单据状态字典

```vue
<TreeSelectInputApi
	v-model:queryForm="queryForm"
	componentType="dicts"
	text="生成单据状态"
	code="billStatuses"
	:searchFn="handleSearch"
	:settings="{
		getTreeDataParams: 'bill_status',
	}"
/>
```

### 订单状态字典

```vue
<TreeSelectInputApi
	v-model:queryForm="queryForm"
	componentType="dicts"
	text="订单状态"
	code="orderStatuses"
	:searchFn="handleSearch"
	:settings="{
		getTreeDataParams: 'order_status',
	}"
/>
```

### 支付方式字典

```vue
<TreeSelectInputApi
	v-model:queryForm="queryForm"
	componentType="dicts"
	text="支付方式"
	code="paymentMethods"
	:searchFn="handleSearch"
	:settings="{
		getTreeDataParams: 'payment_method',
	}"
/>
```

---

## 示例 3: 实际项目中的使用

### 在列表页面的筛选条件中使用

```vue
<template>
	<div>
		<el-form :inline="true" :model="register.state.queryForm">
			<AdvancedSearchStyle @reset="resetQuery" @search="getDataList">
				<template #default>
					<!-- 用户选择器 -->
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="register.state.queryForm"
							componentType="userList"
							text="金蝶单据创建人"
							code="createNames"
							:searchFn="register?.getDataList"
						/>
					</el-form-item>

					<!-- 字典选择器 -->
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="register.state.queryForm"
							componentType="dicts"
							text="生成单据状态"
							code="billStatuses"
							:searchFn="register?.getDataList"
							:settings="{
								getTreeDataParams: 'bill_status',
							}"
						/>
					</el-form-item>

					<!-- 其他筛选条件... -->
				</template>
			</AdvancedSearchStyle>
		</el-form>

		<!-- 表格... -->
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TreeSelectInputApi from '/@/componentsApi/TreeSelectInputApi/index.vue';
import { useTable } from '/@/components/BaseTable/hooks/BaseTable';

const state = {
	queryForm: {
		createNames: [],
		billStatuses: [],
	},
	pageList: getDataList,
	// ...
};

const { register, getDataList } = useTable(state);

const resetQuery = () => {
	register.state.queryForm = {
		createNames: [],
		billStatuses: [],
	};
	getDataList();
};
</script>
```

---

## 示例 4: 对比原始方式

### 原始方式（15 行）

```vue
<TreeSelectInput
	v-model:queryForm="register.state.queryForm"
	:settings="{
		getTreeData: getDicts,
		getTreeDataParams: 'bill_status',
		text: '生成单据状态',
		searchFn: register?.getDataList,
		code: 'billStatuses',
		width: '220px',
		selectTreeProps: {
			value: 'value',
			label: 'label',
			children: 'children',
		},
		getIdsCode: 'label',
	}"
/>
```

### 使用 TreeSelectInputApi（7 行）

```vue
<TreeSelectInputApi
	v-model:queryForm="register.state.queryForm"
	componentType="dicts"
	text="生成单据状态"
	code="billStatuses"
	:searchFn="register?.getDataList"
	:settings="{ getTreeDataParams: 'bill_status' }"
/>
```

**代码减少 53%！** 🎉

---

## 示例 5: 不同的使用方式对比

### 方式 1: 使用 Prop 一级参数 + settings（推荐）

```vue
<TreeSelectInputApi
	componentType="dicts"
	text="单据状态"
	code="billStatuses"
	:searchFn="handleSearch"
	:settings="{
		getTreeDataParams: 'bill_status',
	}"
/>
```

**优点**: 简洁、清晰

### 方式 2: 全部使用 Settings

```vue
<TreeSelectInputApi
	componentType="dicts"
	:searchFn="handleSearch"
	:settings="{
		getTreeDataParams: 'bill_status',
		text: '单据状态',
		code: 'billStatuses',
	}"
/>
```

**优点**: 配置集中

### 方式 3: 混合使用

```vue
<TreeSelectInputApi
	componentType="dicts"
	text="单据状态"
	:searchFn="handleSearch"
	:settings="{
		getTreeDataParams: 'bill_status',
		code: 'billStatuses',
		width: '300px',
	}"
/>
```

**优点**: 灵活，常用参数用 Prop，其他用 Settings

---

## 示例 6: 自定义宽度和样式

```vue
<TreeSelectInputApi
	componentType="userList"
	:searchFn="handleSearch"
	:settings="{
		width: '300px',
	}"
/>
```

---

## 示例 7: 禁用和隐藏搜索框

```vue
<!-- 禁用 -->
<TreeSelectInputApi
	componentType="userList"
	:searchFn="handleSearch"
	:disabled="true"
/>

<!-- 隐藏搜索框 -->
<TreeSelectInputApi
	componentType="userList"
	:searchFn="handleSearch"
	:showInputSearch="false"
/>
```

---

## 示例 8: 完全自定义（不使用 componentType）

```vue
<TreeSelectInputApi
	v-model:queryForm="queryForm"
	text="自定义选择器"
	code="customCodes"
	:searchFn="handleSearch"
	:settings="{
		getTreeData: customApi,
		getTreeDataParams: { status: 1 },
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

---

## 常见字典类型

| 字典类型 | getTreeDataParams 值 | 说明         |
| -------- | -------------------- | ------------ |
| 单据状态 | `bill_status`        | 生成单据状态 |
| 订单状态 | `order_status`       | 订单状态     |
| 支付方式 | `payment_method`     | 支付方式     |
| 物流状态 | `logistics_status`   | 物流状态     |
| 审核状态 | `audit_status`       | 审核状态     |

---

**最后更新**: 2026-02-11
