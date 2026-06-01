---
title: Tab子组件index.vue模式
type: pattern
tags: [qianyi, vue, tab, basetable]
---

# Tab 子组件 `index.vue` 模式

每个 Tab 的列表页组件，包含搜索栏、BaseTable、导出逻辑。

## 标准 Tab（无特殊操作）

```vue
<template>
	<div class="layout-padding-auto layout-padding-view">
		<el-row v-show="showSearch" class="ml10">
			<el-form
				ref="queryRef"
				:inline="true"
				:model="register.state.queryForm"
				@keyup.enter="register?.getDataList"
			>
				<AdvancedSearchStyle
					ref="AdvancedSearchStyleRef"
					showRightBtn
					@reset="resetQuery"
					@search="register?.getDataList"
				>
					<template #default>
						<el-form-item v-for="(item, index) in searchConfig" :key="index">
							<component
								:is="componentMap[item.component]"
								v-model:queryForm="register.state.queryForm"
								v-bind="item.props"
								:searchFn="register?.getDataList"
								:getDataList="register?.getDataList"
							/>
						</el-form-item>
					</template>
				</AdvancedSearchStyle>
			</el-form>
		</el-row>

		<BaseTable ref="baseTableRef" :register="register">
			<template #left-tool>
				<!-- 根据业务需求添加按钮 -->
			</template>
			<template #action>
				<div class="flex justify-center">
					<!-- 根据业务需求添加操作按钮 -->
				</div>
			</template>
		</BaseTable>
	</div>
</template>

<script setup lang="ts">
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { defineAsyncComponent, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMessage } from '/@/hooks/message';
import { auth } from '/@/utils/authFunction';
import { columns, listApi, moduleKey, searchConfig } from './config/index';

const { t } = useI18n();
const message = useMessage();

const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const AdvancedSearchStyle = defineAsyncComponent(
	() => import('/@/components/TableFormModule/advanced-search-style.vue')
);
const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);
const customCascaderApi = defineAsyncComponent(
	() => import('/@/componentsApi/customCascaderApi/index.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);

const baseTableRef = ref();
const queryRef = ref();
const AdvancedSearchStyleRef = ref();
const showSearch = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: listApi.getList,
	columns,
	toolBarConfig: {
		handleRefresh: () => register?.getDataList(),
		handleExport: () => handleExport(),
		isShowExport: auth(`${moduleKey}_export`),
		settingKey: `${moduleKey}_tabSuffix`, // 每个Tab用不同后缀区分
	},
});

const { register } = useTable(state, baseTableRef);

const componentMap: any = {
	customCascaderApi,
	TreeSelectInputApi,
	SelectInput,
	SelectDate,
};

const resetQuery = () => {
	register.state.queryForm = {};
	register?.getDataList();
};

const handleExport = async () => {
	try {
		const selectedIds = register?.getSelectedIds() || [];
		register.state.loading = true;
		await listApi.exportList({
			...register.state.queryForm,
			ascs: register.state?.ascs,
			descs: register.state?.descs,
			ids: selectedIds || [],
			current: 1,
			size: 10000,
		});
	} catch (error) {
		message.error(t(error as string));
	} finally {
		register.state.loading = false;
	}
};
</script>

<style lang="scss" scoped></style>
```

## 生成失败 Tab（需要 emit refresh-count）

在标准 Tab 基础上增加：

```typescript
// script setup 顶部增加
import { defineAsyncComponent, onMounted, reactive, ref } from 'vue';

const emit = defineEmits<{
	(e: 'refresh-count'): void;
}>();

// script setup 底部增加
onMounted(() => {
	emit('refresh-count');
});
```

## 未生成 Tab（带生成金蝶单据按钮）

参考 [generate-kd-bill-pattern](generate-kd-bill-pattern.md) 获取完整实现。

template 中 `#left-tool` 插槽增加：

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

## settingKey 命名规则

`settingKey` 用于列设置持久化，每个 Tab 必须唯一：

```typescript
// 未生成Tab
settingKey: `${moduleKey}_index`;

// 已生成Tab
settingKey: `${moduleKey}_index`;

// 生成失败Tab
settingKey: `${moduleKey}_index`;
```
