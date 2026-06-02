<template>
	<div class="layout-padding-view">
		<!-- 根据平台仓ID动态加载对应的表格组件 -->
		<component
			:is="currentTableComponent"
			ref="tableRef"
			:currentSpInfo="currentSpInfo"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, PropType } from 'vue';
import {
	AmazonTable,
	TicktockTable,
	WalmartTable,
	CdiscountTable,
} from '../../table';
interface SpInfo {
	id: string;
	spName: string;
	auth: string;
}
const props = defineProps({
	// 当前选中的平台仓
	currentSpInfo: {
		type: Object,
		required: true,
		default: () => {},
	},
	//当前有查看权限的平台仓
	platformAuthList: {
		type: Array as PropType<SpInfo[]>,
		required: true,
		default: () => [],
	},
});

// 表格组件引用
const tableRef = ref();

// 根据平台仓ID动态加载对应的表格组件
const currentTableComponent = computed(() => {
	const platformId = props.currentSpInfo?.id ?? props.platformAuthList?.[0]?.id;
	switch (platformId) {
		case 'Amazon':
			return AmazonTable;
		case 'Tiktok自运营':
			return TicktockTable;
		case 'Walmart':
			return WalmartTable;
		case 'Cdiscount':
			return CdiscountTable;
		default:
			return '';
	}
});

// 查询所有的数据
const resetData = () => {
	if (tableRef.value && tableRef.value.resetData) {
		tableRef.value.resetData();
	}
};

// 暴露给父组件的方法
defineExpose({
	resetData,
});
</script>
