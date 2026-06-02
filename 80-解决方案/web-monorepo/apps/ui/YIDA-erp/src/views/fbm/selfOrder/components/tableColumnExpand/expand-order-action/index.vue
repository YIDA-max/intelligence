<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-24 15:55:59
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-15 15:33:46
 * @FilePath: \qianyi-ui\src\views\fbm\selfOrder\components\tableColumnExpand\expand-order-action\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->

<script setup lang="ts">
import { Ref } from 'vue';
import { getSelfOrderDetail } from '/@/api/fbm/selfOrder/index';
import { auth } from '/@/utils/authFunction';
const props = defineProps({
	// 当前行数据
	currentRow: {
		type: Object,
		default: () => ({}),
	},
});
const updateCurrentRow = inject<any>('updateCurrentRow');
//  日志组件
const LogDialog = defineAsyncComponent(
	() => import('/@/components/log/log-dialog.vue')
);
// 设定仓库物流
const SetWareAndLogistics = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/tableColumnExpand/expand-order-action/setWareAndLogistics/index.vue'
		)
);
// 接单确认
const OrderConfirm = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/tableColumnExpand/expand-order-action/orderConfirm/index.vue'
		)
);
// 确认发货
const OrderShipped = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/tableColumnExpand/expand-order-action/orderShipped/index.vue'
		)
);
// 发货审核
const ShippingReview = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/tableColumnExpand/expand-order-action/shippingReview/index.vue'
		)
);

// 修改收件人信息
const UpdateRecipientInfo = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/tableColumnExpand/expand-order-action/updateRecipientInfo/index.vue'
		)
);
// 换货
const ChangeProduct = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/tableColumnExpand/expand-order-action/changeProduct/index.vue'
		)
);

//添加赠品
const AddGifts = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/tableColumnExpand/expand-order-action/addGifts/index.vue'
		)
);

//拆单
const SplitOrder = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/tableColumnExpand/expand-order-action/splitOrder/index.vue'
		)
);
// 查看详情的组件
const ShowInfo = defineAsyncComponent(
	() => import('/@/views/fbm/selfOrder/components/info/index.vue')
);
// 转FBA发货组件
const ShipToFBA = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/tableColumnExpand/expand-order-action/shipToFBA/index.vue'
		)
);
// 禁止处理组件
const StopProcess = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/tableColumnExpand/expand-order-action/stopProcess/index.vue'
		)
);

// 设定仓库物流的引用
const setWareAndLogisticsRef = ref();
// 接单确认的引用
const orderConfirmRef = ref();
// 确认发货的引用
const orderShippedRef = ref();
// 发货审核的引用
const shippingReviewRef = ref();
// 查看详情的引用
const showInfoRef = ref();
//修改收件人信息的引用
const showUpdateRecipientInfo = ref();
//换货的引用
const showChangeProduct = ref();
//添加赠品
const addGifts = ref();
// 拆单
const splitOrder = ref();
// 转FBA发货
const shipToFBA = ref();
// 禁止处理
const stopProcessRef = ref();

//接收截单弹窗
interface CutoffOrderRef {
	handleOpen: (list: any[], reasons?: any[]) => void;
}

const cutoffOrderRef = inject<Ref<CutoffOrderRef | null>>(
	'cutoffOrderRef',
	ref(null)
);

// 日志对话框是否可见
const logDialogVisible = ref(false);
const openDialog = async (type: string) => {
	if (type === 'setWareAndLogistics') {
		setWareAndLogisticsRef.value?.show();
	} else if (type === 'orderConfirm') {
		orderConfirmRef.value?.show();
	} else if (type === 'orderShipped') {
		orderShippedRef.value?.show();
	} else if (type === 'shippingReview') {
		shippingReviewRef.value?.show();
	} else if (type === 'showInfo') {
		// showInfoRef.value?.show();
		// return;
		// 获取最新的详情数据
		const res = await getSelfOrderDetail({ id: props.currentRow.id });
		if (res.code === 0) {
			// 更新父组件的currentRow
			updateCurrentRow(res.data);
			showInfoRef.value?.show();
		}
	} else if (type === 'showUpdate') {
		showUpdateRecipientInfo.value?.handleOpen(props.currentRow);
	} else if (type === 'changeProduct') {
		showChangeProduct.value?.handleOpen(props.currentRow);
	} else if (type === 'addGifts') {
		addGifts.value?.handleOpen(props.currentRow);
	} else if (type == 'splitOrder') {
		splitOrder.value?.handleOpen(props.currentRow);
	} else if (type == 'log') {
		logDialogVisible.value = true;
	} else if (type == 'shipToFBA') {
		shipToFBA.value?.show();
	} else if (type === 'stopProcess') {
		stopProcessRef.value?.show(props.currentRow);
	} else if (type == 'cutoffOrder') {
		cutoffOrderRef.value?.handleOpen([props.currentRow.id]);
	}
};
</script>
<template>
	<div class="component">
		<el-row :justify="'space-between'">
			<el-col :span="24">
				<el-row>
					<el-col :span="24" class="flex items-center justify-between">
						<div class="flex items-center">
							<el-dropdown
								placement="bottom-end"
								type="primary"
								trigger="click"
							>
								<span class="flex items-center justify-center">
									<el-button
										@click="$emit('viewDetail')"
										text
										type="primary"
										class="p-1"
									>
										{{ $t('操作') }}</el-button
									>
									<el-icon class="el-icon--right">
										<arrow-down
											:style="{
												color: '#2e77f7',
											}"
										/>
									</el-icon>
								</span>
								<template #dropdown>
									<el-dropdown-menu>
										<el-dropdown-item
											@click="openDialog('showInfo')"
											v-if="auth('selfOrder-showInfo')"
										>
											{{ $t('详情') }}
										</el-dropdown-item>
										<el-dropdown-item
											@click="openDialog('log')"
											v-if="auth('selfOrder-log')"
										>
											{{ $t('日志') }}
										</el-dropdown-item>
										<!-- 必须订单状态是待接单 2 -->
										<el-dropdown-item
											@click="openDialog('orderConfirm')"
											v-if="
												props.currentRow.orderStatus == 2 &&
												props.currentRow.subOrderStatus !== 47 &&
												auth('selfOrder-orderConfirm')
											"
										>
											{{ $t('接单确认') }}
										</el-dropdown-item>
										<!-- 必须订单状态是待审核 3 -->
										<el-dropdown-item
											@click="openDialog('setWareAndLogistics')"
											v-if="
												props.currentRow.orderStatus == 3 &&
												props.currentRow.subOrderStatus !== 47 &&
												auth('selfOrder-setWareAndLogistics')
											"
										>
											{{ $t('设定仓库物流') }}
										</el-dropdown-item>
										<!-- 必须订单状态是待审核 3 -->
										<el-dropdown-item
											@click="openDialog('shippingReview')"
											v-if="
												props.currentRow.orderStatus == 3 &&
												props.currentRow.subOrderStatus !== 47 &&
												auth('selfOrder-shippingReview')
											"
										>
											{{ $t('发货审核') }}
										</el-dropdown-item>
										<!-- 必须订单状态是待发货 4 -->
										<el-dropdown-item
											@click="openDialog('orderShipped')"
											v-if="
												props.currentRow.orderStatus == 4 &&
												props.currentRow.subOrderStatus !== 47 &&
												auth('selfOrder-orderShipped')
											"
										>
											{{ $t('确定发货') }}
										</el-dropdown-item>
										<!-- <el-dropdown-item @click="openDialog('setTag')" v-if="auth('selfOrder-setTag')">
											{{ $t('标记标签') }}
										</el-dropdown-item> -->
										<!-- 必须订单状态是 2待接单 3待审核 4待发货 -->
										<!-- 或者待发货且没有仓库单号时，展示并支持修改订单地址 -->
										<el-dropdown-item
											v-if="
												(props.currentRow.orderStatus == 2 ||
													props.currentRow.orderStatus == 3 ||
													(props.currentRow.orderStatus == 4 &&
														!props.currentRow.warehouseOrderNo)) &&
												props.currentRow.subOrderStatus !== 47 &&
												auth('selfOrder-showUpdate')
											"
											@click="openDialog('showUpdate')"
										>
											{{ $t('修改收件人信息') }}
										</el-dropdown-item>
										<el-dropdown-item
											v-if="
												(props.currentRow.orderStatus == 2 ||
													props.currentRow.orderStatus == 3) &&
												props.currentRow.subOrderStatus !== 47 &&
												auth('selfOrder-changeProduct')
											"
											@click="openDialog('changeProduct')"
										>
											{{ $t('换货') }}
										</el-dropdown-item>
										<el-dropdown-item
											v-if="
												(props.currentRow.orderStatus == 2 ||
													props.currentRow.orderStatus == 3) &&
												props.currentRow.subOrderStatus !== 47 &&
												auth('selfOrder-addGifts')
											"
											@click="openDialog('addGifts')"
										>
											{{ $t('添加增品') }}
										</el-dropdown-item>
										<!-- 必须订单状态是 待审核 3 -->
										<el-dropdown-item
											v-if="
												props.currentRow.orderStatus == 3 &&
												props.currentRow.subOrderStatus !== 47 &&
												auth('selfOrder-splitOrder')
											"
											@click="openDialog('splitOrder')"
										>
											{{ $t('手动拆单') }}
										</el-dropdown-item>
										<!-- 必须订单状态是待发货 4 且 有物流单号 -->
										<!-- 后面产品提出没有物流单号也可以截单 -->
										<el-dropdown-item
											v-if="
												props.currentRow.orderStatus == 4 &&
												props.currentRow.subOrderStatus !== 47 &&
												auth('selfOrder-cutoffOrder')
											"
											@click="openDialog('cutoffOrder')"
										>
											{{ $t('截单') }}
										</el-dropdown-item>
										<!-- 转FBA发货  待审核 3 待发货 4 -->
										<!-- logisticsStatus 物流状态 0:未选择物流 1:三方仓物流 2:转FBA成功  3:转FBA失败  4:发平台物流成功  5:发平台物流失败 -->
										<el-dropdown-item
											v-if="
												(props.currentRow.orderStatus == 3 ||
													props.currentRow.orderStatus == 4) &&
												(props.currentRow.logisticsStatus === 0 ||
													props.currentRow.logisticsStatus === 1 ||
													props.currentRow.logisticsStatus === 3) &&
												props.currentRow.subOrderStatus !== 47 &&
												auth('selfOrder-shipToFBA')
											"
											@click="openDialog('shipToFBA')"
										>
											{{ $t('转FBA发货') }}
										</el-dropdown-item>
										<!-- 必须订单状态是待接单2、待审核3 -->
										<el-dropdown-item
											v-if="
												(props.currentRow.orderStatus == 2 ||
													props.currentRow.orderStatus == 3) &&
												props.currentRow.subOrderStatus !== 47 &&
												auth('selfOrder-stopProcess')
											"
											@click="openDialog('stopProcess')"
										>
											{{ $t('禁止处理') }}
										</el-dropdown-item>
									</el-dropdown-menu>
								</template>
							</el-dropdown>
						</div>
					</el-col>
				</el-row>
			</el-col>
		</el-row>
		<!-- 日志对话框 -->
		<LogDialog
			v-model="logDialogVisible"
			:id="props.currentRow.id"
			:biz-type="['SELF_ORDER']"
			:showSearchForm="false"
			:showToolBar="false"
			@closeDialog="
				() => {
					logDialogVisible = false;
				}
			"
		/>
		<!-- 设定仓库物流 -->
		<SetWareAndLogistics
			ref="setWareAndLogisticsRef"
			:currentRow="props.currentRow"
		/>
		<!-- 接单确认 -->
		<OrderConfirm ref="orderConfirmRef" :currentRow="props.currentRow" />
		<!-- 确认发货 -->
		<OrderShipped ref="orderShippedRef" :currentRow="props.currentRow" />
		<!-- 发货审核 -->
		<ShippingReview ref="shippingReviewRef" :currentRow="props.currentRow" />
		<!-- 查看详情 -->
		<ShowInfo ref="showInfoRef" />
		<!-- 修改收件人信息 -->
		<UpdateRecipientInfo
			ref="showUpdateRecipientInfo"
			:currentRow="props.currentRow"
		/>
		<!-- 换货 -->
		<ChangeProduct ref="showChangeProduct" :currentRow="props.currentRow" />
		<!-- 添加赠品 -->
		<AddGifts ref="addGifts" :currentRow="props.currentRow" />
		<!-- 手动拆单 -->
		<SplitOrder ref="splitOrder" />
		<!-- 转FBA发货 -->
		<ShipToFBA ref="shipToFBA" :currentRow="props.currentRow" />
		<!-- 禁止处理 -->
		<StopProcess ref="stopProcessRef" :currentRow="props.currentRow" />
	</div>
</template>

<style scoped lang="scss">
.component {
	width: 100%;
	height: 100%;
	display: flex;
	gap: 8px;
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
