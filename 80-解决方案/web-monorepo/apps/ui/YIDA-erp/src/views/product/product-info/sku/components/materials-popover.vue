<!--
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-07 20:58:34
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-01-08 14:13:19
 * @FilePath: \qianyi-ui\src\views\product\product-info\sku\components\materials-popover.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<template>
	<div>
		<el-popover placement="right" :width="500" trigger="hover">
			<template #reference>
				<el-icon><ArrowDown /></el-icon>
			</template>

			<el-table
				:data="props.tableData ? props.tableData : []"
				border
				size="small"
				style="width: 100%"
				:header-cell-style="{ background: '#f5f7fa', fontWeight: 'bold' }"
				:style="{ maxHeight: '400px', overflowY: 'auto' }"
				native-scrollbar
			>
				<el-table-column prop="materialTypeText" label="产品类型">
					<!-- 需要反过来 -->
					{{ row.productType === '1' ? '配件' : '成品' }}
				</el-table-column>
				<el-table-column :label="$t('图片')" type="imgUrl">
					<template #default="{ row }">
						<MrImg :src="row.imgUrl" />
					</template>
				</el-table-column>
				<el-table-column prop="materialCode" label="SKU编码/产品名称">
					<template #default="{ row }">
						<div
							:style="{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'flex-start',
								width: '100%',
							}"
						>
							<div>{{ row.materialCode }}</div>
							<div>{{ row.materialName }}</div>
						</div>
					</template>
				</el-table-column>
				<template v-if="row.productType === '1'"
					><el-table-column prop="materialQty" label="数量"
				/></template>
			</el-table>
		</el-popover>
	</div>
</template>

<script setup lang="ts">
const props = defineProps({
	tableData: {
		type: Array,
		default: () => [],
	},
	row: {
		type: Object,
		default: () => ({}),
	},
});
</script>

<style lang="less" scoped></style>
