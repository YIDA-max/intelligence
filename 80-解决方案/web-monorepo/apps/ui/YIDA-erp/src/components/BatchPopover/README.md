# BatchPopover 批量操作组件

通用的批量操作 Popover 组件，支持多种输入类型，可用于表格批量设置等场景。

## 功能特性

- ✅ 支持多种输入类型：下拉选择、输入框、数字输入框、日期选择器
- ✅ 灵活的数据配置：支持自定义 label 和 value 字段
- ✅ 内置校验：支持必填校验和自定义校验
- ✅ 友好的交互：确认/取消操作，自动清空临时值
- ✅ 完整的 TypeScript 类型支持

## 基础用法

### 1. 下拉选择器（最常用）

```vue
<template>
	<BatchPopover
		type="select"
		:options="forwarderList"
		label-key="forwarderName"
		value-key="forwarderCode"
		placeholder="请选择货代"
		@confirm="handleBatchForwarder"
	/>
</template>

<script setup lang="ts">
import BatchPopover from '/@/components/BatchPopover/index.vue';

const forwarderList = ref([
	{ forwarderCode: '001', forwarderName: '货代A' },
	{ forwarderCode: '002', forwarderName: '货代B' },
]);

const handleBatchForwarder = (value: any) => {
	// value 为选中的 forwarderCode
	tableData.value.forEach((row) => {
		row.forwarder = value;
	});
};
</script>
```

### 2. 输入框

```vue
<BatchPopover
	type="input"
	placeholder="请输入备注"
	@confirm="handleBatchRemark"
/>
```

### 3. 数字输入框

```vue
<BatchPopover
	type="number"
	placeholder="请输入数量"
	:precision="2"
	:min="0"
	:max="9999"
	@confirm="handleBatchQuantity"
/>
```

### 4. 日期选择器

```vue
<BatchPopover
	type="date"
	date-type="date"
	placeholder="请选择日期"
	@confirm="handleBatchDate"
/>
```

## Props 属性

| 属性名                | 类型                                                     | 默认值     | 说明                                  |
| --------------------- | -------------------------------------------------------- | ---------- | ------------------------------------- |
| type                  | `'select' \| 'input' \| 'number' \| 'date'`              | `'select'` | 组件类型                              |
| options               | `any[]`                                                  | `[]`       | 下拉选项数据（type 为 select 时必填） |
| labelKey              | `string`                                                 | `'label'`  | 选项的 label 字段名                   |
| valueKey              | `string`                                                 | `'value'`  | 选项的 value 字段名                   |
| placeholder           | `string`                                                 | `'请选择'` | 占位符文本                            |
| placement             | `'top' \| 'bottom' \| 'left' \| 'right'`                 | `'bottom'` | Popover 弹出位置                      |
| width                 | `number`                                                 | `200`      | Popover 宽度                          |
| trigger               | `'click' \| 'hover' \| 'focus'`                          | `'click'`  | 触发方式                              |
| precision             | `number`                                                 | `0`        | 数字输入框的精度（小数位数）          |
| min                   | `number`                                                 | -          | 数字输入框的最小值                    |
| max                   | `number`                                                 | -          | 数字输入框的最大值                    |
| dateType              | `'date' \| 'datetime' \| 'daterange' \| 'datetimerange'` | `'date'`   | 日期选择器类型                        |
| validateBeforeConfirm | `boolean`                                                | `true`     | 是否在确认前进行校验                  |
| validator             | `(value: any) => boolean \| string`                      | -          | 自定义校验函数                        |

## Events 事件

| 事件名  | 参数         | 说明                   |
| ------- | ------------ | ---------------------- |
| confirm | `value: any` | 确认事件，返回选中的值 |
| cancel  | -            | 取消事件               |

## 高级用法

### 自定义校验

```vue
<BatchPopover
	type="input"
	placeholder="请输入邮箱"
	:validator="validateEmail"
	@confirm="handleBatchEmail"
/>

<script setup lang="ts">
const validateEmail = (value: string) => {
	const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailReg.test(value)) {
		return '请输入有效的邮箱地址';
	}
	return true;
};
</script>
```

### 在表格中使用

```vue
<el-table-column label="货代" width="200">
  <template #header>
    <div class="header-with-batch">
      <span class="required-star">*</span>
      <span>货代</span>
      <BatchPopover
        type="select"
        :options="forwarderList"
        label-key="forwarderName"
        value-key="forwarderCode"
        placeholder="请选择货代"
        @confirm="handleBatchForwarder"
      />
    </div>
  </template>
  <template #default="{ row }">
    <el-select v-model="row.forwarder" placeholder="请选择">
      <el-option
        v-for="item in forwarderList"
        :key="item.forwarderCode"
        :label="item.forwarderName"
        :value="item.forwarderCode"
      />
    </el-select>
  </template>
</el-table-column>
```

## 样式定制

组件内置了基础样式，如需自定义，可以通过以下方式：

```scss
:deep(.batch-popover) {
	padding: 12px;

	.batch-actions {
		margin-top: 16px;
	}
}
```

## 注意事项

1. **数据格式**：使用 `select` 类型时，确保 `options` 数据格式正确，并正确配置 `labelKey` 和 `valueKey`
2. **校验逻辑**：自定义校验函数返回 `true` 表示通过，返回 `false` 或错误信息字符串表示不通过
3. **事件处理**：`confirm` 事件返回的值类型取决于组件类型和配置
4. **性能优化**：对于大量数据的下拉选择，建议启用 `filterable` 属性

## 完整示例

参考 `src/views/materialFlow/firstMileLogistics/showInfo/components/FeeDialog.vue` 文件查看完整的使用示例。
