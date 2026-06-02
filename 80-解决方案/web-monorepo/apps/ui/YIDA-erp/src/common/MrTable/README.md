# MrTable 组件

基于 Element Plus Table 组件的封装，保留所有原生功能，为未来扩展系统默认逻辑提供基础。

## 设计理念

1. **完全兼容**：与 Element Plus Table 组件保持 100% 兼容
2. **透传机制**：所有 props、events、slots 都通过 `v-bind="$attrs"` 往下透传
3. **可扩展性**：为未来添加系统默认逻辑预留空间
4. **零学习成本**：使用方式与 Element Plus Table 完全相同

## 组件结构

```
MrTable/
├── index.vue           # MrTable 主组件
├── MrTableColumn.vue   # MrTableColumn 列组件
├── index.ts           # 导出文件
└── README.md          # 文档
```

## 基础用法

### 导入组件

```vue
<script setup lang="ts">
import { MrTable, MrTableColumn } from '/@/common/MrTable';
</script>
```

### 使用示例

```vue
<template>
  <mr-table
    ref="tableRef"
    :data="tableData"
    border
    stripe
    @selection-change="handleSelectionChange"
  >
    <mr-table-column type="selection" width="55" />
    <mr-table-column prop="date" label="日期" width="180" />
    <mr-table-column prop="name" label="姓名" width="180" />
    <mr-table-column prop="address" label="地址">
      <template #default="{ row }">
        <span>{{ row.address }}</span>
      </template>
    </mr-table-column>
  </mr-table>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MrTable, MrTableColumn } from '/@/common/MrTable';

const tableRef = ref();
const tableData = ref([
  { date: '2024-01-01', name: '张三', address: '北京市' },
  { date: '2024-01-02', name: '李四', address: '上海市' },
]);

const handleSelectionChange = (selection: any[]) => {
  console.log('选中的数据:', selection);
};
</script>
```

## Props

所有 Element Plus Table 组件的 props 都支持，无需额外学习。

常用 props 包括但不限于：
- `data`: 表格数据
- `border`: 是否显示边框
- `stripe`: 是否显示斑马纹
- `height`: 表格高度
- `max-height`: 表格最大高度
- `loading`: 加载状态
- ...更多请参考 [Element Plus Table 文档](https://element-plus.org/zh-CN/component/table.html)

## Events

所有 Element Plus Table 组件的事件都支持，包括：
- `@selection-change`: 选择项发生变化时触发
- `@select`: 用户手动勾选数据行时触发
- `@select-all`: 用户手动勾选全选时触发
- `@cell-click`: 单元格点击时触发
- `@row-click`: 行点击时触发
- ...更多请参考 [Element Plus Table 文档](https://element-plus.org/zh-CN/component/table.html)

## Slots

所有 Element Plus Table 组件的插槽都支持，包括：
- `default`: 表格内容（table-column）
- `empty`: 空数据时的内容
- `append`: 插入至表格最后一行之后的内容

## Methods

可以通过 ref 调用所有 Element Plus Table 组件的方法：

```vue
<template>
  <mr-table ref="tableRef" :data="tableData">
    <!-- ... -->
  </mr-table>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const tableRef = ref();

// 调用表格方法
const clearSelection = () => {
  tableRef.value?.clearSelection();
};

const toggleRowSelection = (row: any) => {
  tableRef.value?.toggleRowSelection(row);
};
</script>
```

## MrTableColumn Props

所有 Element Plus TableColumn 组件的 props 都支持，包括：
- `prop`: 字段名称
- `label`: 列标题
- `width`: 列宽度
- `min-width`: 列最小宽度
- `fixed`: 列是否固定
- `sortable`: 是否可排序
- `type`: 列类型（selection/index/expand）
- ...更多请参考 [Element Plus TableColumn 文档](https://element-plus.org/zh-CN/component/table.html#table-column-attributes)

## MrTableColumn Slots

- `default`: 自定义列内容
- `header`: 自定义表头内容

## 未来扩展规划

当前组件是一个简单的封装，未来可以在以下方面进行扩展：

### 1. 全局配置
```typescript
// 示例：全局表格配置
const defaultTableConfig = {
  border: true,
  stripe: true,
  size: 'default',
};
```

### 2. 统一的加载状态
```typescript
// 示例：自动处理加载状态
const loading = ref(false);
// 自动在请求时显示加载状态
```

### 3. 默认的分页处理
```typescript
// 示例：内置分页组件
<mr-table :data="tableData" :pagination="paginationConfig" />
```

### 4. 列配置管理
```typescript
// 示例：可保存的列配置
const columnConfig = useColumnConfig('myTable');
```

### 5. 数据格式化
```typescript
// 示例：全局的数据格式化器
formatters: {
  date: (val) => dayjs(val).format('YYYY-MM-DD'),
  money: (val) => `¥${val.toFixed(2)}`,
}
```

### 6. 权限控制
```typescript
// 示例：列级别的权限控制
<mr-table-column prop="action" label="操作" v-auth="'admin'" />
```

## 注意事项

1. **完全兼容**：当前版本与 Element Plus Table 完全兼容，可以直接替换使用
2. **渐进增强**：未来的功能扩展不会破坏现有 API
3. **按需使用**：所有扩展功能都是可选的，不影响基础使用

## 示例代码

### 带选择和操作的表格

```vue
<template>
  <mr-table
    ref="tableRef"
    :data="tableData"
    border
    @selection-change="handleSelectionChange"
  >
    <mr-table-column type="selection" width="55" />
    <mr-table-column prop="name" label="名称" width="180" />
    <mr-table-column prop="status" label="状态" width="100">
      <template #default="{ row }">
        <el-tag :type="row.status === 1 ? 'success' : 'danger'">
          {{ row.status === 1 ? '启用' : '禁用' }}
        </el-tag>
      </template>
    </mr-table-column>
    <mr-table-column label="操作" width="200">
      <template #default="{ row }">
        <el-button size="small" @click="handleEdit(row)">编辑</el-button>
        <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
      </template>
    </mr-table-column>
  </mr-table>
</template>
```

### 固定列和表头的表格

```vue
<template>
  <mr-table
    :data="tableData"
    border
    height="400"
  >
    <mr-table-column fixed prop="id" label="ID" width="80" />
    <mr-table-column prop="name" label="名称" width="150" />
    <mr-table-column prop="description" label="描述" min-width="300" />
    <mr-table-column fixed="right" label="操作" width="120">
      <template #default="{ row }">
        <el-button size="small" @click="handleView(row)">查看</el-button>
      </template>
    </mr-table-column>
  </mr-table>
</template>
```

## 迁移指南

如果你的项目中已经使用了 `el-table`，迁移到 `mr-table` 非常简单：

1. 导入组件
2. 将 `el-table` 替换为 `mr-table`
3. 将 `el-table-column` 替换为 `mr-table-column`

就这么简单！所有的 props、events、slots 都保持不变。

