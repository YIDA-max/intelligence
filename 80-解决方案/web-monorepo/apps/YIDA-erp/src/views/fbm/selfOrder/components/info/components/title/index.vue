<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-28 20:37:09
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-22 15:00:43
 * @FilePath: \qianyi-ui\src\views\fbm\selfOrder\components\info\components\title\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { inject } from 'vue';
// 1. 注入爷爷提供的数据（类型提示：Ref<string>）
const currentRow = inject<any>('currentRow');
</script>
<template>
	<div class="title">
		<el-row :gutter="24">
			<el-col :span="2">
				<div>订单详情</div>
			</el-col>
			<el-col :span="6">
				<div class="w-full pl-2 pr-2 truncate">
					<span class="font-color"> 系统订单号: </span>
					{{ currentRow.selfOrderNo || '---' }}
				</div>
			</el-col>
			<el-col :span="16">
				<el-row>
					<el-col :span="12">
						<div class="w-full pl-2 pr-2 truncate">
							<span class="font-color"> 平台单号: </span>
							{{ currentRow.platformOrderNo || '---' }}
						</div>
					</el-col>
					<el-col :span="12">
						<div class="w-full pl-2 pr-2 truncate">
							<span class="font-color"> 发货状态: </span>
							<el-tag
								:type="
									currentRow.orderStatus === 5
										? 'success'
										: currentRow.orderStatus === 4
										? 'info'
										: currentRow.orderStatus === 3
										? 'warning'
										: 'default'
								"
								effect="dark"
								>{{ currentRow.orderStatusText || '暂无状态' }}
							</el-tag>
						</div>
					</el-col>
				</el-row>
			</el-col>
		</el-row>
	</div>
</template>

<style scoped lang="scss">
.title {
	font-size: 12px;
	.font-color {
		color: #939da8;
	}
}
</style>
