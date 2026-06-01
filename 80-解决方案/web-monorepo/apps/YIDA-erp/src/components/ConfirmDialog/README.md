# ConfirmDialog 弹窗组件

## 概述

`ConfirmDialog` 是一个通用的弹窗组件，提供了基础的弹窗功能和多种预设类型。该组件支持通过插槽自定义内容，并且**完全由子组件控制弹窗状态**，父组件只需要调用相应的方法即可。

## 组件结构

```
ConfirmDialog/
├── index.vue          # 基础弹窗组件
├── InputDialog.vue    # 输入框弹窗组件
├── SelectDialog.vue   # 选择框弹窗组件
├── DateDialog.vue     # 日期选择弹窗组件
└── README.md          # 使用文档
```

## 核心特性

### 🎯 **完全由子组件控制弹窗**

- ✅ 弹窗的打开和关闭完全由子组件内部控制
- ✅ 父组件不需要绑定 `visible` 属性
- ✅ 父组件通过调用子组件的方法来控制弹窗

### 🔄 **自动初始化机制**

- ✅ 每次打开弹窗时自动清空之前的数据
- ✅ 确保没有残余值，数据完全重新初始化

## 基础组件 (ConfirmDialog)

### Props

| 属性                | 类型       | 默认值      | 说明         |
| ------------------- | ---------- | ----------- | ------------ |
| `title`             | `String`   | `'提示'`    | 弹窗标题     |
| `width`             | `String`   | `'500px'`   | 弹窗宽度     |
| `showIcon`          | `Boolean`  | `false`     | 是否显示图标 |
| `iconType`          | `IconType` | `'info'`    | 图标类型     |
| `cancelButtonText`  | `String`   | `'取消'`    | 取消按钮文本 |
| `confirmButtonText` | `String`   | `'确认'`    | 确认按钮文本 |
| `confirmButtonType` | `String`   | `'primary'` | 确认按钮类型 |

### Events

| 事件名    | 说明         | 回调参数 |
| --------- | ------------ | -------- |
| `cancel`  | 点击取消按钮 | -        |
| `confirm` | 点击确认按钮 | -        |
| `closed`  | 弹窗关闭后   | -        |
| `opened`  | 弹窗打开后   | -        |

### Methods

| 方法名   | 说明     | 参数 |
| -------- | -------- | ---- |
| `show()` | 打开弹窗 | -    |
| `hide()` | 关闭弹窗 | -    |

### Slots

| 插槽名    | 说明             |
| --------- | ---------------- |
| `default` | 弹窗内容         |
| `header`  | 弹窗头部（可选） |
| `footer`  | 弹窗底部（可选） |

## 专用组件

### InputDialog

输入框弹窗组件，用于文本输入场景。

#### Props

| 属性               | 类型            | 默认值     | 说明         |
| ------------------ | --------------- | ---------- | ------------ |
| `inputLabel`       | `String`        | `''`       | 输入框标签   |
| `inputProp`        | `String`        | `'input'`  | 输入框属性名 |
| `inputPlaceholder` | `String`        | `'请输入'` | 输入框占位符 |
| `inputType`        | `String`        | `'text'`   | 输入框类型   |
| `inputRows`        | `Number`        | `4`        | 文本域行数   |
| `modelValue`       | `String/Number` | `''`       | 输入框值     |

#### Events

| 事件名              | 说明       | 回调参数                 |
| ------------------- | ---------- | ------------------------ |
| `update:modelValue` | 输入值变化 | `(value: string/number)` |
| `confirm`           | 确认操作   | `(formData: object)`     |

### SelectDialog

选择框弹窗组件，用于下拉选择场景。

#### Props

| 属性                | 类型            | 默认值                             | 说明         |
| ------------------- | --------------- | ---------------------------------- | ------------ |
| `selectLabel`       | `String`        | `''`                               | 选择框标签   |
| `selectProp`        | `String`        | `'select'`                         | 选择框属性名 |
| `selectPlaceholder` | `String`        | `'请选择'`                         | 选择框占位符 |
| `options`           | `Array`         | `[]`                               | 选项数据     |
| `optionProps`       | `Object`        | `{label: 'label', value: 'value'}` | 选项属性配置 |
| `modelValue`        | `String/Number` | `''`                               | 选择框值     |

### DateDialog

日期选择弹窗组件，用于日期选择场景。

#### Props

| 属性              | 类型          | 默认值         | 说明             |
| ----------------- | ------------- | -------------- | ---------------- |
| `dateLabel`       | `String`      | `''`           | 日期选择器标签   |
| `dateProp`        | `String`      | `'date'`       | 日期选择器属性名 |
| `datePlaceholder` | `String`      | `'请选择日期'` | 日期选择器占位符 |
| `dateType`        | `String`      | `'date'`       | 日期选择器类型   |
| `modelValue`      | `String/Date` | `''`           | 日期值           |

## 使用方式

### 🚀 **推荐使用方式：通过方法控制**

#### 1. 基础弹窗

```vue
<template>
	<confirm-dialog ref="dialogRef" title="确认操作" :show-icon="true" icon-type="warning" @confirm="handleConfirm" @cancel="handleCancel">
		<p>确认要执行此操作吗？</p>
	</confirm-dialog>

	<el-button @click="openDialog">打开弹窗</el-button>
</template>

<script setup>
import { ref } from 'vue';
import ConfirmDialog from '@/components/ConfirmDialog/index.vue';

const dialogRef = ref(null);

const openDialog = () => {
	dialogRef.value?.show(); // 调用子组件方法打开弹窗
};

const handleConfirm = () => {
	console.log('确认操作');
	dialogRef.value?.hide(); // 调用子组件方法关闭弹窗
};

const handleCancel = () => {
	dialogRef.value?.hide(); // 调用子组件方法关闭弹窗
};
</script>
```

#### 2. 输入框弹窗

```vue
<template>
	<input-dialog
		ref="inputDialogRef"
		v-model="inputValue"
		title="输入信息"
		input-label="备注"
		input-placeholder="请输入备注信息"
		input-type="textarea"
		:input-rows="4"
		@confirm="handleInputConfirm"
		@cancel="closeInputDialog"
	/>

	<el-button @click="openInputDialog">打开输入弹窗</el-button>
</template>

<script setup>
import { ref } from 'vue';
import InputDialog from '@/components/ConfirmDialog/InputDialog.vue';

const inputDialogRef = ref(null);
const inputValue = ref('');

const openInputDialog = () => {
	inputDialogRef.value?.show(); // 调用子组件方法打开弹窗
};

const closeInputDialog = () => {
	inputDialogRef.value?.hide(); // 调用子组件方法关闭弹窗
};

const handleInputConfirm = (formData) => {
	console.log('输入的值:', formData.input);
	inputDialogRef.value?.hide(); // 确认后关闭弹窗
};
</script>
```

#### 3. 选择框弹窗

```vue
<template>
	<select-dialog
		ref="selectDialogRef"
		v-model="selectedValue"
		title="选择选项"
		select-label="选择类型"
		select-placeholder="请选择类型"
		:options="options"
		:option-props="{ label: 'name', value: 'id' }"
		@confirm="handleSelectConfirm"
		@cancel="closeSelectDialog"
	/>

	<el-button @click="openSelectDialog">打开选择弹窗</el-button>
</template>

<script setup>
import { ref } from 'vue';
import SelectDialog from '@/components/ConfirmDialog/SelectDialog.vue';

const selectDialogRef = ref(null);
const selectedValue = ref('');
const options = [
	{ id: 1, name: '选项1' },
	{ id: 2, name: '选项2' },
	{ id: 3, name: '选项3' },
];

const openSelectDialog = () => {
	selectDialogRef.value?.show(); // 调用子组件方法打开弹窗
};

const closeSelectDialog = () => {
	selectDialogRef.value?.hide(); // 调用子组件方法关闭弹窗
};

const handleSelectConfirm = (formData) => {
	console.log('选择的值:', formData.select);
	selectDialogRef.value?.hide(); // 确认后关闭弹窗
};
</script>
```

#### 4. 日期选择弹窗

```vue
<template>
	<date-dialog
		ref="dateDialogRef"
		v-model="selectedDate"
		title="选择日期"
		date-label="选择日期"
		date-placeholder="请选择日期"
		date-type="date"
		@confirm="handleDateConfirm"
		@cancel="closeDateDialog"
	/>

	<el-button @click="openDateDialog">打开日期弹窗</el-button>
</template>

<script setup>
import { ref } from 'vue';
import DateDialog from '@/components/ConfirmDialog/DateDialog.vue';

const dateDialogRef = ref(null);
const selectedDate = ref('');

const openDateDialog = () => {
	dateDialogRef.value?.show(); // 调用子组件方法打开弹窗
};

const closeDateDialog = () => {
	dateDialogRef.value?.hide(); // 调用子组件方法关闭弹窗
};

const handleDateConfirm = (formData) => {
	console.log('选择的日期:', formData.date);
	dateDialogRef.value?.hide(); // 确认后关闭弹窗
};
</script>
```

## 弹窗控制方法

### 🔧 **核心控制方法**

所有弹窗组件都提供以下控制方法：

```typescript
// 打开弹窗
dialogRef.value?.show();

// 关闭弹窗
dialogRef.value?.hide();

// 初始化表单数据（可选）
dialogRef.value?.initFormData();
```

### 📱 **方法调用示例**

```vue
<template>
	<div>
		<!-- 弹窗组件 -->
		<input-dialog ref="inputDialogRef" v-model="inputValue" title="输入信息" @confirm="handleConfirm" />

		<!-- 控制按钮 -->
		<el-button @click="openDialog">打开弹窗</el-button>
		<el-button @click="closeDialog">关闭弹窗</el-button>
		<el-button @click="resetDialog">重置弹窗</el-button>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import InputDialog from '@/components/ConfirmDialog/InputDialog.vue';

const inputDialogRef = ref(null);
const inputValue = ref('');

// 打开弹窗
const openDialog = () => {
	inputDialogRef.value?.show();
};

// 关闭弹窗
const closeDialog = () => {
	inputDialogRef.value?.hide();
};

// 重置弹窗数据
const resetDialog = () => {
	inputDialogRef.value?.initFormData();
	inputDialogRef.value?.show();
};

// 确认操作
const handleConfirm = (formData) => {
	console.log('确认输入:', formData);
	inputDialogRef.value?.hide();
};
</script>
```

## 特性说明

### 1. **完全自主控制**

- 弹窗状态完全由子组件管理
- 父组件不需要关心弹窗的显示/隐藏逻辑
- 通过方法调用实现弹窗控制

### 2. **自动初始化**

- 每次打开弹窗时自动清空之前的数据
- 确保没有残余值，数据完全重新初始化
- 无需手动处理数据重置

### 3. **双向绑定**

- 支持 `v-model` 绑定表单数据
- 数据变化自动同步到父组件

### 4. **事件通信**

- 通过 `@confirm`、`@cancel`、`@closed`、`@opened` 等事件与父组件通信
- 事件处理完成后可以调用方法关闭弹窗

## 注意事项

1. **弹窗控制**：必须通过 `ref` 调用子组件的方法来控制弹窗
2. **数据初始化**：每次打开弹窗时数据会自动初始化，无需手动处理
3. **事件处理**：确认操作后建议调用 `hide()` 方法关闭弹窗
4. **组件引用**：确保在模板中正确设置 `ref` 属性
5. **方法调用**：使用可选链操作符 `?.` 避免引用为空时的错误

## 最佳实践

1. **统一控制方式**：建议所有弹窗都通过方法调用控制，保持代码一致性
2. **错误处理**：在调用方法前检查组件引用是否存在
3. **状态管理**：弹窗状态完全由子组件管理，父组件专注于业务逻辑
4. **数据绑定**：使用 `v-model` 实现数据的双向绑定
5. **事件处理**：在事件处理函数中调用相应的方法控制弹窗状态
