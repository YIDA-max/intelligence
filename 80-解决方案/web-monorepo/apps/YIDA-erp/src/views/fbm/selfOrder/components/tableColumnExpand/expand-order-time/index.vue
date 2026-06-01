<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-24 15:55:59
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-05-20 15:04:36
 * @FilePath: \qianyi-ui\src\views\fbm\selfOrder\components\tableColumnExpand\expand-order-time\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { computed } from 'vue';
import MrTextEllipsis from '/@/common/MrTextEllipsis/index.vue';

const props = defineProps({
	currentRow: {
		type: Object,
		default: () => ({}),
	},
});

/** 根据最晚发货时间计算剩余/超时文案 */
function formatRemainUntilLatestShipping(deadlineStr: unknown): string {
	// 最晚发货时间 - 当前时间 = 剩余时间
	if (deadlineStr == null || deadlineStr === '') return '---';
	const s = String(deadlineStr).trim();
	const end = new Date(s.replace(/-/g, '/'));
	if (Number.isNaN(end.getTime())) return '---';
	const ms = end.getTime() - Date.now();
	const abs = Math.abs(ms);
	const days = Math.floor(abs / 86400000);
	const hours = Math.floor((abs % 86400000) / 3600000);
	const minutes = Math.floor((abs % 3600000) / 60000);
	const parts: string[] = [];
	if (days > 0) parts.push(`${days}天`);
	if (hours > 0) parts.push(`${hours}小时`);
	if (minutes > 0 || parts.length === 0) parts.push(`${minutes}分钟`);
	const dur = parts.join('');
	if (ms < 0) return `已超时 ${dur}`;
	return `剩余 ${dur}`;
}

const remainShippingText = computed(() =>
	formatRemainUntilLatestShipping(props.currentRow?.latestShippingTime)
);
</script>
<template>
	<div class="component">
		<el-row :justify="'space-between'">
			<el-col :span="24" class="flex">
				<div class="mr-1 fontColor">订购:</div>
				<MrTextEllipsis
					:text="props.currentRow.orderTime || '---'"
					:max-length="20"
				/>
			</el-col>
			<el-col :span="24" class="flex">
				<div class="mr-1 fontColor">付款:</div>
				<div>
					<MrTextEllipsis
						:text="props.currentRow.paymentTime || '---'"
						:max-length="20"
					/>
				</div>
			</el-col>
			<el-col :span="24" class="flex">
				<div>
					<span class="mr-1 fontColor">最晚发货时间:</span>
				</div>
				<div>
					<MrTextEllipsis
						:text="props.currentRow.latestShippingTime || '---'"
						:max-length="13"
					/>
				</div>
			</el-col>
			<el-col :span="24" class="flex">
				<div class="mr-1 fontColor">剩余发货时间:</div>
				<div
					:style="{
						color: 'red',
						fontWeight: 'bold',
					}"
				>
					<MrTextEllipsis :text="remainShippingText" :max-length="8" />
				</div>
			</el-col>
			<el-col :span="24" class="flex">
				<div class="mr-1 fontColor">创建时间:</div>
				<MrTextEllipsis
					:text="props.currentRow.createTime || '---'"
					:max-length="20"
				/>
			</el-col>
			<el-col :span="24" class="flex">
				<div class="mr-1 fontColor">审核时间:</div>
				<MrTextEllipsis
					:text="props.currentRow.reviewTime || '---'"
					:max-length="20"
				/>
			</el-col>
			<!-- <el-row>
					<el-col :span="24" class="flex items-center">
						<div>
							<span class="mr-1 fontColor">分单:</span>
						</div>
						<div>
							<span>{{ props.currentRow.splitTime || '---' }} </span>
						</div>
					</el-col>
				</el-row> -->
			<!-- <el-row v-if="props.currentRow.shippingTime">
					<el-col :span="24" class="flex items-center">
						<div>
							<span class="mr-1">发货:</span>
						</div>
						<div>
							<span>{{ props.currentRow.shippingTime }} </span>
						</div>
					</el-col>
				</el-row> -->
			<!-- <el-row>
					<el-col :span="24" class="flex items-center">
						<div>
							<span class="mr-1 fontColor">送达:</span>
						</div>
						<div>
							<span>{{ props.currentRow.deliveryTime || '---' }} </span>
						</div>
					</el-col>
				</el-row> -->
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
	.fontColor {
		color: #939da8;
	}
}
</style>
