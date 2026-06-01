<!--
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-07 20:58:34
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2026-01-04 15:45:53
 * @FilePath: \qianyi-ui\src\views\product\product-info\material\components\sku-popover.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<template>
	<div>
		<el-popover placement="right" :width="400" trigger="click">
			<template #reference>
				<el-icon><ArrowDown /></el-icon>
			</template>
			<el-table :data="props.tableData" native-scrollbar>
				<el-table-column width="150" prop="img" label="图片">
					<template #default="{ row }">
						<div class="flex justify-center">
							<img
								v-if="row.img"
								:src="row.img"
								alt="图片"
								class="object-cover w-10 h-10 rounded-md"
							/>
							<span v-else class="text-gray-400">无图片</span>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="shop" label="SKU/产品名称">
					<template #default="{ row }">
						<div
							class="flex items-center"
							:style="{ flexDirection: 'column', alignItems: 'flex-start' }"
						>
							<span>
								{{ row.skuCode }}
							</span>
							<span>
								{{ row.skuName }}
							</span>
						</div>
					</template>
				</el-table-column>
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
});
</script>

<style lang="less" scoped></style>
