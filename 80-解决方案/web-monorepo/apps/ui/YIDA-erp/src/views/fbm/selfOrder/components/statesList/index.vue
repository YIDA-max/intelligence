<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-17 10:13:56
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-02 12:31:00
 * @FilePath: \qianyi-ui\src\views\fbm\selfOrder\components\statesList\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { getSelfOrderStatusCount } from '/@/api/fbm/selfOrder/index';
import { useIntersectionObserver } from '@vueuse/core';
import debounce from 'lodash/debounce';
import { onBeforeUnmount, nextTick } from 'vue';
const currentStatus = ref(0); // 默认全部
const tabsRef = ref<any>(null);
const queryForm = inject<any>('queryForm');
const getDataList = inject<any>('getDataList');
const fullscreenLoading = ref(false);
// 当前状态列表
/**
 * 订单业务状态 2:待接单 3:待审核  4:待发货 5:已发货 6:不发货 7:异常订单  8：订单标发
 */
const statusList = ref<Array<any>>([
	{
		label: '全部',
		value: '0',
		number: 0,
		params: 0,
		disabled: true,
		width: '80',
	},
	{
		label: '待接单',
		value: 'pendingAcceptanceNum',
		number: 0,
		params: 2,
		disabled: true,
		width: '80',
	},
	{
		label: '待审核',
		value: 'pendingReviewNum',
		number: 0,
		params: 3,
		disabled: false,
		width: '80',
	},
	{
		label: '待发货',
		value: 'pendingShipmentNum',
		number: 0,
		params: 4,
		disabled: false,
		width: '80',
	},
	{
		label: '已发货',
		value: 'shippedNum',
		number: 0,
		params: 5,
		disabled: true,
		width: '80',
	},
	{
		label: '异常订单',
		value: 'abnormalOrderNum',
		number: 0,
		params: 7,
		disabled: false,
		width: '370',
	},
	{
		label: '订单标发',
		value: 'flaggedOrderNum',
		number: 0,
		params: 8,
		disabled: true,
		width: '80',
	},
	{
		label: '不发货',
		value: '1',
		number: 0,
		params: 6,
		disabled: true,
		width: '80',
	},
]);
/**
 * 异常处理 范围：40~69
 */
const subOrderStatus = ref<
	Record<
		string,
		{ label: string; params: number; number: number; value: string }
	>
>({
	orderConfirmationFailed: {
		label: '接单确认失败',
		params: 41,
		number: 0,
		value: 'orderConfirmationFailed',
	},
	mskuNotMatched: {
		label: 'MSKU未配对',
		params: 42,
		number: 0,
		value: 'mskuNotMatched',
	},
	warehouseLogisticsAllocationFailed: {
		label: '仓库物流分配失败',
		params: 43,
		number: 0,
		value: 'warehouseLogisticsAllocationFailed',
	},
	warehouseSkuMatchingFailed: {
		label: '三方仓SKU配对失败',
		params: 44,
		number: 0,
		value: 'warehouseSkuMatchingFailed',
	},
	shippingAuditFailed: {
		label: '发货审核失败',
		params: 45,
		number: 0,
		value: 'shippingAuditFailed',
	},
	pushToWarehouseFailed: {
		label: '推送三方仓失败',
		params: 46,
		number: 0,
		value: 'pushToWarehouseFailed',
	},
	processingRestricted: {
		label: '禁止处理',
		params: 47,
		number: 0,
		value: 'processingRestricted',
	},
	platformWareFailed: {
		label: '转平台仓创建失败',
		params: 48,
		number: 0,
		value: 'platformWareFailed',
	},
	fulfillmentFailed: {
		label: '转平台仓履约失败',
		params: 49,
		number: 0,
		value: 'fulfillmentFailed',
	},
	logisticsOrderFailed: {
		label: '物流下单失败',
		params: 51,
		number: 0,
		value: 'logisticsOrderFailed',
	},
	thirdPartyWarehouseShippingException: {
		label: '三方仓配送异常',
		params: 52,
		number: 0,
		value: 'thirdPartyWarehouseShippingException',
	},
	cutOffInProgress: {
		label: '截单中',
		params: 80,
		number: 0,
		value: 'cutOffInProgress',
	},
	cutOffInFail: {
		label: '截单失败',
		params: 81,
		number: 0,
		value: 'cutOffFailed',
	},
	pendingManualReview: {
		label: '待人工审核',
		params: 20,
		number: 0,
		value: 'pendingManualReview',
	},
	cutoffOrders: {
		label: '截单订单',
		params: 21,
		number: 0,
		value: 'cutoffOrders',
	},
	mergeOrders: {
		label: '可合单',
		params: 22,
		number: 0,
		value: 'mergeOrders',
	},
});
// 当前选中的子状态
const currentSubStatus = ref<number>(0);
// 获取状态列表数量,带查询条件
const changeGetSelfOrderStatusCount = async (queryForm: any) => {
	try {
		// 开启loading
		fullscreenLoading.value = true;
		const res = await getSelfOrderStatusCount({
			// 传递当前的查询条件
			...queryForm,
		});
		if (res && res.code === 0) {
			// 更新状态列表数量
			statusList.value.forEach((status) => {
				if (!res.data) {
					status.number = 0;
					return;
				}
				Object.keys(res.data)?.forEach((key) => {
					// console.log(object)
					if (status.value === key) {
						status.number = res.data[key];
					}
				});
			});
			// 更新子状态数量
			Object.keys(subOrderStatus.value).forEach((key) => {
				if (!res.data) {
					subOrderStatus.value[key].number = 0;
					return;
				}
				Object.keys(res.data)?.forEach((itemKey) => {
					if (subOrderStatus.value[key].value === itemKey) {
						subOrderStatus.value[key].number = res.data[itemKey];
					}
				});
			});
		}
	} finally {
		// 关闭loading
		fullscreenLoading.value = false;
	}
};

const changeGetSelfOrderStatusCountDebounced = debounce((setQueryForm: any) => {
	changeGetSelfOrderStatusCount(setQueryForm);
}, 300);

onBeforeUnmount(() => {
	changeGetSelfOrderStatusCountDebounced.cancel();
});

// 监听组件进入可视区域
onMounted(() => {
	// 监听是否进入可视区域，进入则触发加载数据
	useIntersectionObserver(tabsRef.value, async ([entry]) => {
		if (entry.isIntersecting) {
			changeGetSelfOrderStatusCountDebounced(queryForm);
		}
	});
});

// 监听查询条件变化，重新获取状态数量
// watch(
// 	() => queryForm,
// 	(newVal) => {
// 		const setQueryForm = JSON.parse(JSON.stringify(newVal));
// 		delete setQueryForm.subOrderStatus;
// 		delete setQueryForm.bizOrderStatus;
// 		// delete setQueryForm.orderStatusList;
// 		// 重新获取状态数量
// 		changeGetSelfOrderStatusCountDebounced(setQueryForm);
// 	},
// 	{ deep: true }
// );

// 点击子状态项
const handleClickItem = async (
	status: number,
	type: string,
	subType?: number
) => {
	fullscreenLoading.value = true;
	// 选中子状态
	if (type === 'subOrderStatus') {
		currentSubStatus.value = status;
		// 选中子状态时，并且存在 subType 参数，则设置当前主状态
		if (subType) {
			currentStatus.value = subType;
		}
		queryForm.bizOrderStatus = null;
	} else {
		// 选中业务状态
		currentSubStatus.value = 0;
		queryForm.subOrderStatus = null;
	}
	// 设置当前状态
	queryForm[type] = status;

	try {
		// 触发数据加载
		await getDataList(false);
		// 等待 DOM 更新完成
		await nextTick();
		// 等待表格渲染和展开动画完成
		await new Promise((resolve) => setTimeout(resolve, 200));
	} finally {
		// 确保 loading 一定会被关闭
		fullscreenLoading.value = false;
	}
};

const handleTabClick = (e: { paneName: number }) => {
	handleClickItem(e.paneName, 'bizOrderStatus');
};
// 重置当前状态
const resetCurrentStatus = () => {
	currentStatus.value = 0;
	currentSubStatus.value = 0;
};
// 对外暴露的查询状态数量方法
const watchGetSelfOrderStatusCount = (queryForm: any) => {
	const setQueryForm = JSON.parse(JSON.stringify(queryForm));
	delete setQueryForm.subOrderStatus;
	delete setQueryForm.bizOrderStatus;
	// delete setQueryForm.orderStatusList;
	// 重新获取状态数量
	changeGetSelfOrderStatusCountDebounced(setQueryForm);
};
// 对外暴露方法
defineExpose({
	watchGetSelfOrderStatusCount,
	changeGetSelfOrderStatusCount,
	fullscreenLoading,
	resetCurrentStatus,
});
</script>
<template>
	<div class="states-list">
		<el-tabs v-model="currentStatus" @tab-click="handleTabClick" ref="tabsRef">
			<el-tab-pane
				v-for="tab in statusList"
				:key="tab.value"
				:name="tab.params"
			>
				<template #label>
					<el-popover
						placement="bottom"
						:disabled="tab.disabled"
						:width="tab.width"
						trigger="hover"
						:offset="20"
					>
						<template #default>
							<div
								class="popover-content"
								v-if="tab.value === 'abnormalOrderNum'"
							>
								<div class="left">
									<!-- <div>禁止处理(0)</div> -->
									<div class="item">
										<div class="item-title">待接单</div>
										<div class="item-content">
											<div
												:class="
													'item-content-item' +
													(currentSubStatus ===
													subOrderStatus.orderConfirmationFailed.params
														? ' active'
														: '')
												"
												@click="
													handleClickItem(
														subOrderStatus.orderConfirmationFailed.params,
														'subOrderStatus',
														7
													)
												"
											>
												<!-- 接单确认失败 -->
												{{ subOrderStatus.orderConfirmationFailed.label }}({{
													subOrderStatus.orderConfirmationFailed.number
												}})
											</div>
											<div
												:class="
													'item-content-item' +
													(currentSubStatus ===
													subOrderStatus.mskuNotMatched.params
														? ' active'
														: '')
												"
												@click="
													handleClickItem(
														subOrderStatus.mskuNotMatched.params,
														'subOrderStatus',
														7
													)
												"
											>
												<!--MMSKU未配对  -->
												{{ subOrderStatus.mskuNotMatched.label }}({{
													subOrderStatus.mskuNotMatched.number
												}})
											</div>
										</div>
									</div>
									<div class="item">
										<div class="item-title">待审核</div>
										<div class="item-content">
											<div
												:class="
													'item-content-item' +
													(currentSubStatus ===
													subOrderStatus.warehouseSkuMatchingFailed.params
														? ' active'
														: '')
												"
												@click="
													handleClickItem(
														subOrderStatus.warehouseSkuMatchingFailed.params,
														'subOrderStatus',
														7
													)
												"
											>
												<!-- 三方仓SKU配对失败 -->
												{{ subOrderStatus.warehouseSkuMatchingFailed.label }}({{
													subOrderStatus.warehouseSkuMatchingFailed.number
												}})
											</div>
											<div
												:class="
													'item-content-item' +
													(currentSubStatus ===
													subOrderStatus.shippingAuditFailed.params
														? ' active'
														: '')
												"
												@click="
													handleClickItem(
														subOrderStatus.shippingAuditFailed.params,
														'subOrderStatus',
														7
													)
												"
											>
												<!-- 发货审核失败 -->
												{{ subOrderStatus.shippingAuditFailed.label }}({{
													subOrderStatus.shippingAuditFailed.number
												}})
											</div>
											<div
												:class="
													'item-content-item' +
													(currentSubStatus ===
													subOrderStatus.warehouseLogisticsAllocationFailed
														.params
														? ' active'
														: '')
												"
												@click="
													handleClickItem(
														subOrderStatus.warehouseLogisticsAllocationFailed
															.params,
														'subOrderStatus',
														7
													)
												"
											>
												<!-- 仓库物流分配失败 -->
												{{
													subOrderStatus.warehouseLogisticsAllocationFailed
														.label
												}}({{
													subOrderStatus.warehouseLogisticsAllocationFailed
														.number
												}})
											</div>
										</div>
									</div>
								</div>
								<div class="right">
									<div class="item">
										<div class="item-title">待发货</div>
										<div class="item-content">
											<div
												:class="
													'item-content-item' +
													(currentSubStatus ===
													subOrderStatus.pushToWarehouseFailed.params
														? ' active'
														: '')
												"
												@click="
													handleClickItem(
														subOrderStatus.pushToWarehouseFailed.params,
														'subOrderStatus',
														7
													)
												"
											>
												<!-- 推送三方仓失败 -->
												{{ subOrderStatus.pushToWarehouseFailed.label }}({{
													subOrderStatus.pushToWarehouseFailed.number
												}})
											</div>
											<div
												:class="
													'item-content-item' +
													(currentSubStatus ===
													subOrderStatus.platformWareFailed.params
														? ' active'
														: '')
												"
												@click="
													handleClickItem(
														subOrderStatus.platformWareFailed.params,
														'subOrderStatus',
														7
													)
												"
											>
												<!-- 转平台仓创建失败 -->
												{{ subOrderStatus.platformWareFailed.label }}({{
													subOrderStatus.platformWareFailed.number
												}})
											</div>
											<div
												:class="
													'item-content-item' +
													(currentSubStatus ===
													subOrderStatus.fulfillmentFailed.params
														? ' active'
														: '')
												"
												@click="
													handleClickItem(
														subOrderStatus.fulfillmentFailed.params,
														'subOrderStatus',
														7
													)
												"
											>
												<!-- 转平台仓履约失败 -->
												{{ subOrderStatus.fulfillmentFailed.label }}({{
													subOrderStatus.fulfillmentFailed.number
												}})
											</div>
											<div
												:class="
													'item-content-item' +
													(currentSubStatus ===
													subOrderStatus.logisticsOrderFailed.params
														? ' active'
														: '')
												"
												@click="
													handleClickItem(
														subOrderStatus.logisticsOrderFailed.params,
														'subOrderStatus',
														7
													)
												"
											>
												<!-- 转平台仓物流下单失败 -->
												{{ subOrderStatus.logisticsOrderFailed.label }}({{
													subOrderStatus.logisticsOrderFailed.number
												}})
											</div>
											<div
												:class="
													'item-content-item' +
													(currentSubStatus ===
													subOrderStatus.thirdPartyWarehouseShippingException
														.params
														? ' active'
														: '')
												"
												@click="
													handleClickItem(
														subOrderStatus.thirdPartyWarehouseShippingException
															.params,
														'subOrderStatus',
														7
													)
												"
											>
												<!-- 三方仓配送异常 -->
												{{
													subOrderStatus.thirdPartyWarehouseShippingException
														.label
												}}({{
													subOrderStatus.thirdPartyWarehouseShippingException
														.number
												}})
											</div>
										</div>
									</div>
									<div class="item">
										<div class="item-title">禁止</div>
										<div class="item-content">
											<div
												:class="
													'item-content-item' +
													(currentSubStatus ===
													subOrderStatus.processingRestricted.params
														? ' active'
														: '')
												"
												@click="
													handleClickItem(
														subOrderStatus.processingRestricted.params,
														'subOrderStatus',
														7
													)
												"
											>
												<!-- 禁止处理 -->
												{{ subOrderStatus.processingRestricted.label }}({{
													subOrderStatus.processingRestricted.number
												}})
											</div>
										</div>
									</div>
								</div>
							</div>
							<div
								class="popover-content"
								v-if="tab.value === 'pendingShipmentNum'"
							>
								<div class="w-28 item">
									<div class="item-content">
										<div
											:class="
												'item-content-item' +
												(currentSubStatus ===
												subOrderStatus.cutOffInProgress.params
													? ' active'
													: '')
											"
											@click="
												handleClickItem(
													subOrderStatus.cutOffInProgress.params,
													'subOrderStatus',
													4
												)
											"
										>
											<!-- 截单中 -->
											{{ subOrderStatus.cutOffInProgress.label }}({{
												subOrderStatus.cutOffInProgress.number
											}})
										</div>
										<div
											:class="
												'item-content-item' +
												(currentSubStatus === subOrderStatus.cutOffInFail.params
													? ' active'
													: '')
											"
											@click="
												handleClickItem(
													subOrderStatus.cutOffInFail.params,
													'subOrderStatus',
													4
												)
											"
										>
											<!-- 截单失败 -->
											{{ subOrderStatus.cutOffInFail.label }}({{
												subOrderStatus.cutOffInFail.number
											}})
										</div>
									</div>
								</div>
							</div>
							<div
								class="popover-content"
								v-if="tab.value === 'pendingReviewNum'"
							>
								<div class="w-28 item">
									<div class="item-content">
										<div
											:class="
												'item-content-item' +
												(currentSubStatus ===
												subOrderStatus.pendingManualReview.params
													? ' active'
													: '')
											"
											@click="
												handleClickItem(
													subOrderStatus.pendingManualReview.params,
													'subOrderStatus',
													3
												)
											"
										>
											<!-- 待人工审核 -->
											{{ subOrderStatus.pendingManualReview.label }}({{
												subOrderStatus.pendingManualReview.number
											}})
										</div>
										<div
											:class="
												'item-content-item' +
												(currentSubStatus === subOrderStatus.cutoffOrders.params
													? ' active'
													: '')
											"
											@click="
												handleClickItem(
													subOrderStatus.cutoffOrders.params,
													'subOrderStatus',
													3
												)
											"
										>
											<!-- 截单订单 -->
											{{ subOrderStatus.cutoffOrders.label }}({{
												subOrderStatus.cutoffOrders.number
											}})
										</div>
										<div
											:class="
												'item-content-item' +
												(currentSubStatus === subOrderStatus.mergeOrders.params
													? ' active'
													: '')
											"
											@click="
												handleClickItem(
													subOrderStatus.mergeOrders.params,
													'subOrderStatus',
													3
												)
											"
										>
											<!--可合单  -->
											{{ subOrderStatus.mergeOrders.label }}({{
												subOrderStatus.mergeOrders.number
											}})
										</div>
									</div>
								</div>
							</div>
						</template>
						<template #reference>
							<span>
								{{ tab.label }}
								{{
									tab.value === '1' || tab.value === '0'
										? ''
										: `(${tab.number || 0})`
								}}
							</span>
						</template>
					</el-popover>
				</template>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<style scoped lang="scss">
.states-list {
	display: flex;
	flex-direction: column;
	gap: 12px;
}
.popover-content {
	width: 350px;
	max-height: 400px;
	display: flex;
	.left {
		width: 50%;
		height: 100%;
		border-right: 1px solid #e8e8e8;
		overflow: auto;
		padding: 0 10px 0 0;
	}
	.right {
		width: 50%;
		height: 100%;
		overflow: auto;
		padding: 0 0 0 10px;
	}
	.item {
		margin-top: 10px;
		max-height: 45%;
		overflow: auto;
		.item-title {
			font-weight: 600;
			margin-bottom: 6px;
			color: #bec2c8;
		}
		.item-content {
			display: flex;
			flex-direction: column;
			gap: 4px;
			.item-content-item {
				font-size: 12px;
				color: #1f1f1f;
				padding: 6px 10px;
				border-radius: 6px;
				transition: all 0.2s ease;
				cursor: pointer;
				// hover 效果
				&:hover {
					background-color: #f5f7fa;
					color: #1677ff;
				}
				// 被选中状态
				&.active {
					background-color: #f5f7fa;
					color: #1677ff;
					transform: translateY(-1px);
				}
			}
		}
	}
}
</style>
