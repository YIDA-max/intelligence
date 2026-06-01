<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-24 15:55:59
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-11-03 17:59:49
 * @FilePath: \qianyi-ui\src\views\fbm\selfOrder\components\tableColumnExpand\expand-order-money\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { postSymbol } from '/@/utils/rateUtils';
import MrTextEllipsis from '/@/common/MrTextEllipsis/index.vue';
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
						<div>
							<span class="fontColor">订单售价(不含税)</span>
						</div>
						<div>
							<MrTextEllipsis
								:text="
									postSymbol(
										props.currentRow.currencyCode,
										props.currentRow.orderTotalAmount
									)
								"
								:max-length="8"
							/>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24" class="flex items-center justify-between">
						<div>
							<span class="fontColor">订单折扣</span>
						</div>
						<div>
							<MrTextEllipsis
								:text="
									postSymbol(
										props.currentRow.currencyCode,
										props.currentRow.discountAmount
									)
								"
								:max-length="10"
							/>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24" class="flex items-center justify-between">
						<div>
							<span class="fontColor">订单积分</span>
						</div>
						<div>
							<MrTextEllipsis
								:text="props.currentRow.orderPoints || '---'"
								:max-length="10"
							/>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24" class="flex items-center justify-between"
						><div>
							<span class="fontColor">订单税金</span>
						</div>
						<div>
							<MrTextEllipsis
								:text="
									postSymbol(
										props.currentRow.currencyCode,
										props.currentRow.orderTaxFee
									)
								"
								:max-length="10"
							/>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24" class="flex items-center justify-between">
						<div>
							<span class="fontColor">订单买家支付运费</span>
						</div>
						<div>
							<MrTextEllipsis
								:text="
									postSymbol(
										props.currentRow.currencyCode,
										props.currentRow.buyerShippingFee
									)
								"
								:max-length="8"
							/>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24" class="flex items-center justify-between">
						<div>
							<span class="fontColor">订单其他费用</span>
						</div>
						<div>
							<MrTextEllipsis
								:text="
									postSymbol(
										props.currentRow.currencyCode,
										props.currentRow.orderOtherFee
									)
								"
								:max-length="10"
							/>
						</div>
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
	.fontColor {
		color: #939da8;
	}
}
</style>
