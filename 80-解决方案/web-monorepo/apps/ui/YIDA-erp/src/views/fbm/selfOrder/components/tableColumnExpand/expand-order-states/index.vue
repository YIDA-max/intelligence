<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-24 15:55:59
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-20 17:01:43
 * @FilePath: \qianyi-ui\src\views\fbm\selfOrder\components\tableColumnExpand\expand-order-states\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
const props = defineProps({
	currentRow: {
		type: Object,
		default: () => ({}),
	},
});
</script>
<template>
	<div class="component">
		<el-row :justify="'space-between'">
			<el-col :span="24">
				<el-row>
					<el-col :span="24" class="flex items-center justify-between">
						<span class="">{{ props.currentRow.orderStatusText }}</span>
					</el-col>
				</el-row>
			</el-col>
		</el-row>
	</div>
</template>

<style scoped lang="scss">
.component {
	width: 100%;
	height: 100%;
	gap: 8px;
	font-size: 12px;
	.items-center {
		height: 20px;
		line-height: 20px;
		margin-bottom: 3px;
	}
	.items-center-image {
		display: flex;
		align-items: center;
	}
	.items-center-icon {
		display: flex;
		align-items: center;
		span {
			margin-left: 8px;
			margin-right: 8px;
		}
	}
	.font-weight {
		font-weight: 900;
	}
}
</style>
