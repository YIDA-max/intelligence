# ListAI 模板使用说明

## 目录结构

```
listAI/
├── listSingle/          # 单列表模板
│   ├── api/
│   │   └── index.ts    # API接口定义
│   ├── config/
│   │   └── index.ts    # 配置文件（列配置、搜索配置等）
│   └── index.vue       # 主页面
├── listTable/          # 多Tabs列表模板
│   ├── tab1/
│   │   ├── config/
│   │   │   └── index.ts
│   │   └── index.vue
│   └── index.vue       # 主页面（Tabs容器）
└── README.md
```

## 模板类型

### 1. listSingle - 单列表模板

适用于普通的单个表格列表页面。

**特点：**

- 完整的搜索、列表、导出功能
- 支持自定义操作栏
- 支持多种交互场景（链接、颜色显示等）

**使用场景：**

- 基础数据管理页面
- 单一业务列表展示

### 2. listTable - 多 Tabs 列表模板

适用于需要多个 Tab 页签切换的列表页面。

**特点：**

- 支持多个 Tab 页签
- 每个 Tab 独立的列表配置
- 支持 Tab 标题显示数量统计

**使用场景：**

- 订单同步（未生成/已生成/生成失败）
- 状态分类展示

## 配置说明

### 1. columns 表格字段配置

参考路径：`src/views/materialFlow/freightFlow/platformWarehouseDiff/config/index.ts`

```typescript
export const columns: Columns = [
	{
		type: 'checkbox', // 固定显示的多选框
		width: 60,
		align: 'center',
		fixed: 'left',
	},
	{
		title: '字段名称', // 对应需求中的字段名称
		field: 'fieldName', // 接口字段名
		width: 150,
	},
	{
		title: '操作',
		field: 'action', // 操作栏固定为action
		width: 150,
		fixed: 'right',
	},
];
```

**注意事项：**

- `title`: 字段显示名称，以需求文档为准
- `field`: 接口字段名，对接时以 title 匹配接口
- 显示顺序与需求文档/截图保持一致

### 2. searchConfig 查询条件配置

参考路径：`src/views/materialFlow/freightFlow/platformWarehouseDiff/config/index.ts`

#### 2.1 TreeSelectInputApi - 普通类型

```typescript
{
	component: 'TreeSelectInputApi',
	props: {
		componentType: 'dicts',  // 组件类型
		settings: {
			code: 'platforms',   // 接口入参，多选通常带s
			text: '平台',        // 显示名称
			getTreeDataParams: 'platform_channel', // 字典类型必传
		},
	},
}
```

**componentType 可选类型：**

- 参考：`src/componentsApi/TreeSelectInputApi/confige`
- 特殊类型：`dicts` - 字典类型，必须传入 `getTreeDataParams`

#### 2.2 customCascaderApi - 级联类型

```typescript
{
	component: 'customCascaderApi',
	props: {
		componentType: 'warehouseId',  // 仓库
		// componentType: 'storeSiteId', // 店铺/站点
		settings: {
			code: 'warehouseCodes',
			text: '仓库',
		},
	},
}
```

**可选类型：**

- `warehouseId`: 仓库
- `storeSiteId`: 店铺/站点
- 配置文件：`src/componentsApi/customCascaderApi/confige`

#### 2.3 SelectInput - 模糊搜索/多选搜索

```typescript
{
	component: 'SelectInput',
	props: {
		searchTypes: [
			{
				label: '订单号',      // 搜索名称
				value: 'orderNos',   // 接口查询入参
			},
			{
				label: 'SKU',
				value: 'skuCodes',
			},
		],
	},
}
```

#### 2.4 SelectDate - 时间选择

```typescript
{
	component: 'SelectDate',
	props: {
		searchTypes: [
			{
				label: '创建时间',
				value: 'createTime',
				isAddHMS: true,
				dateStart: 'createTimeStart',  // 开始时间接口入参
				dateEnd: 'createTimeEnd',      // 结束时间接口入参
			},
		],
	},
}
```

**注意：** 时间选择默认放在所有搜索条件后面，除非特殊说明。

### 3. moduleKey 模块标识

```typescript
export const moduleKey = 'moduleName';
```

- 一般以当前文件夹名称作为 key
- 如需保证唯一性，可加上级目录前缀
- 用于权限控制和路由标识

### 4. listApi 接口配置

路径统一：`/@/api/`，层级与 view 文件一致（view 换成 api）

参考路径：`src/api/materialFlow/freightFlow/platformWarehouseDiff/index.ts`

```typescript
export const listApi = {
	getList: getListPage, // 列表查询
	exportList: postListExport, // 导出
	deleteItem: deleteListItem, // 删除（可选）
};
```

## 交互场景

### 1. 链接类型

```vue
<template #fieldName="{ row }">
	<span
		class="text-blue-500 cursor-pointer hover:underline"
		@click="handleClick(row)"
	>
		{{ row.fieldName }}
	</span>
</template>
```

### 2. 差异数量颜色显示

```vue
<template #diffQuantity="{ row }">
	<span
		:class="{
			'text-gray-500': row.diffQuantity === 0,
			'text-red-500': row.diffQuantity < 0,
			'text-green-500': row.diffQuantity > 0,
		}"
	>
		{{
			row.diffQuantity === 0
				? row.diffQuantity
				: row.diffQuantity > 0
				? `+${row.diffQuantity}`
				: row.diffQuantity
		}}
	</span>
</template>
```

### 3. 操作栏

参考：`src/views/integrations/baseAssociationConfig/currencyCorrespondenceRelation/index.vue`

```vue
<template #action="{ row }">
	<div class="flex justify-center">
		<!-- 编辑按钮 -->
		<EditOrAdd
			:type="'edit'"
			:row="row"
			v-auth="`${moduleKey}-edit`"
			@getDataList="register?.getDataList"
		/>
		<!-- 下拉菜单 -->
		<ActionDropdown
			:row="row"
			:menu-list="actionMenuList"
			@delete="handleDelete"
		/>
	</div>
</template>
```

## 使用流程

1. 根据需求选择模板类型（单列表/多 Tabs）
2. 复制对应模板到目标目录
3. 修改 `moduleKey` 为实际模块名称
4. 配置 `columns` 表格字段
5. 配置 `searchConfig` 查询条件
6. 创建对应的 API 文件
7. 根据业务需求添加自定义交互
8. 配置权限标识

## 注意事项

1. 单列表可能有不同的业务交互场景，后续会持续补充
2. 操作栏固定 `field: 'action'`，插槽内根据业务放置不同操作
3. 字段显示顺序与需求文档保持一致
4. 时间选择默认放在搜索条件最后
5. API 路径层级与 view 文件保持一致
