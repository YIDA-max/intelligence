<!--
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-07 20:58:34
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-01-08 14:14:30
 * @FilePath: \qianyi-ui\src\views\product\product-info\sku\components\msku-popover.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<template>
	<div>
		<el-popover
			placement="right"
			:width="500"
			trigger="hover"
			@show="
				() => {
					groupedData = groupByPlatformToArray();
				}
			"
		>
			<template #reference>
				<el-icon><ArrowDown /></el-icon>
			</template>

			<!-- Tabs + Table 展示 -->
			<div class="max-h-[400px] overflow-auto p-2">
				<el-tabs v-model="activeTab" tab-position="top" class="sku-tabs">
					<el-tab-pane
						v-for="group in groupedData"
						:key="group.name"
						:label="group.label"
						:name="group.value"
					>
						<el-table
							:data="group.tableData"
							border
							size="small"
							style="width: 100%"
							:header-cell-style="{ background: '#f5f7fa', fontWeight: 'bold' }"
						>
							<el-table-column prop="mskuCode" label="MSKU" min-width="120" />
							<el-table-column
								prop="storeAndSiteText"
								label="店铺/站点"
								min-width="100"
							/>
						</el-table>
					</el-tab-pane>
				</el-tabs>

				<!-- 空数据提示 -->
				<div
					v-if="groupedData.length === 0"
					class="text-sm text-center text-gray-400"
				>
					暂无平台数据
				</div>
			</div>
		</el-popover>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { watch } from 'vue';

type DataItem = {
	platform: string;
	[key: string]: any;
};

type GroupedItem = {
	label: string;
	value: string;
	name?: string;
	tableData: DataItem[];
};
const props = defineProps({
	tableData: {
		type: Array,
		default: () => [],
	},
	dictMap: {
		type: Object,
		default: () => ({}),
	},
});
const groupedData = ref<GroupedItem[]>([]);
const activeTab = ref('');
watch(
	() => groupedData.value,
	(val) => {
		if (val.length > 0) {
			activeTab.value = val[0].value; // 默认激活第一个 tab
		}
	}
);
/**
 * 根据 platform 分类，并转成数组形式（含 name 和 list）
 * @param data 原始数据数组
 * @returns 分组后的数组
 */
function groupByPlatformToArray(): GroupedItem[] {
	// 关联MSKU
	const setMSKU: Array<{ label: string; value: string; tableData: any[] }> = [];
	// 遍历平台字典
	props?.dictMap.platform?.forEach((item: any) => {
		// 筛选对应平台的MSKU
		const mskus = props.tableData.filter((msku: any) => {
			return msku.platformChannelCode === item.value;
		});

		// 如果该平台有数据，才将其加入到 setMSKU 数组中
		if (mskus.length > 0) {
			setMSKU.push({
				label: item.label,
				value: item.value,
				tableData: mskus,
			});
		}
	});

	return setMSKU;
}

// watch(
// 	() => props.tableData,
// 	(newVal) => {
// 		if (newVal && newVal.length > 0) {
// 			groupedData.value = groupByPlatformToArray();
// 		} else {
// 			groupedData.value = [];
// 		}
// 	},

// 	{ immediate: true }
// );
</script>

<style lang="less" scoped></style>
