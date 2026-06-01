# el-table → BaseTable 迁移指南

> 适用项目：千易 UI（PIGCLOUD 微服务开发平台前端）
> BaseTable 内部由 MrTableVxe（二次封装 VxeTable）实现，API 与 el-table 不同，迁移时需注意以下差异。

---

## 一、整体步骤

1. 在当前页面目录下新建 `config/index.ts`，将列配置提取为 `columns` 数组
2. 将 `el-table` + `el-table-column` 替换为 `<BaseTable>`
3. 将 `el-table-column` 的 `#default` 插槽改为以 `field` 字段名作为具名插槽
4. 将 `ToolBar` 独立行合并进 `BaseTable` 的 `#left-tool` 插槽，并在 `state.toolBarConfig` 中配置刷新/导出
5. 删除独立的 `<pagination>` 组件（BaseTable 内置）
6. 替换选中、排序等 ref 调用 API

---

## 二、columns 配置文件

新建 `config/index.ts`，格式如下：

```ts
import type { Columns } from '/@/types/table';

export const columns: Columns = [
	// 多选列（替代 el-table-column type="selection"）
	{
		type: 'checkbox',
		width: 50,
		align: 'center',
		fixed: 'left',
	},
	// 普通列
	{
		title: '列标题', // 对应 el-table-column :label
		field: 'fieldName', // 对应 el-table-column prop
		width: 150,
		fixed: 'left', // 固定列
		sortable: true, // 可排序（替代 sortable="custom"）
	},
	// 操作列
	{
		title: '操作',
		field: 'action',
		width: 150,
		fixed: 'right',
	},
];
```

### 列配置字段对照

| el-table-column 属性    | Columns 字段              | 说明                   |
| ----------------------- | ------------------------- | ---------------------- |
| `:label`                | `title`                   | 列标题                 |
| `prop`                  | `field`                   | 字段名，也是具名插槽名 |
| `width`                 | `width`                   | 列宽                   |
| `fixed`                 | `fixed`                   | 固定列，值同 el-table  |
| `sortable="custom"`     | `sortable: true`          | 自定义排序             |
| `show-overflow-tooltip` | 默认已开启 `showOverflow` | 无需配置               |
| `type="selection"`      | `type: 'checkbox'`        | 多选列                 |
| `align`                 | `align`                   | 对齐方式               |
| `minWidth`              | `minWidth`                | 最小列宽               |
| `tips`                  | `tips`                    | 表头 tooltip 说明文字  |

> 注意：如果某列有自定义渲染（原来用 `#default` 插槽），`field` 名需要能唯一标识该列，
> 当 `field` 与数据字段名冲突时（如同名但渲染逻辑不同），可以在 `field` 后加 `Custom` 后缀区分，
> 例如 `field: 'skuCodeCustom'`，插槽名也对应为 `#skuCodeCustom`。

### 内置渲染能力（无需写插槽）

BaseTable 通过 `formatData` 内置了以下渲染逻辑，满足条件时直接在 columns 配置，**不需要写插槽**：

**1. 空值自动兜底**

字段值为 `null / undefined / ''` 时，自动显示 `---`，无需 `|| '---'` 插槽：

```ts
// ❌ 不需要这样写插槽
// <template #currency="{ row }">{{ row.currency || '---' }}</template>

// ✅ 直接配置列即可，空值自动显示 ---
{ title: '币种', field: 'currency', width: 100 }
```

**2. 两字段拼接：prefixObj**

原来 `{{ row.supplierNo }}-{{ row.supplierName }}` 这类拼接，用 `prefixObj` 配置：

```ts
// ❌ 不需要这样写插槽
// <template #supplierNo="{ row }">
//   {{ row.supplierNo }}-{{ row.supplierName || '---' }}
// </template>

// ✅ field 指向主显示字段，prefixObj 配置前缀字段和连接符
{
  title: '供应商',
  field: 'supplierName',   // 主显示字段（后半部分）
  width: 200,
  prefixObj: {
    field: 'supplierNo',   // 前缀字段（前半部分）
    connectStr: '-',       // 连接符，默认 ' - '
  },
}
```

渲染结果：`supplierNo-supplierName`，前缀为空时只显示主字段值。

**3. 布尔值显示是/否：valueType: 'boolean'**

字段值为 `1/0` 或 `true/false`，显示 `是/否`：

```ts
// ❌ 不需要这样写插槽
// <template #ladderFlag="{ row }">{{ row.ladderFlag === 1 ? '是' : '否' }}</template>

// ✅ 配置 valueType: 'boolean'
{ title: '是否梯度报价', field: 'ladderFlag', width: 150, valueType: 'boolean' }
```

**其他内置 valueType：**

| valueType        | 说明           | 示例输出            |
| ---------------- | -------------- | ------------------- |
| `'text'`（默认） | 原样显示       | `ABC`               |
| `'number'`       | 保留 2 位小数  | `1.00`              |
| `'price'`        | 金额格式       | `1.00¥`             |
| `'percent'`      | 百分比         | `10.00%`            |
| `'datetime'`     | 日期时间格式化 | `2026/1/1 00:00:00` |
| `'boolean'`      | 布尔转是/否    | `是` / `否`         |

---

## 三、template 改造

### 3.1 替换 el-table

**改造前：**

```html
<el-row>
	<ToolBar @handleRefresh="resetQuery" @handleExport="exportFn" ...>
		<template #left-tool>
			<el-button ...>添加</el-button>
		</template>
	</ToolBar>
</el-row>

<el-table
	:data="state.dataList"
	@selection-change="handleSelectionChange"
	@sort-change="sortChangeHandle"
	v-loading="state.loading"
	border
	row-key="id"
	ref="tableRef"
	:cell-style="tableStyle.cellStyle"
	:header-cell-style="tableStyle.headerCellStyle"
>
	<el-table-column type="selection" width="40" fixed="left" />
	<el-table-column prop="name" label="名称" sortable="custom" width="150">
		<template #default="{ row }"> {{ row.name }} </template>
	</el-table-column>
	<el-table-column label="操作" width="150" fixed="right">
		<template #default="{ row }">
			<el-button @click="openDialog('view', row)">详情</el-button>
		</template>
	</el-table-column>
</el-table>

<pagination
	@current-change="currentChangeHandle"
	@size-change="sizeChangeHandle"
	v-bind="state.pagination"
/>
```

**改造后：**

```html
<BaseTable
	ref="baseTableRef"
	:register="register"
	:rowConfig="{ keyField: 'id' }"
>
	<!-- 工具栏左侧按钮区 -->
	<template #left-tool>
		<el-button type="primary" @click="openDialog('add')">添加</el-button>
	</template>

	<!-- 自定义列插槽：以 field 名作为插槽名 -->
	<template #name="{ row }"> {{ row.name }} </template>

	<!-- 操作列插槽 -->
	<template #action="{ row }">
		<el-button text type="primary" @click="openDialog('view', row)"
			>详情</el-button
		>
	</template>
</BaseTable>
```

**关键变化：**

- 删除独立 `<ToolBar>` 行，按钮移入 `BaseTable` 的 `#left-tool` 插槽
- 删除独立 `<pagination>`，BaseTable 内置分页
- 删除 `:cell-style` 和 `:header-cell-style`
- 删除 `@selection-change`、`@sort-change`（由 register 内部处理）
- `el-table-column #default="{ row }"` → `#fieldName="{ row }"`

### 3.2 具名插槽规则

BaseTable 会将 `columns` 中每个 `field` 作为插槽名，优先使用外部传入的同名插槽渲染：

```html
<!-- columns 中 field: 'status' -->
<template #status="{ row }">
	<el-switch :modelValue="!!row.status" />
</template>

<!-- columns 中 field: 'platforms' -->
<template #platforms="{ row }">
	<el-tooltip :content="formatTooltip(row.platforms)">
		<span>{{ formatText(row.platforms) }}</span>
	</el-tooltip>
</template>
```

---

## 四、script 改造

### 4.1 state 配置

```ts
import { columns } from './config/index';
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';

const baseTableRef = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getListApi, // 数据请求接口
	columns, // 引入 config 中的列配置
	descs: ['create_time'],
	ascs: [],
	toolBarConfig: {
		handleRefresh: () => register?.getDataList(),
		handleExport: () => exportFn(),
		isShowExport: auth('module_export'),
		settingKey: 'module_index', // 列设置持久化 key，建议用模块名
	},
});

const { register, getDataList, resetTableQuery } = useTable(
	state,
	baseTableRef
);
```

**与旧版对比：**

| 旧版                                          | 新版                         |
| --------------------------------------------- | ---------------------------- |
| `const tableRef = ref()`                      | `const baseTableRef = ref()` |
| `useTable(state, tableRef)` 解构 `tableStyle` | 不再需要 `tableStyle`        |
| `ToolBar` 组件单独配置                        | 移入 `state.toolBarConfig`   |
| 无 `columns` 字段                             | 必须传入 `columns`           |

### 4.2 选中行 API 替换

| 旧版（el-table）                                   | 新版（VxeTable via register）                        |
| -------------------------------------------------- | ---------------------------------------------------- |
| `@selection-change="handleSelectionChange"`        | 删除，改为主动调用 `syncSelectedRows()`              |
| `tableRef.value.getSelectionRows()`                | `register.safeCallTableMethod('getCheckboxRecords')` |
| `tableRef.value.getSelectionRows().map(r => r.id)` | `register.getSelectedIds()`                          |
| `tableRef.value.clearSelection()`                  | `register.safeCallTableMethod('clearCheckboxRow')`   |

**推荐封装 syncSelectedRows：**

```ts
// 同步当前选中行到本地变量
const syncSelectedRows = () => {
	const rows = register.safeCallTableMethod('getCheckboxRecords') || [];
	selectObjs.value = rows.map(({ id }: { id: string }) => id);
	selectedRows.value = rows;
	// 其他依赖选中行的变量...
};
```

在需要获取选中行的操作（批量操作、分配、导出等）前调用 `syncSelectedRows()`。

> ⚠️ 注意：迁移时需要检查所有依赖选中状态变量（如 `selectObjs`、`selectedRows`）的调用点，
> 确保每处都在使用前调用了 `syncSelectedRows()`。
> el-table 通过 `@selection-change` 实时维护这些变量，VxeTable 不会自动触发，容易遗漏。

### 4.3 导出函数

```ts
const exportFn = async () => {
	try {
		const ids = register.getSelectedIds();
		state.loading = true;
		await exportApi({
			...state.queryForm,
			ascs: state?.ascs,
			descs: state?.descs,
			ids: ids || [],
			current: 1,
			size: 10000,
		});
	} catch (error) {
		useMessage().error(t(error as string));
	} finally {
		state.loading = false;
	}
};
```

### 4.4 重置查询

```ts
const resetQuery = () => {
	resetTableQuery(() => ({
		queryForm: { current: 1, size: 10 },
		descs: ['create_time'],
		ascs: [],
	}));
};
```

### 4.5 useMultipleDicts 的 tableRef 参数

如果页面使用了 `useMultipleDicts`，将 `tableRef` 改为 `baseTableRef`：

```ts
const { dictMap } = useMultipleDicts([...], {
  isAuto: true,
  tableRef: baseTableRef,  // 原来是 tableRef
});
```

### 4.6 移除不再需要的内容

```ts
// 删除以下解构项
const {
	getDataList,
	currentChangeHandle, // ❌ 删除，BaseTable 内置
	sizeChangeHandle, // ❌ 删除，BaseTable 内置
	sortChangeHandle, // ❌ 删除，BaseTable 内置
	tableStyle, // ❌ 删除，不再需要
	resetTableQuery,
} = useTable(state, tableRef);

// 改为
const { register, getDataList, resetTableQuery } = useTable(
	state,
	baseTableRef
);
```

```ts
// 删除以下 defineAsyncComponent 引入
const ToolBar = defineAsyncComponent(
	() => import('/@/components/ToolBar/tool-bar.vue') // ❌ 删除，BaseTable 内置
);
```

---

## 五、完整改造 checklist

- [ ] 新建 `config/index.ts`，定义 `columns`
- [ ] `el-table` → `<BaseTable ref="baseTableRef" :register="register">`
- [ ] 删除独立 `<ToolBar>` 行，按钮移入 `#left-tool` 插槽
- [ ] 删除独立 `<pagination>`
- [ ] 删除 `:cell-style` 和 `:header-cell-style`
- [ ] `el-table-column #default` → `#fieldName` 具名插槽（仅复杂渲染才需要，见下方判断规则）
- [ ] 纯空值兜底 `|| '---'` 的列 → 删除插槽，直接配置列
- [ ] 两字段拼接的列 → 删除插槽，改用 `prefixObj` 配置
- [ ] `1/0` 显示 `是/否` 的列 → 删除插槽，改用 `valueType: 'boolean'`
- [ ] `const tableRef = ref()` → `const baseTableRef = ref()`
- [ ] `state` 中增加 `columns` 和 `toolBarConfig`
- [ ] `useTable` 解构增加 `register`，删除 `tableStyle`/`currentChangeHandle`/`sizeChangeHandle`/`sortChangeHandle`
- [ ] `tableRef.value.getSelectionRows()` → `register.safeCallTableMethod('getCheckboxRecords')`
- [ ] `tableRef.value.clearSelection()` → `register.safeCallTableMethod('clearCheckboxRow')`
- [ ] `useMultipleDicts` 的 `tableRef` 参数改为 `baseTableRef`
- [ ] 删除 `ToolBar` 的 `defineAsyncComponent` 引入

---

## 六、注意事项

1. **排序字段**：VxeTable 的 `sortChangeHandle` 内部会将 `field` 转为下划线格式（`camelCase` → `snake_case`），如需自定义排序字段名，在 columns 中配置 `sortableFn: () => 'custom_field_name'`

2. **列设置持久化**：`toolBarConfig.settingKey` 建议用模块唯一标识，避免不同页面列设置互相覆盖

3. **无自定义渲染的列**：不需要写插槽，BaseTable 会自动读取 `row[field]` 渲染

4. **checkbox 列**：VxeTable 的多选不触发 `@selection-change`，需要在操作时主动调用 `syncSelectedRows()` 获取选中行

5. **行唯一标识**：`:rowConfig="{ keyField: 'id' }"` 对应 el-table 的 `row-key="id"`，跨页保留选中需要配置此项
