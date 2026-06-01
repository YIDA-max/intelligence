<script setup lang="ts">
import { inject } from 'vue';
import { postSymbol } from '/@/utils/rateUtils';
const currentRow = inject<any>('currentRow');
</script>
<template>
	<div class="info">
		<el-row>
			<el-col :span="24" class="items-center fontWeight"> 费用信息 </el-col>
		</el-row>
		<el-row>
			<el-col :span="24" class="flex items-center justify-between fontWeight">
				<div>
					<span>订单售价(不含税)</span>
				</div>
				<div>
					<span>
						{{
							postSymbol(
								currentRow.currencyCode,
								currentRow.productPriceExcludingTax
							)
						}}
					</span>
				</div>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24" class="flex items-center justify-between fontWeight">
				<div>
					<span>订单折扣</span>
				</div>
				<div>
					<span>
						{{ postSymbol(currentRow.currencyCode, currentRow.discountAmount) }}
					</span>
				</div>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24" class="flex items-center justify-between">
				<div>
					<span class="font-color">订单积分</span>
				</div>
				<div>
					<span> {{ currentRow.orderPoints || '---' }} </span>
				</div>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24" class="flex items-center justify-between"
				><div>
					<span class="font-color">订单税金</span>
				</div>
				<div>
					<span>
						{{ postSymbol(currentRow.currencyCode, currentRow.orderTaxFee) }}
					</span>
				</div>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24" class="flex items-center justify-between">
				<div>
					<span class="font-color">订单买家支付运费</span>
				</div>
				<div>
					<span>
						{{
							postSymbol(currentRow.currencyCode, currentRow.buyerShippingFee)
						}}
					</span>
				</div>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24" class="flex items-center justify-between">
				<div>
					<span class="font-color">订单其他费用</span>
				</div>
				<div>
					<span>
						{{ postSymbol(currentRow.currencyCode, currentRow.orderOtherFee) }}
					</span>
				</div>
			</el-col>
		</el-row>
		<!-- <el-row>
			<el-col :span="24" class="flex items-center justify-between">
				<div>
					<span class="font-color"> 预估运费</span>
				</div>
				<div>
					<span> {{ currentRow.totalFee ? currentRow.totalFee : '暂未计算' }} </span>
				</div>
			</el-col>
		</el-row> -->
	</div>
</template>

<style scoped lang="scss">
.info {
	width: 24%;
	height: 220px;
	border: 1px solid #e4e7ed;
	border-radius: 5px;
	padding: 12px 16px;
	font-size: 12px;
	.font-color {
		color: #939da8;
	}
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
	.fontWeight {
		font-weight: 900;
		color: #000;
	}
}
</style>
