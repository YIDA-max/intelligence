<!--
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-07 16:49:25
 * @LastEditors: 朱寒松 3136271519@qq.com
 * @LastEditTime: 2025-07-09 15:17:29
 * @FilePath: \qianyi-ui\src\views\product\product-info\material\components\associate-msku.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<template>
	<div class="py-[15px] px-[30px]">
		<el-radio-group v-model="typeValue" class="mb20">
			<el-radio-button
				v-for="type of PLATFORM_TYPE"
				:key="type.value"
				:label="type.value"
			>
				{{ type.label }}
			</el-radio-button>
		</el-radio-group>
		<el-table
			:data="state.dataList"
			style="width: 100%"
			v-loading="state.loading"
			border
			:cell-style="tableStyle.cellStyle"
			:header-cell-style="tableStyle.headerCellStyle"
			native-scrollbar
		>
			<el-table-column :label="$t('MSKU')" type="index" width="400">
				<el-input
					placeholder="请输入"
					maxlength="50"
					show-word-limit
				></el-input>
			</el-table-column>
			<el-table-column
				:label="$t('店铺/站点')"
				prop="name"
				show-overflow-tooltip
			>
				<el-select
					v-model="state.queryForm.status"
					clearable
					placeholder="请选择"
				>
					<el-option
						v-for="item in statusOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>
			</el-table-column>
			<el-table-column
				:label="$t('备注')"
				prop="dsName"
				show-overflow-tooltip
				width="400"
			>
				<el-input
					placeholder="请输入"
					maxlength="50"
					show-word-limit
				></el-input>
			</el-table-column>
			<el-table-column :label="$t('common.action')" width="120" fixed="right">
				<template #default="{ row }">
					<el-icon class="cursor-pointer" color="#2E5CF6" @click="remove(row)"
						><Minus
					/></el-icon>
					<!-- <el-button text>{{ $t('datasourceconf.docBtn') }} </el-button> -->
				</template>
			</el-table-column>
		</el-table>

		<el-icon class="cursor-pointer m-[15px]" color="#2E5CF6"><Plus /></el-icon>
	</div>
</template>

<script setup lang="ts">
import { PLATFORM_TYPE } from '../../../constant/index';
import { BasicTableProps, useTable } from '/@/hooks/table';

// TODO: 接口未调试
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	// pageList: fetchList,
	descs: ['create_time'],
});

//  table hook getDataList,
const { tableStyle } = useTable(state);

const typeValue = ref(0);

const statusOptions = ref([
	{
		label: 1,
		value: 1,
	},
]);

// 移除
const remove = () => {
	// console.log(row);
};
</script>

<style lang="scss" scoped></style>
