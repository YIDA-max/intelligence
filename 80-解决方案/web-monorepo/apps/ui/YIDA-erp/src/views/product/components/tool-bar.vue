<template>
	<div class="mb8 flex items-center justify-between" style="width: 100%">
		<div>
			<slot name="left-tool"></slot>
		</div>
		<div class="ml10 flex items-center">
			<slot name="right-tool"></slot>
			<!-- 刷新功能 -->
			<el-tooltip class="item" effect="dark" :content="$t('queryTree.refresh')" placement="top">
				<el-button class="ml12" circle icon="Refresh" @click="handleRefresh" />
			</el-tooltip>
			<!-- 导出 -->
			<el-tooltip class="item" effect="dark" :content="$t('common.exportBtn')" placement="top">
				<el-button circle icon="Download" @click="handleExport" />
			</el-tooltip>
		</div>
	</div>
</template>

<script setup lang="ts">
const emit = defineEmits(['handleRefresh', 'handleExport']);

// 刷新
const handleRefresh = () => {
	emit('handleRefresh');
};

// 导出
const handleExport = () => {
	emit('handleExport');
};
</script>

<style lang="scss" scoped></style>
