<!--
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-07 20:58:34
 * @LastEditors: 朱寒松 3136271519@qq.com
 * @LastEditTime: 2025-07-16 16:38:46
 * @FilePath: \qianyi-ui\src\views\product\product-info\bundle\components\Sku-popover.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<template>
	<div>
		<el-popover placement="right" :width="500" trigger="click">
			<template #reference>
				<el-icon><ArrowDown /></el-icon>
			</template>

			<el-table
				:data="props.tableData ? props.tableData : []"
				border
				size="small"
				style="width: 100%"
				:header-cell-style="{ background: '#f5f7fa', fontWeight: 'bold' }"
				native-scrollbar
			>
				<el-table-column :label="t('图片')" type="imgUrl" width="100">
					<template #default="{ row }">
						<div class="flex justify-center">
							<img
								v-if="row?.imgUrl"
								:src="row?.imgUrl"
								alt="图片"
								class="object-cover w-10 h-10 rounded-md"
							/>
							<span v-else class="text-gray-400">无图片</span>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="skuCode" label="SKU/产品名称" min-width="100">
					<template #default="{ row }">
						<div
							style="
								display: flex;
								flex-direction: column;
								justify-content: center;
								align-items: flex-start;
								width: 100%;
							"
						>
							<div
								style="
									max-width: 100%;
									overflow: hidden;
									white-space: nowrap;
									text-overflow: ellipsis;
								"
							>
								{{ row.skuCode }}
							</div>
							<div
								style="
									max-width: 100%;
									overflow: hidden;
									white-space: nowrap;
									text-overflow: ellipsis;
								"
							>
								{{ row.skuName }}
							</div>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</el-popover>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const props = defineProps({
	tableData: {
		type: Array,
		default: () => [],
	},
});
</script>

<style lang="less" scoped></style>
