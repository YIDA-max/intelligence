<template>
	<el-dialog
		v-bind="$attrs"
		v-model="visible"
		:close-on-click-modal="false"
		:title="dialogTitle"
		width="90%"
		@open="handleOpen"
	>
		<template #header>
			<el-row>
				<el-col :span="24" style="display: flex; align-items: center">
					<div style="font-weight: 600">
						平台订单编号：{{ detailObject.platformOrderNo }}
					</div>
					<span class="label-tag">
						{{ detailObject.deliveryMethodName || '--' }}
					</span>
					<span class="label-tag-error" v-if="detailObject?.riskLevel">
						{{ detailObject.riskLevel || '--' }}
					</span>
				</el-col>
			</el-row>
		</template>
		<div class="dialog-container">
			<el-row :gutter="20">
				<el-col :span="18">
					<!-- 基本信息 -->
					<div class="section">
						<div class="section-title">
							<span class="section-bar"></span>基本信息
						</div>
						<el-row>
							<el-col :span="8">
								平台：{{ detailObject.platformChannelCodeText }}
							</el-col>
							<el-col :span="8">国家：{{ detailObject.countryName }}</el-col>
							<el-col :span="8">店铺：{{ detailObject.storeName }}</el-col>
						</el-row>
						<el-row class="mt8">
							<!-- 如果是亚马逊则展示亚马逊订单编号 -->
							<el-col
								:span="8"
								v-if="detailObject.platformChannelCode === 'Amazon'"
							>
								亚马逊订单编号：
								{{ detailObject.platformOrderNo }}
							</el-col>
							<!-- 如果是沃尔玛则展示采购订单编号 -->
							<el-col
								:span="8"
								v-else-if="detailObject.platformChannelCode === 'Walmart'"
							>
								采购订单编号：{{ detailObject.purchaseOrderNo }}
							</el-col>
							<!-- 其他情况展示平台订单号 -->
							<el-col :span="8" v-else>
								订单编号：{{ detailObject.platformOrderNo }}
							</el-col>
							<!-- 亚马逊展示卖家订单编号 -->
							<el-col
								:span="8"
								v-if="detailObject.platformChannelCode === 'Amazon'"
								>卖家订单编号：{{ detailObject.sellerOrderNo }}</el-col
							>
							<!-- 沃尔玛展示买家订单编号 -->
							<el-col
								:span="8"
								v-if="detailObject.platformChannelCode === 'Walmart'"
								>买家订单编号：{{ detailObject.customerOrderNo }}</el-col
							>
							<el-col :span="8">
								订单状态：{{ detailObject.orderStatusName }}</el-col
							>
							<el-col
								:span="8"
								v-if="
									!(
										detailObject.platformChannelCode === 'Amazon' ||
										detailObject.platformChannelCode === 'Walmart'
									)
								"
							>
								订购时间(北京)：{{ detailObject.orderTime }}
							</el-col>
						</el-row>
						<el-row class="mt8">
							<el-col :span="8">
								付款时间(北京)：{{ detailObject.paymentTime }}
							</el-col>
							<el-col :span="8">
								分单时间(北京)：{{ detailObject.splitTime }}
							</el-col>
							<el-col :span="8"
								>发货时间(北京)：{{ detailObject.shippingTime }}
							</el-col>
						</el-row>
						<el-row
							class="mt8"
							v-if="
								detailObject.platformChannelCode === 'Amazon' ||
								detailObject.platformChannelCode === 'Walmart'
							"
						>
							<el-col :span="8">
								订购时间(北京)：{{ detailObject.orderTime }}
							</el-col>
						</el-row>
					</div>

					<!-- 买家信息 -->
					<div class="section">
						<div class="section-title">
							<span class="section-bar"></span>买家信息
						</div>
						<el-row>
							<el-col :span="8">买家姓名：{{ detailObject.buyerName }}</el-col>
							<el-col :span="8">买家邮箱：{{ detailObject.buyerEmail }}</el-col>
							<el-col :span="8">买家税号：{{ detailObject.buyerTaxNo }}</el-col>
						</el-row>
						<el-row class="mt8">
							<el-col :span="24"
								>买家留言：{{ detailObject.buyerMessage }}</el-col
							>
						</el-row>
					</div>

					<!-- 收件人信息 -->
					<div class="section">
						<div class="section-title">
							<span class="section-bar"></span>收件人信息
						</div>
						<el-row>
							<el-col :span="8"
								>收件人：{{ detailObject.recipientName }}</el-col
							>
							<el-col :span="8"
								>收件电话：{{ detailObject.recipientPhone }}</el-col
							>
							<el-col :span="8"
								>收件手机号：{{ detailObject.recipientMobile }}</el-col
							>
						</el-row>
						<el-row class="mt8">
							<el-col :span="24" class="flex">
								<div>地址：</div>
								<div>
									<div>{{ detailObject.recipientDetailAddress }}</div>
									<div>
										{{ detailObject.recipientStreet }}
										{{ detailObject.recipientDistrict }}
										{{ detailObject.recipientCity }}
										{{ detailObject.recipientState }}
									</div>
									<div>
										{{ detailObject.recipientPostcode }}
										{{ detailObject.recipientCountry }}
									</div>
								</div>
							</el-col>
						</el-row>
					</div>

					<!-- 下方表格 -->
					<el-tabs v-model="activeTab">
						<el-tab-pane label="商品信息" name="goods">
							<el-table :data="goodsList" border style="width: 100%">
								<el-table-column label="商品信息" width="320">
									<template #default="{ row }">
										<div class="flex">
											<div class="mr-1">
												<MrImg :src="row.imgUrl" />
											</div>
											<div class="flex flex-col">
												<div class="flex items-center">
													<div class="mr-1 text-width">商品标题:</div>
													<MrTextEllipsis
														:text="row.productTitle"
														:maxLength="15"
													/>
												</div>
												<div class="msku-box">
													<span
														>ItemID：<MrTextEllipsis
															:text="row.itemId"
															:maxLength="15"
														/>
													</span>
													<span class="lable-style"
														>MSKU：
														<MrTextEllipsis
															:text="row.mskuCode"
															:maxLength="15"
														/>
													</span>
												</div>
											</div>
										</div>
									</template>
								</el-table-column>
								<el-table-column label="产品名称/SKU" width="200">
									<template #default="{ row }">
										<div class="flex flex-col">
											<span>{{ row.productName || '--' }}</span>
											<span class="text-gray-500">{{
												row.skuCode || '--'
											}}</span>
											<!-- 只有亚马逊的订单才展示asin -->
											<span
												v-if="detailObject.platformChannelCode === 'Amazon'"
												>{{ row.asin || '--' }}</span
											>
										</div>
									</template>
								</el-table-column>
								<el-table-column
									label="属性"
									prop="productAttributes"
									show-overflow-tooltip
									width="180"
								/>
								<el-table-column
									label="商品状态"
									prop="goodsStatusName"
									width="120"
								/>
								<el-table-column label="商品单价" prop="unitPrice" width="120">
									<template #default="{ row }">
										<span>
											{{ detailObject.currencyCode }}{{ row.unitPrice }}
										</span>
									</template>
								</el-table-column>
								<el-table-column
									label="订购数量"
									prop="orderQuantity"
									width="120"
								/>
								<el-table-column
									label="商品总价"
									prop="productTotalPrice"
									width="140"
								>
									<template #default="{ row }">
										<span
											>{{ detailObject.currencyCode
											}}{{ row.productTotalPrice }}</span
										>
									</template>
								</el-table-column>
								<el-table-column
									label="备注"
									prop="itemRemark"
									show-overflow-tooltip
								/>
								<!-- 原本是fulfillmentMethodName 现在是fulfillmentMethod  现在又是fulfillmentMethodName 了-->
								<!-- 现在先不展示 -->
								<!-- <el-table-column
									label="履约方式"
									prop="fulfillmentMethodName"
									width="140"
								/> -->
							</el-table>
						</el-tab-pane>
					</el-tabs>
					<!-- 更多信息 -->
					<div class="mt-4 section">
						<div class="section-title">
							<span class="section-bar"></span>更多信息
						</div>
						<el-row class="mb-1">
							<el-col :span="8">
								订单更新时间：{{
									detailObject.orderUpdateTime
										? detailObject.orderUpdateTime
										: '---'
								}}
							</el-col>
							<el-col :span="8">
								最晚发货时间：{{
									detailObject.latestShippingTime
										? detailObject.latestShippingTime
										: '---'
								}}
							</el-col>
							<el-col :span="8">
								物流更新时间：{{
									detailObject.shippingUpdateTime
										? detailObject.shippingUpdateTime
										: '---'
								}}
							</el-col>
						</el-row>
						<el-row class="mb-1">
							<el-col :span="8">
								预计送达时间：{{
									detailObject.estimateDeliveryTime
										? detailObject.estimateDeliveryTime
										: '---'
								}}
							</el-col>
							<el-col :span="8">
								送达时间：{{
									detailObject.deliveryTime ? detailObject.deliveryTime : '---'
								}}
							</el-col>
							<el-col :span="8">
								取消时间：{{
									detailObject.orderCancelTime
										? detailObject.orderCancelTime
										: '---'
								}}
							</el-col>
						</el-row>
						<el-row class="mb-1">
							<el-col :span="8">
								取消原因：{{
									detailObject.orderCancelReason
										? detailObject.orderCancelReason
										: '---'
								}}
							</el-col>
							<el-col :span="8">
								折扣代码：{{
									detailObject.discountCode ? detailObject.discountCode : '---'
								}}
							</el-col>
							<el-col :span="8"> 定制信息：{{ customInfoText }} </el-col>
							<el-col :span="8">
								<!-- 后台要求是platformWarehouseId  不是 warehouseId 希望不要再改了-->
								仓库ID：{{
									detailObject.platformWarehouseId
										? detailObject.platformWarehouseId
										: '---'
								}}
							</el-col>
						</el-row>
					</div>
				</el-col>
				<!-- 右侧费用信息 -->
				<el-col :span="6">
					<div class="section">
						<div class="section-title">
							<span class="section-bar"></span>最新配送信息
						</div>
						<div
							class="amount-item"
							:style="{
								justifyContent: 'flex-start',
							}"
						>
							<span class="mr-1">买家选择物流:</span>
							<span>{{
								detailObject.buyerLogistics
									? detailObject.buyerLogistics
									: '---'
							}}</span>
						</div>
						<div
							class="amount-item"
							:style="{
								justifyContent: 'flex-start',
							}"
						>
							<span class="mr-1">物流跟踪号: </span>
							<span>{{
								detailObject?.logisticsTrackingNoList?.length > 0
									? detailObject.logisticsTrackingNoList[0]
									: '---'
							}}</span>
							<span v-if="detailObject?.logisticsTrackingNoList?.length > 1">
								<ShowList :list="detailObject.logisticsTrackingNoList" />
							</span>
						</div>
						<div
							class="amount-item"
							:style="{
								justifyContent: 'flex-start',
							}"
						>
							<span class="mr-1">承运商: </span>
							<span>{{
								detailObject?.carrierList?.length > 0
									? detailObject.carrierList[0]
									: '---'
							}}</span>
							<span v-if="detailObject?.carrierList?.length > 1">
								<ShowList :list="detailObject.carrierList" />
							</span>
						</div>
					</div>
					<div class="section">
						<div class="flex justify-between section-title">
							<div class="flex items-center">
								<span class="section-bar"></span>
								费用信息
							</div>
						</div>
						<!-- 支付方式 -->
						<div class="amount-item">
							<span>付款方式</span
							><span class="label-tag">
								{{
									detailObject.paymentMethod
										? detailObject.paymentMethod
										: '---'
								}}</span
							>
						</div>
						<div class="amount-item">
							<span>买家实付</span
							><span
								>{{ detailObject.currencyCode
								}}{{ detailObject.buyerActualPayment ?? 0 }}</span
							>
						</div>
						<div class="amount-item">
							<span>积分支付</span>
							<span>
								{{ detailObject.currencyCode }}{{ detailObject.usedPoint ?? 0 }}
							</span>
						</div>
						<div class="amount-item">
							<span>商品售价(不含税)</span
							><span
								>{{ detailObject.currencyCode
								}}{{ detailObject.productPriceExcludingTax ?? 0 }}</span
							>
						</div>
						<div class="amount-item">
							<span>订单总额</span
							><span
								>{{ detailObject.currencyCode
								}}{{ detailObject.orderTotalAmount ?? 0 }}</span
							>
						</div>
						<div class="amount-item">
							<span>买家运费</span
							><span
								>{{ detailObject.currencyCode
								}}{{ detailObject.buyerShippingFee ?? 0 }}</span
							>
						</div>
						<div class="amount-item">
							<span>订单税费</span
							><span
								>{{ detailObject.currencyCode
								}}{{ detailObject.orderTaxFee ?? 0 }}</span
							>
						</div>
						<div class="amount-item">
							<span>订单其他费用</span
							><span
								>{{ detailObject.currencyCode
								}}{{ detailObject.orderOtherFee ?? 0 }}</span
							>
						</div>
						<div class="amount-item">
							<span>退款金额</span
							><span
								>{{ detailObject.currencyCode
								}}{{ detailObject.orderRefundTotalAmount ?? 0 }}</span
							>
						</div>
						<div class="amount-item">
							<span>优惠金额</span
							><span
								>{{ detailObject.currencyCode
								}}{{ detailObject.discountAmount ?? 0 }}</span
							>
						</div>
						<div class="amount-item">
							<span>优惠券</span>
							<span> {{ detailObject.discountCoupon ?? 0 }} </span>
						</div>
						<div class="amount-item total">
							<span>平台佣金</span
							><span
								>{{ detailObject.currencyCode
								}}{{ detailObject.platformCommission ?? 0 }}</span
							>
						</div>
						<div class="amount-item total">
							<span>交易手续费</span
							><span
								>{{ detailObject.currencyCode
								}}{{ detailObject.transactionFee ?? 0 }}</span
							>
						</div>
						<div class="amount-item total">
							<span>倍率</span><span>{{ detailObject.exchangeRate ?? 0 }}</span>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<span>订单备注：{{ detailObject.orderRemark }}</span>
				<!-- 这个后台返回的是字符串，而不是数组，直接展示即可 -->
				<span>标签:{{ detailObject?.orderTag }}</span>
				<!-- 取消按钮 -->
				<el-button @click="handleClose">{{
					$t('common.cancelButtonText')
				}}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useFormatter } from '/@/hooks/useFormatter';

const { formatArrayOrString } = useFormatter();

const props = defineProps({
	title: { type: String, default: '订单详情' },
	currentRow: { type: Object, default: () => ({}) },
	visibleType: { type: String, default: 'view' },
	dictMap: { type: Object, default: () => ({}) },
});
const emit = defineEmits(['closeDialog']);
const ShowList = defineAsyncComponent(() => import('./showList/showList.vue'));
const activeTab = ref('goods');
const detailObject = computed<any>(() => props.currentRow || {});

const dialogTitle = computed(() => {
	return props.title;
});

// 商品信息与日志数据
const goodsList = computed<any[]>(() => {
	const item: any = detailObject.value || {};
	return item.orderItemDetails || [{ itemId: '12313123' }];
});

// 定制信息格式化
const customInfoText = computed(() => {
	return formatArrayOrString(detailObject.value.customInfo);
});

const visible = ref(false);
const handleOpen = async () => {
	activeTab.value = 'goods';
	visible.value = true;
};

const handleClose = () => {
	visible.value = false;
	emit('closeDialog');
};

defineExpose({
	handleOpen,
	handleClose,
});
</script>

<style lang="scss" scoped>
.dialog-container {
	padding: 0 20px;
	height: 70vh;
	overflow: auto;
}
.section {
	margin-bottom: 14px;
}
.section-title {
	font-weight: bold;
	margin: 6px 0 10px 0;
	display: flex;
	align-items: center;
}
.section-bar {
	display: inline-block;
	width: 4px;
	height: 18px;
	background: #2e5cf6;
	border-radius: 2px;
	margin-right: 8px;
}
.mt8 {
	margin-top: 8px;
}
.amount-item {
	display: flex;
	justify-content: space-between;
	padding: 6px 0;
	font-size: 13px;
}
.amount-item.total {
	font-weight: 600;
}
.mb18 {
	margin-bottom: 18px;
}
.ml10 {
	margin-left: 10px;
}
.label-tag {
	border: 1px solid #1655f1;
	padding: 2px 5px;
	color: #1655f1;
	border-radius: 5px;
	margin-left: 10px;
}
.label-tag-error {
	border: 1px solid #e6534f;
	padding: 2px 5px;
	color: #e6534f;
	border-radius: 5px;
	margin-left: 10px;
}
.dialog-footer {
	display: flex;
	justify-content: space-between;
}
.msku-box {
	display: flex;
	flex-direction: column;
}
.product-title {
	display: block;
	width: 300px; /* 固定宽度 */
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap; /* 单行显示 */
	line-height: 1.5;
}
.text-width {
	display: inline-block;
	width: 60px;
	// height: 1.5em;
}
</style>
