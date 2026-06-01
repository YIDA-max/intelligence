---
title: 主入口index.vue模式
type: pattern
tags: [qianyi, vue, tabs, index]
---

# 主入口 `index.vue` 模式

Tabs 容器组件，负责 Tab 切换、权限控制、失败数量刷新。

## 完整示例（3 个 Tab，第 3 个带数量）

```vue
<template>
	<div class="layout-padding">
		<el-tabs v-model="activeName" type="border-card">
			<!-- 未生成 -->
			<el-tab-pane
				:label="$t('未生成')"
				name="notGenerated"
				:style="{ height: '100%' }"
				v-if="auth('moduleKey_notGeneratedOrder_view')"
			>
				<NotGeneratedOrder
					v-if="activeName === 'notGenerated'"
					@refresh-failed-count="refreshFailedCount"
				/>
			</el-tab-pane>

			<!-- 已生成 -->
			<el-tab-pane
				:label="$t('已生成')"
				name="generated"
				:style="{ height: '100%' }"
				v-if="auth('moduleKey_generatedOrder_view')"
			>
				<GeneratedOrder v-if="activeName === 'generated'" />
			</el-tab-pane>

			<!-- 生成失败 - 带数量显示 -->
			<el-tab-pane
				name="generatedFailed"
				:style="{ height: '100%' }"
				v-if="auth('moduleKey_generatedFailedOrder_view')"
			>
				<template #label>
					{{ $t('生成失败') }}
					<span class="text-red-500">（{{ failedCount }}）</span>
				</template>
				<GeneratedFailedOrder
					v-if="activeName === 'generatedFailed'"
					@refresh-count="refreshFailedCount"
				/>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref } from 'vue';
import { auth } from '/@/utils/authFunction';
import { getXxxGeneratedFailedPage } from '/@/api/integrations/xxx/moduleName';

const NotGeneratedOrder = defineAsyncComponent(
	() => import('./notGeneratedOrder/index.vue')
);
const GeneratedOrder = defineAsyncComponent(
	() => import('./generatedOrder/index.vue')
);
const GeneratedFailedOrder = defineAsyncComponent(
	() => import('./generatedFailedOrder/index.vue')
);

const activeName = ref('notGenerated');
const failedCount = ref(0);

// 刷新生成失败数量
function refreshFailedCount() {
	getXxxGeneratedFailedPage({ current: 1, size: 1000 })
		.then((res: any) => {
			failedCount.value = res?.data?.total || 0;
		})
		.catch(() => {
			failedCount.value = 0;
		});
}

onMounted(() => {
	refreshFailedCount();
});
</script>

<style lang="scss" scoped></style>
```

## 关键规则

- Tab 组件用 `defineAsyncComponent` 懒加载
- `v-if="activeName === 'tabName'"` 确保切换时重新渲染
- 不显示数量的 Tab 用 `:label="$t('Tab名称')"` 直接绑定
- 显示数量的 Tab 用 `<template #label>` 插槽
- 未生成 Tab 需要监听 `@refresh-failed-count` 事件（生成操作后刷新失败数量）
- 生成失败 Tab 需要监听 `@refresh-count` 事件（挂载时触发）
- `auth()` 参数格式：`moduleKey_tabDirName_view`
