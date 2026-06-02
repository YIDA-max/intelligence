# ListAI 模板系统完整指南

## 概述

ListAI 模板系统是一套标准化的列表页面开发模板，旨在提高开发效率，统一代码风格，减少重复工作。

## 目录结构

```
src/template/listAI/
├── listSingle/                    # 单列表模板
│   ├── api/
│   │   └── index.ts              # API接口定义和类型
│   ├── config/
│   │   └── index.ts              # 配置文件（列配置、搜索配置、模块key等）
│   └── index.vue                 # 主页面组件
│
├── listTable/                     # 多Tabs列表模板
│   ├── tab1/                     # Tab页1
│   │   ├── config/
│   │   │   └── index.ts
│   │   └── index.vue
│   ├── tab2/                     # Tab页2
│   │   ├── config/
│   │   │   └── index.ts
│   │   └── index.vue
│   ├── tab3/                     # Tab页3
│   │   ├── config/
│   │   │   └── index.ts
│   │   └── index.vue
│   └── index.vue                 # 主页面（Tabs容器）
│
├── README.md                      # 使用说明
├── PROMPT.md                      # 提示词规范
└── TEMPLATE_GUIDE.md             # 本文档
```

## 模板类型详解

### 1. listSingle - 单列表模板

**适用场景：**

- 基础数据管理页面
- 单一业务列表展示
- 简单的 CRUD 操作

**核心功能：**

- 搜索条件配置
- 表格列配置
- 分页查询
- 数据导出
- 批量操作
- 自定义操作栏

**文件说明：**

#### api/index.ts

定义接口类型和 API 方法：

- 查询参数接口（ListPageQuery）
- 数据项接口（ListItemVO）
- 响应接口（ListPageResponse）
- API 方法（getListPage、postListExport 等）

#### config/index.ts

配置文件，包含：

- `listApi`: API 方法映射
- `moduleKey`: 模块标识（用于权限和设置）
- `searchConfig`: 搜索条件配置
- `columns`: 表格列配置
- `actionMenuList`: 操作菜单配置（可选）

#### index.vue

主页面组件，包含：

- 搜索表单
- 表格展示
- 工具栏（刷新、导出、设置等）
- 自定义插槽（操作栏、特殊字段等）

### 2. listTable - 多 Tabs 列表模板

**适用场景：**

- 需要多个 Tab 页签切换的列表
- 状态分类展示（如：未生成/已生成/生成失败）
- 不同维度的数据展示

**核心功能：**

- 多 Tab 页签管理
- 每个 Tab 独立的列表配置
- Tab 标题显示数量统计
- Tab 权限控制

**文件说明：**

#### index.vue（主容器）

- 管理 Tab 切换
- 控制 Tab 显示权限
- 统计数量显示
- 子组件懒加载

#### tab1/tab2/tab3（子 Tab 页）

每个 Tab 页包含独立的：

- config/index.ts: 配置文件
- index.vue: 页面组件

结构与单列表模板相同，但没有 api 文件夹（API 通常在主模块定义）。

## 配置详解

### 1. moduleKey 配置

```typescript
export const moduleKey = 'moduleName';
```

**命名规则：**

- 一般使用当前文件夹名称
- 如需保证唯一性，可加上级目录前缀
- 示例：`platformWarehouseDiff`、`selfOrderSync_notGeneratedOrder`

**用途：**

- 权限控制：`v-auth="\`${moduleKey}\_export\`"`
- 设置存储：`settingKey: '${moduleKey}_index'`
- 路由标识

### 2. columns 表格列配置

```typescript
export const columns: Columns = [
	{
		type: 'checkbox', // 多选框（固定）
		width: 60,
		align: 'center',
		fixed: 'left',
	},
	{
		title: '字段名称', // 显示名称（中文）
		field: 'fieldName', // 接口字段名（英文）
		width: 150, // 列宽
		fixed: 'right', // 固定列（可选）
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

- `type: 'checkbox'` 是固定显示的多选框
- `title` 以需求文档为准
- `field` 对接接口时以 title 匹配
- 显示顺序与需求文档保持一致
- 操作栏固定 `field: 'action'`

### 3. searchConfig 搜索条件配置

#### 3.1 TreeSelectInputApi - 字典类型

```typescript
{
	component: 'TreeSelectInputApi',
	props: {
		componentType: 'dicts',
		settings: {
			code: 'platforms',              // 接口入参（多选带s）
			text: '平台',                   // 显示名称
			getTreeDataParams: 'platform_channel', // 字典枚举（必传）
		},
	},
}
```

**可用字典类型：**
参考 `src/componentsApi/TreeSelectInputApi/confige`

#### 3.2 customCascaderApi - 级联选择

```typescript
// 仓库
{
	component: 'customCascaderApi',
	props: {
		componentType: 'warehouseId',
		settings: {
			code: 'warehouseCodes',
			text: '仓库',
		},
	},
}

// 店铺/站点
{
	component: 'customCascaderApi',
	props: {
		componentType: 'storeSiteId',
		settings: {
			code: 'storeSiteIds',
			text: '店铺/站点',
		},
	},
}
```

**可用类型：**
参考 `src/componentsApi/customCascaderApi/confige`

#### 3.3 SelectInput - 模糊搜索

```typescript
{
	component: 'SelectInput',
	props: {
		searchTypes: [
			{
				label: '订单号',      // 搜索名称
				value: 'orderNos',   // 接口入参
			},
			{
				label: 'SKU',
				value: 'skuCodes',
			},
		],
	},
}
```

#### 3.4 SelectDate - 时间选择

```typescript
{
	component: 'SelectDate',
	props: {
		searchTypes: [
			{
				label: '创建时间',
				value: 'createTime',
				isAddHMS: true,                    // 是否添加时分秒
				dateStart: 'createTimeStart',      // 开始时间入参
				dateEnd: 'createTimeEnd',          // 结束时间入参
			},
		],
	},
}
```

**注意：** 时间选择默认放在所有搜索条件后面。

### 4. listApi 接口配置

```typescript
export const listApi = {
	getList: getListPage, // 列表查询
	exportList: postListExport, // 导出
	deleteItem: deleteListItem, // 删除（可选）
};
```

**API 文件路径规则：**

- 路径统一：`/@/api/`
- 层级与 view 文件一致（view 换成 api）
- 示例：
  - View: `src/views/materialFlow/freightFlow/platformWarehouseDiff/index.vue`
  - API: `src/api/materialFlow/freightFlow/platformWarehouseDiff/index.ts`

## 交互场景实现

### 1. 链接类型

点击字段显示弹窗或跳转页面：

```vue
<template #fieldName="{ row }">
	<span
		class="text-blue-500 cursor-pointer hover:underline"
		@click="handleClick(row)"
	>
		{{ row.fieldName }}
	</span>
</template>

<script setup lang="ts">
const handleClick = (row: any) => {
	// 显示弹窗或跳转页面
};
</script>
```

### 2. 颜色显示

根据数据类型显示不同颜色：

```vue
<!-- 差异数量示例 -->
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

#### 3.1 编辑按钮

```vue
<template #action="{ row }">
	<div class="flex justify-center">
		<EditOrAdd
			:type="'edit'"
			:row="row"
			v-auth="`${moduleKey}-edit`"
			@getDataList="register?.getDataList"
		/>
	</div>
</template>

<script setup lang="ts">
const EditOrAdd = defineAsyncComponent(
	() => import('./components/addOrEdit/index.vue')
);
</script>
```

#### 3.2 下拉菜单

```vue
<template #action="{ row }">
	<div class="flex justify-center">
		<ActionDropdown
			:row="row"
			:menu-list="actionMenuList"
			@delete="handleDelete"
		/>
	</div>
</template>

<script setup lang="ts">
const ActionDropdown = defineAsyncComponent(
	() => import('/@/components/ActionDropdown/index.vue')
);

// config/index.ts
export const actionMenuList = [
	{
		label: '删除',
		value: 'delete',
		auth: `${moduleKey}-delete`,
	},
];

// 删除处理
const handleDelete = async (_item: any, row: any) => {
	await listApi.deleteItem({ id: row.id });
	message.success(t('common.delSuccessText'));
	register?.getDataList();
};
</script>
```

#### 3.3 组合操作

```vue
<template #action="{ row }">
	<div class="flex justify-center">
		<EditOrAdd
			:type="'edit'"
			:row="row"
			v-auth="`${moduleKey}-edit`"
			@getDataList="register?.getDataList"
		/>
		<ActionDropdown
			:row="row"
			:menu-list="actionMenuList"
			@delete="handleDelete"
		/>
	</div>
</template>
```

## 使用流程

### 单列表开发流程

1. **复制模板**

   ```bash
   复制 src/template/listAI/listSingle 到目标目录
   ```

2. **修改模块标识**

   ```typescript
   // config/index.ts
   export const moduleKey = 'yourModuleName';
   ```

3. **配置表格字段**

   ```typescript
   // config/index.ts
   export const columns: Columns = [
   	{ type: 'checkbox', width: 60, align: 'center', fixed: 'left' },
   	{ title: '字段1', field: 'field1', width: 150 },
   	{ title: '字段2', field: 'field2', width: 150 },
   	// ...
   ];
   ```

4. **配置搜索条件**

   ```typescript
   // config/index.ts
   export const searchConfig = [
   	// 根据需求添加搜索条件
   ];
   ```

5. **创建 API 文件**

   ```typescript
   // api/index.ts
   // 定义接口类型和API方法
   ```

6. **配置 API 映射**

   ```typescript
   // config/index.ts
   import { getListPage, postListExport } from '/@/api/xxx/xxx/index';

   export const listApi = {
   	getList: getListPage,
   	exportList: postListExport,
   };
   ```

7. **添加特殊交互**

   ```vue
   <!-- index.vue -->
   <template #fieldName="{ row }">
   	<!-- 自定义显示 -->
   </template>
   ```

8. **配置权限**
   - 确保权限标识格式正确：`${moduleKey}_操作`
   - 在后台配置对应权限

### 多 Tabs 开发流程

1. **复制模板**

   ```bash
   复制 src/template/listAI/listTable 到目标目录
   ```

2. **配置主页面**

   ```vue
   <!-- index.vue -->
   <el-tab-pane
   	:label="$t('Tab名称')"
   	name="tabName"
   	v-if="auth('moduleKey_tabName_view')"
   >
   	<TabComponent v-if="activeName === 'tabName'" />
   </el-tab-pane>
   ```

3. **配置每个 Tab**

   - 参考单列表开发流程
   - 每个 Tab 独立配置

4. **配置数量统计**（可选）

   ```vue
   <template #label>
   	Tab名称 <span class="text-red-500">（{{ count }}）</span>
   </template>

   <script setup lang="ts">
   const count = ref(0);

   function refreshCount() {
   	// 调用接口获取数量
   }
   </script>
   ```

## 权限配置

### 权限标识格式

```typescript
// 查看权限
`${moduleKey}_view` // 导出权限
`${moduleKey}_export` // 新增权限
`${moduleKey}_add` // 编辑权限
`${moduleKey}_edit` // 删除权限
`${moduleKey}_delete` // 自定义操作权限
`${moduleKey}_customAction`;
```

### 使用方式

```vue
<!-- 按钮权限 -->
<el-button v-auth="`${moduleKey}_add`">新增</el-button>

<!-- Tab权限 -->
<el-tab-pane v-if="auth('moduleKey_view')">
	<!-- 内容 -->
</el-tab-pane>

<!-- 组件权限 -->
<EditOrAdd v-auth="`${moduleKey}_edit`" />
```

## 最佳实践

### 1. 命名规范

- **模块 key**: 使用小驼峰或下划线分隔，如 `platformWarehouseDiff`
- **字段名**: 使用小驼峰，如 `fieldName`
- **组件名**: 使用大驼峰，如 `EditOrAdd`

### 2. 代码组织

- 配置与逻辑分离（config/index.ts）
- API 定义与实现分离（api/index.ts）
- 复杂逻辑抽取为 hooks 或 utils

### 3. 性能优化

- 使用 `defineAsyncComponent` 懒加载组件
- Tab 页使用 `v-if` 控制渲染
- 大数据量使用虚拟滚动

### 4. 类型安全

- 定义完整的接口类型
- 使用 TypeScript 严格模式
- 避免使用 `any` 类型

### 5. 注释规范

- 配置项添加注释说明
- 复杂逻辑添加注释
- API 接口添加 JSDoc 注释

## 常见问题

### 1. 搜索条件不生效

检查：

- `code` 字段是否与接口入参一致
- 字典类型是否传入 `getTreeDataParams`
- 组件类型是否正确

### 2. 表格列不显示

检查：

- `field` 字段是否与接口返回一致
- 是否在 `columns` 中配置
- 数据是否正确返回

### 3. 权限不生效

检查：

- 权限标识格式是否正确
- 后台是否配置对应权限
- 用户是否有该权限

### 4. 导出失败

检查：

- 导出接口是否正确
- `responseType: 'blob'` 是否配置
- 参数是否正确传递

## 扩展开发

### 1. 添加新的搜索组件

1. 在 `src/components/TableFormModule` 创建组件
2. 在 `componentMap` 中注册
3. 在 `searchConfig` 中使用

### 2. 添加新的交互场景

1. 在模板中添加插槽示例
2. 更新 README.md 文档
3. 更新 PROMPT.md 提示词

### 3. 添加新的操作类型

1. 创建操作组件
2. 在操作栏插槽中使用
3. 配置权限控制

## 参考资料

- [Element Plus 文档](https://element-plus.org/)
- [Vue 3 文档](https://vuejs.org/)
- [TypeScript 文档](https://www.typescriptlang.org/)

## 更新日志

- 2026-03-23: 初始版本创建
  - 单列表模板
  - 多 Tabs 列表模板
  - 完整文档

## 贡献指南

如需添加新功能或改进模板：

1. 在现有模板基础上开发
2. 更新相关文档
3. 提供使用示例
4. 提交代码审查

## 联系方式

如有问题或建议，请联系开发团队。
