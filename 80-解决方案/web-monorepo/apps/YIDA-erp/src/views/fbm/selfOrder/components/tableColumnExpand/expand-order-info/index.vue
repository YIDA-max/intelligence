<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-24 15:55:59
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-21 10:35:53
 * @FilePath: \qianyi-ui\src\views\fbm\selfOrder\components\tableColumnExpand\expand-order-info\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { postUpdateSkuRemark } from '/@/api/fbm/selfOrder/index';
import { postSymbol } from '/@/utils/rateUtils';
import MrTextEllipsis from '/@/common/MrTextEllipsis/index.vue';
import { ArrowDown } from '@element-plus/icons-vue';
import { DocumentCopy } from '@element-plus/icons-vue';
import commonFunction from '/@/utils/commonFunction';
const { copyText } = commonFunction();
const Message = defineAsyncComponent(
	() => import('/@/views/fbm/selfOrder/components/message/index.vue')
);
const getDataList = inject('getDataList') as () => void;
const props = defineProps({
	currentRow: {
		type: Object,
		default: () => ({}),
	},
});
</script>
<template>
	<div class="component">
		<div
			v-for="item in props.currentRow?.orderItemVOList"
			:key="item.id"
			class="mb-2"
			:style="{ borderBottom: '1px solid #ebeef5', paddingBottom: '8px' }"
		>
			<el-row class="row">
				<el-col :span="8">
					<el-row class="gap-2">
						<el-col
							:span="5"
							class="items-center-image"
							style="width: 50px; min-width: 50px; flex-shrink: 0"
						>
							<el-image
								style="
									width: 50px;
									height: 50px;
									border-radius: 4px;
									object-fit: contain;
								"
								:src="item.imgUrl"
								:preview-src-list="[item.imgUrl]"
								:preview-teleported="true"
								fit="contain"
								lazy
								:loading="'lazy'"
							>
								<template #placeholder>
									<div
										style="
											width: 50px;
											height: 50px;
											border-radius: 4px;
											background: linear-gradient(
												90deg,
												#f0f0f0 25%,
												#e0e0e0 50%,
												#f0f0f0 75%
											);
											background-size: 200% 100%;
											animation: skeleton-loading 1.5s ease-in-out infinite;
										"
									></div>
								</template>
							</el-image>
						</el-col>
						<el-col :span="16">
							<el-row>
								<el-col
									:span="24"
									class="truncate fontWeight flex items-center"
								>
									<div
										v-if="item.bundleFlag === 1"
										style="
											display: inline-flex;
											align-items: center;
											justify-content: center;
											height: 19px;
											min-width: 19px;
											color: #67c23a;
											border: 1px solid #67c23a;
											margin-right: 4px;
											padding: 0 4px;
											border-radius: 2px;
											font-size: 12px;
											line-height: 1;
										"
									>
										含
									</div>
									<MrTextEllipsis
										:text="item.skuName || '---'"
										:max-length="50"
									/>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="24" class="flex">
									<div class="fontColor">SKU:</div>
									<div class="truncate fontWeight">
										{{ item.skuCode || '---' }}
									</div>
									<div
										style="
											display: flex;
											align-items: center;
											height: 19px;
											color: #ff0000;
											border: 1px solid red;
											margin-right: 4px;
											padding: 2px;
											border-radius: 2px;
										"
										class="ml-2"
										v-if="item.giftFlag == 1"
									>
										赠
									</div>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="24" class="flex">
									<div class="whitespace-nowrap fontColor">三方仓SKU:</div>
									<MrTextEllipsis
										:text="item.warehouseSkuCode || '---'"
										:max-length="20"
									/>
									<el-link
										class="ml-1"
										v-if="item.warehouseSkuCode"
										:icon="DocumentCopy"
										@click="copyText(item.warehouseSkuCode)"
										underline="never"
									></el-link>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="24" class="flex w-full truncate">
									<div class="fontColor whitespace-nowrap">特殊属性:</div>
									<MrTextEllipsis
										:text="item.specialAttribute || '---'"
										:max-length="20"
									/>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="24" class="flex w-full truncate">
									<div class="fontColor">产品备注:</div>
									<MrTextEllipsis
										:text="item.itemRemark || '---'"
										:max-length="20"
									/>
									<span v-auth="'selfOrder-editItemRemark'">
										<Message
											:params="item"
											:title="'产品备注'"
											type="1"
											:api="postUpdateSkuRemark"
											@submit="
												() => {
													getDataList();
												}
											"
										/>
									</span>
								</el-col>
							</el-row>
						</el-col>
					</el-row>
				</el-col>
				<el-col :span="6">
					<el-row>
						<el-col :span="24" class="truncate fontWeight">
							<MrTextEllipsis
								:text="item.productTitle || '---'"
								:max-length="50"
							/>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24" class="flex">
							<div class="whitespace-nowrap fontColor">MSKU:</div>
							<MrTextEllipsis :text="item.mskuCode || '---'" :max-length="20" />
							<el-link
								class="ml-1"
								v-if="item.mskuCode"
								:icon="DocumentCopy"
								@click="copyText(item.mskuCode)"
								underline="never"
							></el-link>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24" class="flex">
							<div class="whitespace-nowrap fontColor">ItemId:</div>
							<MrTextEllipsis :text="item.itemId || '---'" :max-length="20" />
							<el-link
								class="ml-1"
								v-if="item.itemId"
								:icon="DocumentCopy"
								@click="copyText(item.itemId)"
								underline="never"
							></el-link>
						</el-col>
					</el-row>
					<!-- <el-row>
						<el-col :span="24" class="flex">
							<div>
								<span class="fontColor">销售负责人:</span>
							</div>
							<div>
								<span class="fontWeight"> {{ item.operationUser || '---' }} </span>
							</div>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24" class="flex">
							<div>
								<span class="fontColor">客选物流:</span>
							</div>
							<div>
								<span class="fontWeight"> {{ '暂无字段' }} </span>
							</div>
						</el-col>
					</el-row> -->
					<el-row>
						<el-col :span="24" class="flex">
							<div>
								<span class="fontColor">运营:</span>
							</div>
							<div>
								<span class="fontWeight">
									{{ item.operationUser || '---' }}
								</span>
							</div>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24" class="flex">
							<div>
								<span class="fontColor">运营小组:</span>
							</div>
							<div>
								<span class="fontWeight"> {{ item.deptName || '---' }} </span>
							</div>
						</el-col>
					</el-row>
				</el-col>
				<el-col :span="3">
					<el-row>
						<el-col :span="24" class="flex">
							<div>
								<!-- 订购-已作废=应发 -->
								<span class="fontColor">应发:</span>
							</div>
							<div>
								<span class="fontWeight">
									{{
										Number(item.orderQuantity ? item.orderQuantity : 0) -
											Number(item.nullifyQuantity ? item.nullifyQuantity : 0) ||
										'---'
									}}
									<el-popover placement="left" trigger="hover" width="160">
										<template #default>
											<el-row>
												<el-col :span="24" class="flex">
													<span class="fontColor"> 订购: </span>
													<span class="mr-1">
														{{ item.orderQuantity || '---' }}</span
													>
												</el-col>
											</el-row>
											<el-row>
												<el-col :span="24" class="flex">
													<span class="fontColor"> 已作废: </span>
													<span class="mr-1">
														{{ item.nullifyQuantity || '---' }}</span
													>
												</el-col>
											</el-row>
										</template>
										<template #reference>
											<el-link :icon="ArrowDown" underline="never"></el-link>
										</template>
									</el-popover>
								</span>
							</div>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24" class="flex">
							<div>
								<!-- 应发-已发=未发 -->
								<span class="fontColor">未发:</span>
							</div>
							<div>
								<span class="fontWeight">
									{{
										(Number(item.orderQuantity ? item.orderQuantity : 0) -
											Number(item.nullifyQuantity ? item.nullifyQuantity : 0) ||
											0) -
										(Number(item.shippedQuantity ? item.shippedQuantity : 0) ||
											0)
									}}
								</span>
							</div>
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="24" class="flex">
							<div>
								<span class="fontColor">已发:</span>
							</div>
							<div>
								<span class="fontWeight">
									<span class="orangeColor" v-if="item.shippedQuantity">{{
										item.shippedQuantity
									}}</span>
									<span v-else>---</span>
								</span>
							</div>
						</el-col>
					</el-row>
				</el-col>
				<el-col :span="6">
					<el-row>
						<el-col :span="24" class="flex">
							<div class="whitespace-nowrap fontColor">商品单价(不含税):</div>
							<MrTextEllipsis
								:text="
									postSymbol(props.currentRow.currencyCode, item.unitPrice)
								"
								:max-length="10"
							/>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24" class="flex items-start">
							<div class="whitespace-nowrap fontColor">商品售价(不含税):</div>
							<MrTextEllipsis
								:text="
									postSymbol(props.currentRow.currencyCode, item.sellingPrice)
								"
								:max-length="10"
							/>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24" class="flex">
							<div class="whitespace-nowrap fontColor">商品折扣:</div>
							<MrTextEllipsis
								:text="postSymbol(props.currentRow.currencyCode, item.discount)"
								:max-length="20"
							/>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24" class="flex">
							<div class="whitespace-nowrap fontColor">商品积分:</div>
							<MrTextEllipsis :text="item.points || '---'" :max-length="20" />
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24" class="flex">
							<div class="whitespace-nowrap fontColor">商品税金:</div>
							<MrTextEllipsis
								:text="postSymbol(props.currentRow.currencyCode, item.tax)"
								:max-length="20"
							/>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24" class="flex">
							<div class="whitespace-nowrap fontColor">商品买家支付运费:</div>
							<MrTextEllipsis
								:text="
									postSymbol(
										props.currentRow.currencyCode,
										item.customerPaidShipping
									)
								"
								:max-length="20"
							/>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24" class="flex">
							<div class="whitespace-nowrap fontColor">商品其他费用:</div>
							<MrTextEllipsis
								:text="postSymbol(props.currentRow.currencyCode, item.otherFee)"
								:max-length="20"
							/>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24" class="flex">
							<div class="whitespace-nowrap fontColor">利润:</div>
							<MrTextEllipsis
								:text="postSymbol(props.currentRow.currencyCode, item.profit)"
								:max-length="20"
							/>
						</el-col>
					</el-row>
				</el-col>
			</el-row>
		</div>
		<el-row class="row">
			<el-col :span="24">
				<el-row class="row" v-if="props.currentRow?.errorInfo">
					<span class="red fontColor mr-1"> 异常信息:</span>
					<MrTextEllipsis
						:text="props.currentRow?.errorInfo"
						:max-length="100"
					/>
				</el-row>
				<el-row class="row" v-if="props.currentRow?.message">
					<span class="green fontColor mr-1"> 提示备注:</span>
					<MrTextEllipsis :text="props.currentRow?.message" :max-length="20" />
				</el-row>
				<el-row class="row" v-if="props.currentRow?.sellerRemark">
					<span class="green fontColor mr-1"> 卖家备注:</span>
					<MrTextEllipsis
						:text="props.currentRow?.sellerRemark"
						:max-length="100"
					/>
				</el-row>
				<el-row class="row" v-if="props.currentRow?.buyerInfoVO?.buyerMessage">
					<span class="green fontColor mr-1"> 买家备注:</span>
					<MrTextEllipsis
						:text="props.currentRow?.buyerInfoVO?.buyerMessage"
						:max-length="100"
					/>
				</el-row>
				<el-row class="row" v-if="props.currentRow?.orderRemark">
					<span class="green fontColor mr-1"> 订单备注:</span>
					<MrTextEllipsis
						:text="props.currentRow?.orderRemark"
						:max-length="100"
					/>
				</el-row>
				<el-row class="row" v-if="props.currentRow?.orderExtensionVO?.csNote">
					<span class="green fontColor mr-1"> 客服备注:</span>
					<MrTextEllipsis
						:text="props.currentRow?.orderExtensionVO?.csNote"
						:max-length="100"
					/>
				</el-row>
			</el-col>
		</el-row>
	</div>
</template>

<style scoped lang="scss">
/* 骨架屏加载动画 */
@keyframes skeleton-loading {
	0% {
		background-position: 200% 0;
	}
	100% {
		background-position: -200% 0;
	}
}

.component {
	gap: 8px;
	width: 100%;
	height: 100%;
	font-size: 12px;
	.row {
		width: 100%;
		.items-center-image {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			width: 50px;
			min-width: 50px;
			flex-shrink: 0;

			:deep(.el-image) {
				width: 50px !important;
				height: 50px !important;
				min-width: 50px !important;
				flex-shrink: 0 !important;

				.el-image__inner {
					width: 50px !important;
					height: 50px !important;
					object-fit: contain;
				}
			}
		}
		.fontWeight {
			font-weight: 500;
		}
		.fontColor {
			color: #939da8;
		}
		.red {
			color: red;
		}
		.green {
			color: green;
		}
		.orangeColor {
			color: orange;
		}
	}
}
</style>
