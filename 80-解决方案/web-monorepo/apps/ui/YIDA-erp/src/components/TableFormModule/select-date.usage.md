# SelectDate 组件使用说明

## 功能特性

- 支持日期范围选择（日/周/月/年）
- 支持自动初始化默认值（在 setup 阶段，确保 useTable 查询时参数已就绪）
- 支持重置到初始默认值（通过 ref + expose）
- 配置集中在 searchTypes 中，易于维护

## 配置说明

### searchTypes 配置项

```typescript
{
  label: string;              // 下拉选项显示文本
  value: string;              // 下拉选项值
  isAddHMS: boolean;          // 是否添加时分秒（00:00:00 ~ 23:59:59）
  dateStart: string;          // 开始日期字段名
  dateEnd: string;            // 结束日期字段名
  dateStartText?: string;     // 开始日期占位文本（可选）
  dateEndText?: string;       // 结束日期占位文本（可选）

  // 默认值配置（三选一）
  defaultCurrentMonth?: boolean;        // 默认本月
  defaultYear?: number | 'current';     // 默认某年或当前年
  defaultMonthsAgo?: number;            // 默认回溯 N 个月

  // 自动初始化配置
  autoInit?: boolean;         // 是否在 setup 阶段自动初始化到 queryForm
}
```

## 使用示例

### 1. 配置文件（config/index.ts）

```typescript
export const searchConfig = [
	{
		component: 'SelectDate',
		props: {
			dateType: 'month', // 日期选择器类型：date/week/month/year
			searchTypes: [
				{
					label: '日期',
					value: 'reportMonth',
					isAddHMS: true,
					dateStart: 'reportMonthStart',
					dateEnd: 'reportMonthEnd',
					defaultCurrentMonth: true, // 默认本月
					autoInit: true, // 自动初始化
				},
			],
		},
	},
];
```

### 2. 父组件（index.vue）

```vue
<template>
	<el-form-item v-for="(item, index) in searchConfig" :key="index">
		<component
			:is="componentMap[item.component]"
			:ref="(el: any) => setComponentRef(el, item.component)"
			v-model:queryForm="register.state.queryForm"
			v-bind="item.props"
		/>
	</el-form-item>
</template>

<script setup lang="ts">
// 收集组件实例
const componentRefs = ref<Record<string, any[]>>({});

const setComponentRef = (el: any, componentName: string) => {
	if (el) {
		if (!componentRefs.value[componentName]) {
			componentRefs.value[componentName] = [];
		}
		if (!componentRefs.value[componentName].includes(el)) {
			componentRefs.value[componentName].push(el);
		}
	}
};

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {}, // SelectDate 会自动初始化
});

const resetQuery = () => {
	register.state.queryForm = {};

	// 调用所有 SelectDate 组件的重置方法
	componentRefs.value['SelectDate']?.forEach((comp: any) => {
		comp?.resetToDefault?.();
	});

	register?.getDataList();
};
</script>
```

## 默认值配置示例

### 本月

```typescript
{
  defaultCurrentMonth: true,
  autoInit: true,
}
// 结果：2026-03-01 00:00:00 ~ 2026-03-31 23:59:59
```

### 当前年

```typescript
{
  defaultYear: 'current',
  autoInit: true,
}
// 结果：2026-01-01 00:00:00 ~ 2026-12-31 23:59:59
```

### 回溯 3 个月

```typescript
{
  defaultMonthsAgo: 3,
  autoInit: true,
}
// 结果：2025-12-30 00:00:00 ~ 2026-03-30 23:59:59
```

### 不带时分秒

```typescript
{
  defaultCurrentMonth: true,
  isAddHMS: false,
  autoInit: true,
}
// 结果：2026-03-01 ~ 2026-03-31
```

## 重置机制说明

组件通过 `defineExpose` 暴露 `resetToDefault` 方法，父组件通过 ref 收集组件实例后调用：

```typescript
// 1. 收集组件实例
const setComponentRef = (el: any, componentName: string) => {
	if (el) {
		componentRefs.value[componentName] =
			componentRefs.value[componentName] || [];
		componentRefs.value[componentName].push(el);
	}
};

// 2. 调用重置方法
componentRefs.value['SelectDate']?.forEach((comp: any) => {
	comp?.resetToDefault?.();
});
```

## 注意事项

1. `autoInit: true` 会在 setup 阶段立即初始化，确保 useTable 查询时参数已就绪
2. 重置功能通过 ref 直接调用组件的 `resetToDefault` 方法
3. 所有配置集中在 searchTypes 中，无需在父组件手动初始化
4. 支持多个日期范围（如创建时间、更新时间），切换时自动清空其他字段
5. 使用 `:ref="(el) => setComponentRef(el, item.component)"` 动态收集组件实例
