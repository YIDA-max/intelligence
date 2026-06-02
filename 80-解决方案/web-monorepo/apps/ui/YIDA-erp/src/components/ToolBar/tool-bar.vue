<!--
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-17 10:33:32
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-01-22 11:09:59
 * @FilePath: \qianyi-ui\src\components\ToolBar\tool-bar.vue
 * @Description:  工具栏组件
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
-->
<template>
	<div class="flex items-center justify-between mb8" style="width: 100%">
		<div>
			<slot name="left-tool"></slot>
		</div>
		<div class="flex items-center ml10">
			<slot name="right-tool"></slot>
			<!-- 动态表头 -->
			<el-tooltip
				class="item"
				effect="dark"
				:content="'设置'"
				placement="top"
				v-if="showSetting"
			>
				<el-button
					class="ml12"
					circle
					icon="Setting"
					@click="
						() => {
							ToolBarSettingRef?.open();
						}
					"
				/>
			</el-tooltip>
			<!-- 刷新功能 -->
			<el-tooltip
				class="item"
				effect="dark"
				:content="$t('queryTree.refresh')"
				placement="top"
				v-if="props.isShowRefresh"
			>
				<el-button class="ml12" circle icon="Refresh" @click="handleRefresh" />
			</el-tooltip>
			<!-- 导出 -->
			<el-tooltip
				class="item"
				effect="dark"
				:content="$t('common.exportBtn')"
				placement="top"
				v-if="props.isShowExport"
			>
				<el-button circle icon="Download" @click="handleExport" />
			</el-tooltip>
			<ToolBarSetting
				ref="ToolBarSettingRef"
				:register="props.register"
				@setColumns="setColumns"
				:columns="props.columns"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
const emit = defineEmits(['handleRefresh', 'handleExport', 'setColumns']);
const props = defineProps({
	isShowExport: {
		type: Boolean,
		default: true,
	},
	isShowRefresh: {
		type: Boolean,
		default: true,
	},
	register: {
		type: Object,
		default: () => ({}),
	},
	columns: {
		type: Array,
		default: () => [],
	},
});

// 是否显示设置按钮
const showSetting = computed(() => {
	const toolBarConfig = props?.register?.state?.toolBarConfig;
	// 有 settingKey 则一定显示，否则根据 isShowSetting 控制
	return toolBarConfig?.settingKey ? true : toolBarConfig?.isShowSetting;
});
const ToolBarSetting = defineAsyncComponent(
	() => import('./components/setting/index.vue')
);
// 表头设置组件ref
const ToolBarSettingRef = ref<InstanceType<typeof ToolBarSetting>>();
// 刷新
const handleRefresh = () => {
	emit('handleRefresh');
};

// 导出
const handleExport = () => {
	emit('handleExport');
};

// 设置表格列
const setColumns = (columns: any[]) => {
	emit('setColumns', columns);
};
// 默认组件名称
defineOptions({
	name: 'ToolBar',
});
</script>

<style lang="scss" scoped></style>
