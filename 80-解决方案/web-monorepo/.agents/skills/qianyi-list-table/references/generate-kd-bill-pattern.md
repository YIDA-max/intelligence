---
title: 生成金蝶单据按钮逻辑
type: pattern
tags: [qianyi, generate, kingdee, useResultDialog]
---

# 生成金蝶单据按钮逻辑

未生成 Tab 特有的操作，点击后调用生成接口，处理部分失败的情况。

## 依赖

```typescript
import { confirmGenerateKdBill } from '/@/views/integrations/components/indexConfig';
import { useResultDialog } from '/@/hooks/useResultDialog';
```

## 完整实现

在标准 Tab 的 `<script setup>` 中增加以下内容：

```typescript
// 在其他import之后添加
import { confirmGenerateKdBill } from '/@/views/integrations/components/indexConfig';
import { useResultDialog } from '/@/hooks/useResultDialog';

// 在 useTable 之后添加
const { open } = useResultDialog();

// emit（放在 useTable 之前或之后均可）
const emit = defineEmits(['refresh-failed-count']);

// 生成金蝶单据
const generateKdBill = async () => {
	try {
		const selectedIds = register?.getSelectedIds() || [];

		// 弹出确认框（内部处理取消逻辑）
		await confirmGenerateKdBill(selectedIds);

		register.state.loading = true;

		const res: any = await listApi.generateList({
			...register.state.queryForm,
			ascs: register.state?.ascs,
			descs: register.state?.descs,
			ids: selectedIds || [],
			current: 1,
			size: 10000,
		});

		if (res.code === 0) {
			if (res.data?.failCount > 0) {
				// 有失败记录，打开结果弹窗
				open({
					title: t('生成金蝶单据失败'),
					data: res.data,
				});
			} else {
				useMessage().success('操作成功');
			}
			register?.getDataList();
		}
	} catch (error: any) {
		if (error.message !== 'cancelled') {
			useMessage().error(error?.msg || t('错误'));
		}
	} finally {
		// 无论成功失败都刷新失败数量
		emit('refresh-failed-count');
		register.state.loading = false;
	}
};
```

## Template 中的按钮

```vue
<template #left-tool>
	<el-button
		type="primary"
		class="ml10"
		v-auth="`${moduleKey}_generate`"
		@click="generateKdBill"
		>{{ $t('生成金蝶单据') }}</el-button
	>
</template>
```

## 主入口 index.vue 中的事件监听

未生成 Tab 组件需要将 `refresh-failed-count` 事件传递给父组件：

```vue
<!-- 主入口 index.vue -->
<NotGeneratedOrder
	v-if="activeName === 'notGenerated'"
	@refresh-failed-count="refreshFailedCount"
/>
```

## 逻辑说明

1. `confirmGenerateKdBill` 内部弹出确认框，用户取消时 throw `{ message: 'cancelled' }`
2. 生成接口返回 `res.data.failCount` 表示失败数量
3. 有失败时用 `useResultDialog` 展示失败详情弹窗
4. `finally` 中必须触发 `refresh-failed-count`，确保失败 Tab 数量更新
