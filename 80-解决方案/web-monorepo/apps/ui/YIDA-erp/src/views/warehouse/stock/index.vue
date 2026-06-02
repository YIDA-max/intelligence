<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form
					:inline="true"
					:model="state.queryForm"
					@keyup.enter="getDataList"
					ref="queryRef"
				>
					<el-form-item>
						<div class="flex item-center">
							<SelectInput
								v-model:queryForm="state.queryForm"
								:searchTypes="[
									{
										label: 'SKU',
										value: 'skuCodes',
									},
								]"
								:getDataList="getDataList"
							/>
						</div>
					</el-form-item>

					<el-form-item>
						<TreeSelectInputApi
							componentType="country"
							text="国家"
							code="countryCodes"
							v-model:queryForm="state.queryForm"
							:searchFn="getDataList"
							:settings="{
								text: '选择国家',
								width: '220px',
							}"
						/>
					</el-form-item>

					<el-form-item>
						<TreeSelectInputApi
							componentType="dicts"
							text="平台渠道"
							code="platformChannelCodes"
							v-model:queryForm="state.queryForm"
							:searchFn="getDataList"
							:settings="{
								text: '选择平台渠道',
								width: '220px',
								getTreeDataParams: 'platform_channel',
							}"
						/>
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							componentType="warehouseQianyi"
							text="仓库"
							code="warehouseCodes"
							v-model:queryForm="state.queryForm"
							:searchFn="getDataList"
							:settings="{
								text: '选择仓库',
								width: '220px',
								getTreeDataParams: { warehouseTypes: [0, 1, 2] },
							}"
						/>
					</el-form-item>

					<el-form-item>
						<div class="flex item-center">
							<SelectInput
								v-model:queryForm="state.queryForm"
								:searchTypes="[
									{
										label: 'MSKU',
										value: 'mskuCodes',
									},
								]"
								:getDataList="getDataList"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<el-tree-select
							@change="getDataList"
							v-model="state.queryForm.deptIds"
							placeholder="部门和小组"
							show-checkbox
							fit-input-width
							clearable
							multiple
							collapse-tags
							:max-collapse-tags="1"
							style="width: 220px"
							filterable
							:props="{
								children: 'children',
								label: 'name',
								value: 'id',
							}"
							:node-key="'id'"
							:data="dictMap.deptTree"
						>
						</el-tree-select>
					</el-form-item>
					<el-form-item>
						<el-input
							v-model="state.queryForm.onwayQty"
							placeholder="在途库存"
							style="width: 300px"
							clearable
							@keyup.enter="getDataList"
							type="number"
						>
							<template #prepend
								><div
									:style="{
										width: '60px',
										textAlign: 'center',
									}"
								>
									在途库存>=
								</div></template
							>
						</el-input>
					</el-form-item>
					<el-form-item>
						<el-input
							v-model="state.queryForm.totalQty"
							placeholder="实际库存"
							style="width: 300px"
							clearable
							@keyup.enter="getDataList"
							type="number"
						>
							<template #prepend>
								<div
									:style="{
										width: '60px',
										textAlign: 'center',
									}"
								>
									实际库存>=
								</div>
							</template>
						</el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" type="primary"
							>{{ $t('搜索') }}
						</el-button>
						<el-button @click="resetQuery" type="info" plain
							>{{ $t('common.resetBtn') }}
						</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<BaseTable
				:register="register"
				ref="baseTableRef"
				:tableAttrs="tableAttrs"
			>
				<template #left-tool>
					<el-button
						class="ml10"
						type="primary"
						@click="openDialog('secondMile')"
						v-auth="'stock_initiate'"
					>
						{{ $t('发起二程调拨') }}</el-button
					>
					<el-button
						class="ml10"
						v-auth="'stock_import'"
						@click="
							() => {
								importDialogRef.show();
							}
						"
					>
						{{ $t('导入初始化库存') }}
					</el-button>
				</template>
				<template #imgUrl="{ row }">
					<MrImg :src="row.imgUrl" />
				</template>
				<template #legalPersonId="{ row }">
					<MrTextEllipsis :text="row.legalPersonName || '---'" />
				</template>
				<template #skuCode="{ row }">
					<div class="flex flex-col items-start w-full">
						<MrTextEllipsis :text="row.skuCode" />
						<MrTextEllipsis :text="row.skuName" />
					</div>
				</template>
				<template #warehouseCode="{ row }">
					<MrTextEllipsis :text="row.warehouseName || '---'" />
				</template>
				<template #countryCode="{ row }">
					<MrTextEllipsis :text="row.countryCode || '---'" />
				</template>
				<template #platformChannelCode="{ row }">
					<MrTextEllipsis :text="row.platformChannelCodeText || '---'" />
				</template>
				<template #mskuCode="{ row }">
					<MrTextEllipsis :text="row.mskuCode || '---'" />
				</template>

				<template #onwayQty-header>
					{{ t('在途库存') }}
					<el-tooltip content="已发未入库在途量" effect="dark" placement="top">
						<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
					</el-tooltip>
				</template>
				<template #onwayQty="{ row }">
					<OnwayQtyDialog
						:display-value="row.onwayQty"
						:data-list="row.onwaySourceDetails"
						@click="handleLinkClick(row)"
					/>
				</template>

				<template #onwayLockQty-header>
					{{ t('在途库存占用') }}
					<el-tooltip
						content="在途占用=提货占用+转库存占用+采购退货"
						effect="dark"
						placement="top"
					>
						<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
					</el-tooltip>
				</template>
				<template #onwayLockQty="{ row }">
					<StockOccupancyDialog
						:display-value="row.onwayLockQty"
						:pickup-occupancy-list="row.pickupOccupancyList"
						:transfer-occupancy-list="row.transferOccupancyList"
						:purchase-return-list="row.purchaseReturnList"
						@click="handleLinkClick(row)"
					/>
				</template>

				<template #totalQty-header>
					{{ t('实际库存(占用+可用)') }}
					<el-tooltip
						content="在仓库的产品实际数量"
						effect="dark"
						placement="top"
					>
						<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
					</el-tooltip>
				</template>
				<template #totalQty="{ row }"> {{ row.totalQty ?? 0 }} </template>

				<template #lockQty-header>
					{{ t('占用库存') }}
					<el-tooltip content="订单及调拨预占数" effect="dark" placement="top">
						<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
					</el-tooltip>
				</template>
				<template #lockQty="{ row }">
					<LockQtyDialog
						:display-value="row.lockQty"
						:data-list="row.lockSourceDetails"
						@click="handleLinkClick(row)"
					/>
				</template>

				<template #availableQty-header>
					{{ t('可用库存') }}
					<el-tooltip
						content="可用库存=实际库存-占用库存"
						effect="dark"
						placement="top"
					>
						<el-icon color="#a8abb2"><QuestionFilled /></el-icon>
					</el-tooltip>
				</template>
				<template #availableQty="{ row }">
					<AvailableQtyDialog
						:display-value="row.availableQty"
						:data-list="row.stockCartonVOList"
						@click="handleLinkClick(row)"
					/>
				</template>

				<template #parentDeptName="{ row }">
					<MrTextEllipsis :text="row.parentDeptName || '---'" />
				</template>
				<template #deptName="{ row }">
					<MrTextEllipsis :text="row.deptName || '---'" />
				</template>

				<template #action="{ row }">
					<div class="flex items-center justify-center">
						<el-button
							text
							type="primary"
							@click="openDialog('transApply', row)"
							v-auth="'stock_review'"
							>{{ $t('转库存申请') }}
						</el-button>
					</div>
				</template>
			</BaseTable>
		</div>
		<!-- 二程调拨 -->
		<SecondMile
			ref="secondMileRef"
			:selectedRows="selectedData"
			:dictMap="dictMap"
			:cancel-button-text="$t('关闭')"
			:confirm-button-text="$t('确认')"
			:confirm-button-type="'primary'"
			@confirm="
				(e:any) => {
					secondMileConfirm(e);
				}
			"
			@cancel="
				() => {
					secondMileRef.hide();
				}
			"
		/>
		<ThirdpartyDialog
			ref="thirdpartyDialogRef"
			:dictMap="dictMap"
			@submitted="getDataList"
		/>
		<DomesticTransferDialog
			ref="domesticTransferDialogRef"
			:dictMap="dictMap"
			@submitted="getDataList"
		/>
		<ImportDialog
			ref="importDialogRef"
			title="导入初始化库存"
			templateUrl="/files/import-template/导入初始化库存.xlsx"
			excelUploadApi="/stock/stock/import"
			@refreshDataList="getDataList"
		/>
	</div>
</template>

<script setup lang="ts">
import { useTable } from '/@/components/BaseTable/hooks/BaseTable';
import { getColumns } from './config/index';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive } from 'vue';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { getDicts } from '/@/api/admin/dict';
import { sysCountryList } from '/@/api/materialFlow/track';
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
import {
	getStockPage,
	getExportStockData,
	postStockList,
} from '/@/api/warehouse/stock/index';
import {
	getFreightForwarderListByCondition,
	postInsertSecondMile,
} from '/@/api/materialFlow/firstMileLogistics/index';
import { deptTree } from '/@/api/admin/dept';
import { getWarehouseListByCondition } from '/@/api/mcp/collectionPlan/index';
import { getWareHouseList } from '/@/api/materialFlow/track/index';
import { getUserListByCondition } from '/@/api/admin/user';

import { auth } from '/@/utils/authFunction';
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const SecondMile = defineAsyncComponent(
	() => import('./components/secondMile.vue')
);
const ThirdpartyDialog = defineAsyncComponent(
	() => import('./components/ThirdpartyDialog.vue')
);

const DomesticTransferDialog = defineAsyncComponent(
	() => import('./components/DomesticTransferDialog.vue')
);
const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);
const StockOccupancyDialog = defineAsyncComponent(
	() => import('./components/StockOccupancyDialog.vue')
);
const OnwayQtyDialog = defineAsyncComponent(
	() => import('./components/OnwayQtyDialog.vue')
);
const LockQtyDialog = defineAsyncComponent(
	() => import('./components/LockQtyDialog.vue')
);
const AvailableQtyDialog = defineAsyncComponent(
	() => import('./components/AvailableQtyDialog.vue')
);
// table的引用
const baseTableRef = ref();

const MrTextEllipsis = defineAsyncComponent(
	() => import('/@/common/MrTextEllipsis/index.vue')
);

const { t } = useI18n();
// 搜索变量
const queryRef = ref();
// 是否显示搜索
const showSearch = ref(true);
// 选中的行的数据
const selectedData = ref<Array<any>>([]);
// 二程调拨 的引用
const secondMileRef = ref();
// 导入对话框引用
const importDialogRef = ref();
// 当前点击的行
const currentRow = ref({
	id: '',
	shipmentQuantity: 0,
});
const domesticTransferDialogRef = ref();
const thirdpartyDialogRef = ref();

const state: any = reactive({
	queryForm: {},
	columns: getColumns(),
	toolBarConfig: {
		handleRefresh: () => {
			getDataList();
		},
		handleExport: () => {
			handleExport();
		},
		isShowExport: auth('stock_export'),
	},
	pageList: async (params: any) => {
		const res = await getStockPage(params);
		return {
			...res,
			msg: res.msg || 'success',
		};
	},
	createdIsNeed: true,
	loading: false,
	dataList: [],
	ascs: [],
	descs: ['create_time'],
});
const tableAttrs = {
	rowConfig: { keyField: 'id', isHover: true },
	cellConfig: { height: 78 },
	checkboxConfig: {
		reserve: true,
		highlight: true,
		trigger: 'checkbox',
	},
	scrollY: {
		enabled: true,
		gt: 20,
		oSize: 6,
	},
};
const { register, getDataList, tableRef } = useTable(state, baseTableRef);

//   初始化数据
const { dictMap } = useMultipleDicts(
	[
		{
			key: 'deptTree',
			fetchFn: deptTree,
			params: {
				deptName: '运营中心',
				showRootFlag: 0, // 是否显示根节点 1是展示 0不展示
			},
		}, // 部门树
		{
			key: 'countryList',
			fetchFn: sysCountryList,
			params: {
				filterArea: 1,
			},
		}, // 国家列表
		{
			key: 'platformChannel',
			fetchFn: getDicts,
			params: 'platform_channel',
		}, // 平台 渠道
		{
			key: 'warehouseListByType',
			fetchFn: getWareHouseList,
			params: {
				excludeCountryTwoCodeList: ['CN'],
				warehouseTypes: [0, 1, 2],
				status: 1,
			}, // 排除国家二字码集合 0自营仓 1三方仓 2平台仓
		}, // 仓库列表
		{
			key: 'freightForwarderListByCondition',
			fetchFn: getFreightForwarderListByCondition,
			params: { forwarderTypes: [6] },
		}, // 货代管理查询
		{
			key: 'transportMethod',
			fetchFn: getDicts,
			params: 'transport_method',
		}, // 运输方式
		{
			key: 'warehouseListType',
			fetchFn: getWarehouseListByCondition,
			params: { warehouseTypes: [0, 1, 2] },
		}, // 查询自营仓+三方仓+平台仓库
		{
			key: 'shippingMethod',
			fetchFn: getDicts,
			params: 'shipping_method',
		}, // 发货方式
		{
			key: 'productManageId',
			fetchFn: getUserListByCondition,
			params: { lockFlag: 0 },
		}, // 人员列表
	],
	{
		isAuto: true,
		tableRef,
	}
);

// 重置
const resetQuery = () => {
	state.queryForm = {
		status: 1, // 默认启用
	};
	if (state.pagination) {
		state.pagination.current = 1;
		state.pagination.size = 10;
	}
	getDataList();
};

// 导出
const handleExport = async () => {
	try {
		const ids = tableRef.value
			.getCheckboxRecords(true)
			.map((item: any) => item.id);
		// 显示加载状态
		state.loading = true;
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await getExportStockData({
			...state.queryForm,
			ascs: state?.ascs,
			descs: state?.descs,
			ids,
			current: 1,
			size: 10000,
		});
	} catch (error) {
		useMessage().error(t(error as string));
	} finally {
		// 隐藏加载状态
		state.loading = false;
	}
};
/**
 * 点击查询详情
 */
const handleLinkClick = async (row: any) => {
	const res = await postStockList({
		ids: [row.id],
	});
	if (res.code === 0) {
		row.batchDetails = res.data[0]?.batchDetails;
		row.onwayDetails = res.data[0]?.onwayDetails;
		row.lockDetails = res.data[0]?.lockDetails;
		row.collectionPlans = res.data[0]?.collectionPlans;
		// 占用库存
		row.lockSourceDetails = res.data[0]?.lockSourceDetails;
		// 在途库存
		row.onwaySourceDetails = res.data[0]?.onwaySourceDetails;
		// 可用库存
		row.stockCartonVOList = res.data[0]?.stockCartonVOList;

		// 在途库存占用 - 模拟数据（等待接口完成后替换）
		// 1. 提货占用列表
		row.pickupOccupancyList = res.data[0]?.pickupOccupancyList;
		// 2. 转库存占用列表
		row.transferOccupancyList = res.data[0]?.transferOccupancyList;
		// 3. 采购退货列表
		row.purchaseReturnList = res.data[0]?.purchaseReturnList;
	}
};

// 打开对话框
const openDialog = async (type: string, row?: any) => {
	try {
		selectedData.value = [];
		if (type === 'add') {
			//
		} else if (type === 'log') {
			currentRow.value = row;
		} else if (type === 'secondMile') {
			const ids = tableRef.value
				.getCheckboxRecords(true)
				.map((item: any) => item.id);
			const selectedRows = tableRef.value.getCheckboxRecords(true);
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			// 选中的仓库和法人主体必须一致
			const firstWarehouseCode = selectedRows[0].warehouseCode;
			const firstLegalPersonId = selectedRows[0].baseLegalPersonId;
			const isAllSameWarehouseAndLegalPerson = selectedRows.every(
				(item: any) => {
					return (
						item.warehouseCode === firstWarehouseCode &&
						item.baseLegalPersonId === firstLegalPersonId
					);
				}
			);
			if (!isAllSameWarehouseAndLegalPerson) {
				useMessageBox().error(t('选中的仓库和法人主体必须一致'));
				return;
			}
			// 必须都要有可用库存，不能为空
			const hasAvailableQty = selectedRows.every(
				(item: any) => item.availableQty > 0
			);
			if (!hasAvailableQty) {
				useMessageBox().error(t('必须有可用库存，不能为空'));
				return;
			}
			// 请求获取到数据
			const res = await postStockList({
				ids,
				type: 1, // 类型
			});
			if (res.code === 0) {
				// 赋值
				selectedData.value = res.data;
				// 二程调拨
				secondMileRef.value?.show();
				// 取消选中
				tableRef.value.clearCheckboxRow();
				tableRef.value.clearCheckboxReserve();
			}
		} else if (type === 'transApply') {
			// 判断是否是国内仓 0  :国内仓  1 三方
			// const isCN1Warehouse = row.warehouseCode === 'CN1';
			const isCN1Warehouse = row.warehouseType === '0';

			//TODO: 开发阶段隐藏
			// 计算在途库存和可提数量
			const onwayQty = row.onwayQty || 0;
			if (isCN1Warehouse) {
				// 【国内仓】需要判断在途库存和可提数量
				// 先判断是否有在途库存和可提数量
				if (onwayQty <= 0) {
					// 没有则弹出模态窗提示
					useMessageBox().error(t('勾选的产品库存必须有在途库存,请确认!'));
					return;
				}

				// 有在途库存和可提数量，打开国内仓转库存申请弹窗
				currentRow.value = row;
				domesticTransferDialogRef.value.open(row);
			} else {
				// 【海外仓】保持现有逻辑
				// 判断是否有可用库存 --放入弹窗处理
				// if (!row.availableQty) {
				// 	useMessageBox().error(t('勾选的产品库存必须有可用库存，请确认！'));
				// 	return;
				// }

				// 有可用库存，打开海外仓转库存申请弹窗
				currentRow.value = row;
				thirdpartyDialogRef.value.open(row);
			}
		}
	} catch (error: any) {
		useMessage().error(error?.msg || t('未知错误'));
	}
};
/***
 * 二程调拨确认
 */
const secondMileConfirm = async (e: any) => {
	const params: any = {};
	// 调入仓
	params.takeInWarehouse = e.takeInWarehouse;
	// 调出仓
	params.takeOutWarehouse = e.takeOutWarehouse;
	// 运输方式
	params.transportMethod = e.transportMethod;
	// 货代方式
	params.freightForwarderListByCondition = e.freightForwarderListByCondition;
	// 预计发货日期
	params.planShipmentDate = e.planShipmentDate;
	// 备注
	params.remark = e.remark;
	params.type = 'SECOND_MILE_STOCK'; // 类型：SECOND_MILE_STOCK 库存入二程
	const arr: any = [];
	// 处理数据
	e.tableConfirmData.forEach((item: any) => {
		if (item.stockCartonList && item.stockCartonList.length > 0) {
			item.stockCartonList.forEach((carton: any) => {
				// 找到在stockCartonVoList对应的item
				const stockCartonVo = item.stockCartonVOList.find(
					(vo: any) => vo.skuCartonCode === carton.skuCartonCodes
				);
				arr.push({
					// 发货方式
					shippingMethod: e?.shippingMethod,
					// 增值服务
					addedService: item?.addedService,
					// 平台店铺
					storeId: item?.storeId,
					// 平台入库单
					shipmentId: item?.shipmentId,
					// 条码
					barcode: item?.barcode,
					// 送仓码/关联单号
					referenceId: item?.referenceId,
					// 附件 箱唛
					shippingMarkAttachments: item?.shippingMarkAttachments,
					// 附件 条码
					barcodeAttachments: item?.barcodeAttachments,
					// 附件 透明码
					transparencyAttachments: item?.transparencyAttachments,
					// 附件 其他
					otherAttachments: item?.otherAttachments,
					...stockCartonVo,
					intoTotalQuantity: carton.intoTotalQuantity,
					takeCarton: carton.takeCarton,
					...carton,
					legalPersonId: selectedData.value[0].legalPersonId,
				});
			});
		}
	});
	const secondMileDeliveryMessageList = arr.map((item: any) => {
		return {
			...item,
		};
	});
	params.deliveryList = secondMileDeliveryMessageList;
	const res = await postInsertSecondMile(params);
	if (res.code === 0) {
		useMessage().success(t('操作成功'));
		secondMileRef.value?.hide();
		getDataList();
	}
};
</script>

<style lang="scss" scoped>
.text-blue {
	color: #0089ef;
}
.el-dropdown-link {
	cursor: pointer;
	color: var(--el-color-primary);
	display: flex;
	align-items: center;
}
:deep(.el-table__footer-wrapper tfoot td.el-table__cell) {
	text-align: center;
}
</style>
