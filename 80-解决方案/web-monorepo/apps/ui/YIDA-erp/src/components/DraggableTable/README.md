# DraggableTable 拖拽表格组件

基于 Element Plus 表格和 Sortable.js 的可拖拽排序组件。

## 基本使用

```vue
<template>
	<DraggableTable :data-list="tableData" :loading="loading" row-key="id" @drag-end="handleDragEnd">
		<el-table-column prop="name" label="姓名" />
		<el-table-column prop="email" label="邮箱" />
	</DraggableTable>
</template>

<script setup>
import DraggableTable from '/@/components/DraggableTable/index.vue';

const handleDragEnd = (oldIndex, newIndex, newDataList) => {
	tableData.value = newDataList;
	// 保存排序到后端
};
</script>
```

## Props 属性

| 属性名          | 类型    | 默认值     | 说明                 |
| --------------- | ------- | ---------- | -------------------- |
| dataList        | Array   | []         | 表格数据             |
| showDragHandle  | Boolean | true       | 是否显示拖拽句柄列   |
| rowKey          | String  | 'id'       | 行数据的唯一标识字段 |
| loading         | Boolean | false      | 加载状态             |
| disabled        | Boolean | false      | 是否禁用拖拽功能     |
| dragHandleTitle | String  | '拖拽排序' | 拖拽句柄的提示文字   |
| animation       | Number  | 150        | 拖拽动画时长(毫秒)   |

## Events 事件

| 事件名          | 参数                                                     | 说明         |
| --------------- | -------------------------------------------------------- | ------------ |
| dragStart       | (event: SortableEvent)                                   | 拖拽开始     |
| dragEnd         | (oldIndex: number, newIndex: number, newDataList: any[]) | 拖拽结束     |
| sortChange      | (sortData: any)                                          | 表格排序变化 |
| selectionChange | (selection: any[])                                       | 表格选择变化 |

```vue
<DraggableTable :data-list="state.dataList" :loading="state.loading" @drag-end="handleDragEnd">
  <el-table-column prop="name" label="姓名" />
</DraggableTable>
```

### 添加事件处理

```javascript
const handleDragEnd = (oldIndex, newIndex, newDataList) => {
	state.dataList = newDataList;
	// 可选：调用后端保存排序
	// await saveSortOrder(newDataList);
};
```

## 注意事项

1. **数据更新**: 拖拽完成后需要手动更新 `dataList` 数据
2. **后端同步**: 建议在拖拽完成后调用后端接口保存排序
3. **兼容性**: 完全兼容 Element Plus 表格的所有功能
