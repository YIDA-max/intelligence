# VXE Table Hook 与 Element Plus Table Hook 的 API 差异说明

## 一、主要 API 差异对照表

### 1. 选择/复选框相关

| 功能                 | Element Plus Table              | VXE Table                     | 说明                       |
| -------------------- | ------------------------------- | ----------------------------- | -------------------------- |
| 清空选中             | `clearSelection()`              | `clearCheckboxRow()`          | vxe-table 方法名更明确     |
| 设置选中             | `toggleRowSelection(row, true)` | `setCheckboxRow(rows, true)`  | vxe-table 支持批量设置     |
| 获取选中行           | 通过事件或手动维护              | `getCheckboxRecords()`        | vxe-table 提供直接获取方法 |
| 获取选中行（含半选） | 不支持                          | `getCheckboxReserveRecords()` | vxe-table 特有功能         |

### 2. 展开行相关

| 功能       | Element Plus Table              | VXE Table                 | 说明                   |
| ---------- | ------------------------------- | ------------------------- | ---------------------- |
| 展开单行   | `toggleRowExpansion(row, true)` | `setRowExpand(row, true)` | 方法名不同             |
| 展开所有行 | 需遍历调用                      | `setAllRowExpand(true)`   | vxe-table 提供批量方法 |
| 收起所有行 | 需遍历调用                      | `setAllRowExpand(false)`  | vxe-table 提供批量方法 |

### 3. 树形表格相关

| 功能           | Element Plus Table | VXE Table                  | 说明                   |
| -------------- | ------------------ | -------------------------- | ---------------------- |
| 展开所有树节点 | 不直接支持         | `setAllTreeExpand(true)`   | vxe-table 树形表格专用 |
| 收起所有树节点 | 不直接支持         | `setAllTreeExpand(false)`  | vxe-table 树形表格专用 |
| 展开指定树节点 | 不直接支持         | `setTreeExpand(row, true)` | vxe-table 树形表格专用 |

### 4. 排序相关

| 功能         | Element Plus Table          | VXE Table                               | 说明         |
| ------------ | --------------------------- | --------------------------------------- | ------------ |
| 排序事件参数 | `{ column, prop, order }`   | `{ column, property, order, sortList }` | 参数结构不同 |
| 排序值       | `ascending/descending/null` | `asc/desc/null`                         | 值的命名不同 |
| 清空排序     | `clearSort()`               | `clearSort()`                           | 方法名相同   |

### 5. DOM 引用相关

| 功能          | Element Plus Table          | VXE Table            | 说明                        |
| ------------- | --------------------------- | -------------------- | --------------------------- |
| 获取 DOM 元素 | `tableRef.value` 直接是 DOM | `tableRef.value.$el` | vxe-table 需要通过 $el 访问 |

## 二、不支持或有差异的功能

### 1. Element Plus Table 支持但 VXE Table 不同的功能

- **表头样式设置**：

  - Element Plus：通过 `headerCellStyle` prop
  - VXE Table：通过 `header-cell-class-name` 或 `header-cell-style` prop
  - **差异**：vxe-table 的样式设置方式更灵活，但配置方式不同

- **单元格样式设置**：
  - Element Plus：通过 `cellStyle` prop
  - VXE Table：通过 `cell-class-name` 或 `cell-style` prop
  - **差异**：配置方式不同

### 2. VXE Table 特有功能（Element Plus 不支持）

- **虚拟滚动**：`scroll-y` 配置，适合大数据量
- **列冻结**：`fixed` 属性更强大，支持左右冻结
- **单元格合并**：`span-method` 更灵活
- **可编辑表格**：内置编辑功能，无需额外组件
- **导出功能**：内置 Excel 导出
- **打印功能**：内置打印功能
- **复选框保留选中**：跨页保留选中状态

### 3. 需要注意的差异

#### 分页组件集成

- **Element Plus**：通常使用 `el-pagination` 组件
- **VXE Table**：可以使用 `vxe-pager` 组件，API 略有不同

  ```vue
  <!-- Element Plus -->
  <el-pagination
  	@size-change="sizeChangeHandle"
  	@current-change="currentChangeHandle"
  	:current-page="pagination.current"
  	:page-sizes="pagination.pageSizes"
  	:page-size="pagination.size"
  	:total="pagination.total"
  />

  <!-- VXE Table -->
  <vxe-pager
  	@page-change="currentChangeHandle"
  	@page-size-change="sizeChangeHandle"
  	:current-page="pagination.current"
  	:page-sizes="pagination.pageSizes"
  	:page-size="pagination.size"
  	:total="pagination.total"
  />
  ```

#### 排序事件监听

```vue
<!-- Element Plus -->
<el-table @sort-change="sortChangeHandle">

<!-- VXE Table -->
<vxe-table @sort-change="sortChangeHandle">
```

## 三、使用建议

### 1. 迁移步骤

1. 将 `useTable` 替换为 `useTableVxe`
2. 检查模板中的事件绑定（特别是排序事件）
3. 如果使用了选中功能，确认使用 `getSelectionRows()` 获取选中行
4. 如果使用了展开行，确认展开/收起方法调用
5. 检查样式配置（移除 `tableStyle` 返回值，改用 vxe-table 的样式配置）

### 2. 推荐使用场景

**使用 VXE Table 的场景：**

- 大数据量表格（需要虚拟滚动）
- 需要可编辑表格
- 需要复杂的单元格合并
- 需要导出/打印功能
- 需要树形表格
- 需要跨页保留选中状态

**继续使用 Element Plus Table 的场景：**

- 简单的数据展示
- 项目已大量使用 Element Plus
- 不需要复杂的表格功能

## 四、Hook 返回值差异

### useTable（Element Plus）返回值

```typescript
{
  tableStyle,              // 表格样式配置
  getDataListDebounced,
  getDataListThrottled,
  query,
  getDataList,
  resetTableQuery,
  sizeChangeHandle,
  currentChangeHandle,
  sortChangeHandle,
  downBlobFile,
  setTableData,
  getTableData,
  toggleRowCollapse,
  toggleRowExpand,
  setTableSelection,
  clearPagination,
}
```

### useTableVxe（VXE Table）返回值

```typescript
{
  // 移除了 tableStyle（vxe-table 使用不同的样式配置方式）
  getDataListDebounced,
  getDataListThrottled,
  query,
  getDataList,
  resetTableQuery,
  sizeChangeHandle,
  currentChangeHandle,
  sortChangeHandle,
  downBlobFile,
  setTableData,
  getTableData,
  toggleRowCollapse,
  toggleRowExpand,
  setTableSelection,
  clearPagination,
  getSelectionRows,              // 新增：获取选中行
  getCheckboxReserveRecords,     // 新增：获取选中行（含半选）
}
```

## 五、完整使用示例

```vue
<template>
	<div>
		<vxe-table
			ref="tableRef"
			:data="state.dataList"
			:loading="state.loading"
			@checkbox-change="handleSelectionChange"
			@sort-change="sortChangeHandle"
		>
			<vxe-column type="checkbox" width="60"></vxe-column>
			<vxe-column field="name" title="名称" sortable></vxe-column>
			<vxe-column field="age" title="年龄" sortable></vxe-column>
		</vxe-table>

		<vxe-pager
			:current-page="state.pagination.current"
			:page-size="state.pagination.size"
			:total="state.pagination.total"
			:page-sizes="state.pagination.pageSizes"
			@page-change="currentChangeHandle"
			@page-size-change="sizeChangeHandle"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTableVxe } from '/@/hooks/tableVxe';
import { getListApi } from '/@/api/xxx';

const tableRef = ref();

const {
	state,
	getDataList,
	sortChangeHandle,
	currentChangeHandle,
	sizeChangeHandle,
	getSelectionRows,
} = useTableVxe(
	{
		pageList: getListApi,
		createdIsNeed: true,
	},
	tableRef
);

const handleSelectionChange = () => {
	const selections = getSelectionRows();
	console.log('选中的行：', selections);
};
</script>
```

## 六、注意事项

1. **样式配置**：vxe-table 不使用 `tableStyle` 返回值，需要在模板中直接配置样式类或样式属性
2. **事件参数**：排序事件的参数结构不同，需要适配
3. **DOM 访问**：访问 DOM 元素时需要使用 `tableRef.value.$el`
4. **分页组件**：建议使用 `vxe-pager` 而不是 `el-pagination`
5. **性能优化**：vxe-table 在大数据量时性能更好，但需要正确配置
