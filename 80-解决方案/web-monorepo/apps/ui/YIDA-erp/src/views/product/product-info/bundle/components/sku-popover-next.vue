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
		<el-popover placement="right" :width="500">
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
				<el-table-column :label="t('图片')" type="imgUrl">
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
				<el-table-column prop="skuCode" label="SKU/产品名称" width="250">
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
							<el-row class="ellipsis-text">
								<el-col :span="24" class="flex">
									<span class="mr-1 font-color ellipsis-text">
										{{ row.skuCode }}</span
									>
									<el-link
										class="copy-icon"
										:icon="DocumentCopy"
										@click="copyText(row.skuCode)"
										underline="never"
										v-if="row.skuCode"
									></el-link>
								</el-col>
							</el-row>
							<el-row class="ellipsis-text">
								<el-col :span="24" class="flex">
									<span class="mr-1 font-color ellipsis-text">
										{{ row.skuName }}</span
									>
									<el-link
										class="copy-icon"
										:icon="DocumentCopy"
										@click="copyText(row.skuName)"
										underline="never"
										v-if="row.skuName"
									></el-link>
								</el-col>
							</el-row>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="skuQty" label="数量" />
			</el-table>
		</el-popover>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { DocumentCopy } from '@element-plus/icons-vue';
import commonFunction from '/@/utils/commonFunction';

const { t } = useI18n();

// 复制
const { copyText } = commonFunction();
const props = defineProps({
	tableData: {
		type: Array,
		default: () => [],
	},
});
</script>

<style lang="scss" scoped>
.ellipsis-text {
	max-width: 100%;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.copy-icon {
	display: none;
}
// 使用 :deep 穿透 el-table 的样式
:deep(.el-table__row:hover) {
	.copy-icon {
		display: block;
	}
}
</style>
