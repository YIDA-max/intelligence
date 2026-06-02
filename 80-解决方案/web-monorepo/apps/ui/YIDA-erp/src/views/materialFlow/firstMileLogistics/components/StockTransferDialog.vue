<template>
	<confirm-dialog
		ref="dialogRef"
		:title="title"
		:cancel-button-text="$t('取消')"
		:confirm-button-text="$t('下一步')"
		:confirm-button-type="'primary'"
		:show-confirm-button="true"
		width="80%"
		@cancel="handleCancel"
		@confirm="handleConfirm"
		@closed="handleClosed"
		@opened="handleOpened"
	>
		<el-form ref="formRef" :inline="false" label-position="right">
			<div class="section-title"><span class="section-bar"></span>基础信息</div>
			<div class="form-content">
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="调出仓：" label-width="120px">
							<span>CN1</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="是否中转拆柜：" label-width="120px">
							<span>{{
								currentRow?.transshipmentFlag === 1
									? '是'
									: currentRow?.transshipmentFlag === 0
									? '否'
									: '-'
							}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="目的仓：" label-width="120px">
							<span>{{ destWarehouseDisplay }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="中转仓：" label-width="120px">
							<span>{{ currentRow?.transWarehouseName || '--' }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="运输方式：" label-width="120px">
							<span>{{ currentRow?.transportMethodText || '--' }}</span>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="柜号：" label-width="120px">
							<span>{{ currentRow?.containerNo || '--' }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="货代信息：" label-width="120px">
							<span>{{ forwarderDisplay }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="实际装柜时间：" label-width="120px">
							<span>{{ currentRow?.actualLoadingTime || '--' }}</span>
						</el-form-item>
					</el-col>
				</el-row>
			</div>

			<div class="section-title">
				<span class="section-bar"></span>选择发货明细
			</div>
			<el-table
				ref="tableRef"
				:data="deliveryList"
				border
				style="width: 100%"
				max-height="400"
				@selection-change="handleSelectionChange"
				@select="handleSelect"
				native-scrollbar
			>
				<el-table-column
					fixed="left"
					type="selection"
					width="55"
					align="center"
				/>
				<el-table-column
					v-for="column in columns"
					:key="column.prop"
					:prop="column.prop"
					:label="column.label"
					:width="column.width"
					:min-width="column.minWidth"
					:show-overflow-tooltip="column.showOverflowTooltip"
				>
					<template #default="{ row }">
						<div v-if="column.type === 'sku'">
							<p>{{ row.skuCode }}</p>
							<p>{{ row.skuName }}</p>
						</div>
						<span v-else>{{
							column.formatter ? column.formatter(row) : row[column.prop] || '-'
						}}</span>
					</template>
				</el-table-column>
			</el-table>
		</el-form>
	</confirm-dialog>

	<!-- 第二步弹窗 -->
	<StockTransferDetailDialog
		ref="detailDialogRef"
		:dictMap="props.dictMap"
		@previous="handlePreviousFromDetail"
		@confirm="handleDetailConfirm"
	/>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMessage, useMessageBox } from '/@/hooks/message';

const ConfirmDialog = defineAsyncComponent(
	() => import('/@/components/ConfirmDialog/index.vue')
);
const StockTransferDetailDialog = defineAsyncComponent(
	() => import('./StockTransferDetailDialog.vue')
);

const { t } = useI18n();

// Props
const props = defineProps({
	dictMap: { type: Object, default: () => ({}) },
});

// 弹窗引用
const dialogRef = ref();
const formRef = ref();
const tableRef = ref();
const detailDialogRef = ref();

// 当前行数据
const currentRow = ref<any>({});

// 标题
const title = computed(() => t('转库存申请—头程在途转换'));

// 发货明细列表（模拟数据，待接口对接）
const deliveryList = ref<any[]>([]);

// 选中的发货明细
const selectedDeliveryList = ref<any[]>([]);

// 标志位：是否正在步骤间导航（而非真正关闭弹窗）
const isNavigating = ref(false);

// 缓存第二步的编辑数据
const cachedDetailData = ref<any>(null);

// 目的仓显示
const destWarehouseDisplay = computed(() => {
	if (
		!currentRow.value?.destWarehouseNameList ||
		currentRow.value.destWarehouseNameList.length === 0
	) {
		return '--';
	}
	// 使用 showInfo.vue 的逻辑：展示所有去重后的目的仓，用逗号分隔
	return (
		[...new Set(currentRow.value.destWarehouseNameList)]?.join(', ') || '--'
	);
});

// 货代信息显示
const forwarderDisplay = computed(() => {
	const row = currentRow.value;
	if (!row) return '-';
	return (
		[
			row.domesticForwarderName && `国内拖车：${row.domesticForwarderName}`,
			row.mainForwarderName && `主运：${row.mainForwarderName}`,
			row.customsForwarderName && `清关：${row.customsForwarderName}`,
			row.deliveryForwarderName && `国外派送：${row.deliveryForwarderName}`,
		]
			.filter(Boolean)
			.join(' ｜ ') || '-'
	);
});

// 表格列配置
const columns = [
	{
		prop: 'deliveryNo',
		label: '发货单号',
		width: 150,
		showOverflowTooltip: true,
	},
	{
		prop: 'shippingMethodText',
		label: '发货方式',
		width: 100,
		showOverflowTooltip: true,
	},
	{
		prop: 'destWarehouseName',
		label: '目的仓',
		width: 150,
		showOverflowTooltip: true,
	},
	{
		prop: 'skuCode',
		label: 'SKU/产品名称',
		minWidth: 200,
		showOverflowTooltip: true,
		type: 'sku',
	},
	{
		prop: 'deliveryCartonQuantity',
		label: '发货箱数',
		width: 100,
	},
	{
		prop: 'shipmentQuantity',
		label: '发货数量',
		width: 100,
	},
	{
		prop: 'intoTotalCartonQuantity',
		label: '入库箱数',
		width: 100,
		formatter: (row: any) => row.intoTotalCartonQuantity || '0',
	},
	{
		prop: 'intoTotalQuantity',
		label: '入库数量',
		width: 100,
		formatter: (row: any) => row.intoTotalQuantity || '0',
	},
	{
		prop: 'singleCartonQuantity',
		label: '单箱数量',
		width: 100,
	},
	{
		prop: 'skuCartonCode',
		label: '箱规编码',
		width: 120,
		showOverflowTooltip: true,
	},
	{
		prop: 'boxSize',
		label: '外箱长宽高(CM)',
		width: 150,
		showOverflowTooltip: true,
		formatter: (row: any) =>
			row.outCartonLength
				? `${row.outCartonLength}*${row.outCartonWidth}*${row.outCartonHeight}`
				: '-',
	},
	{
		prop: 'productNetWeight',
		label: '产品净重(KG)',
		width: 120,
		formatter: (row: any) => row.productNetWeight?.toFixed(2) || '-',
	},
	{
		prop: 'outCartonGrossWeight',
		label: '外箱毛重(KG)',
		width: 120,
		formatter: (row: any) => row.outCartonGrossWeight?.toFixed(2) || '-',
	},
	{
		prop: 'totalVolume',
		label: '总体积(m³)',
		width: 120,
		formatter: (row: any) => row.totalVolume?.toFixed(2) || '-',
	},
	{
		prop: 'totalNetWeight',
		label: '总净重(KG)',
		width: 120,
		formatter: (row: any) => row.totalNetWeight?.toFixed(2) || '-',
	},
	{
		prop: 'totalGrossWeight',
		label: '总毛重(KG)',
		width: 120,
		formatter: (row: any) => row.totalGrossWeight?.toFixed(2) || '-',
	},
	{
		prop: 'countryCode',
		label: '国家',
		width: 100,
	},
	{
		prop: 'platformChannelCodeText',
		label: '平台渠道',
		width: 120,
		showOverflowTooltip: true,
	},
	{
		prop: 'mskuCode',
		label: 'MSKU',
		width: 120,
		showOverflowTooltip: true,
	},
	{
		prop: 'storeName',
		label: '平台店铺',
		width: 120,
		showOverflowTooltip: true,
	},
	{
		prop: 'shipmentId',
		label: '平台入库单',
		width: 120,
		showOverflowTooltip: true,
	},
	{
		prop: 'barcode',
		label: '条码',
		width: 120,
		showOverflowTooltip: true,
	},
	{
		prop: 'referenceId',
		label: '送仓码/关联单号',
		width: 150,
		showOverflowTooltip: true,
	},
	{
		prop: 'deptName',
		label: '部门&小组',
		width: 120,
		showOverflowTooltip: true,
	},
	{
		prop: 'operationUserName',
		label: '运营人',
		width: 100,
		showOverflowTooltip: true,
	},
];

// 打开弹窗
const show = async () => {
	// currentRow.value = row;
	// 加载发货明细数据
	await loadDeliveryList();
	dialogRef.value?.show();
};

// 隐藏弹窗
const hide = () => {
	dialogRef.value?.hide();
};

// 加载发货明细列表
const loadDeliveryList = async () => {
	try {
		// TODO: 接口对接 - 调用接口获取发货明细
		// const res = await getDetailById({ id: row.id });
		// if (res.code === 0) {
		// 	deliveryList.value = res.data?.deliveryList || [];
		// 	currentRow.value = res.data;
		// 	return;
		// }

		// 模拟数据（接口未对接前使用）
		// 接口对接后将使用 row.id 作为参数请求
		currentRow.value = {
			createId: 1,
			createName: '管理员',
			updateId: 1,
			updateName: '管理员',
			createTime: '2025-11-10 19:59:08',
			updateTime: '2025-11-10 19:59:08',
			delFlag: '0',
			id: 13,
			firstMileNo: 'FL202511100008',
			orderContainerNo: 'KJCNNBOGE25ces0058',
			intoNo: null,
			intoPredictionTime: null,
			predictionWarehouseCode: null,
			autoIntoFlag: 0,
			status: 1,
			startCountryCode: 'US',
			destCountryCode: 'GE',
			startPortCode: 'CNNBO',
			destPortCode: 'USNYK',
			transportMethod: '1',
			shippingMethod: null,
			domesticForwarderNo: 'huodai001',
			mainForwarderNo: 'HU-3434',
			customsForwarderNo: 'HU-343455',
			deliveryForwarderNo: 'test01',
			transshipmentFlag: 0,
			transshipmentWarehouseCode: null,
			actualLoadingTime: '2025-11-10 00:00:00',
			containerType: '40GP',
			soNo: '1231231',
			containerNo: '123123123',
			containerTotalQuantity: 100,
			containerTotalCartonQuantity: 10,
			intoTotalQuantity: 0,
			intoTotalCartonQuantity: 0,
			containerTotalVolume: 0.01,
			containerTotalNetWeight: 920,
			containerTotalGrossWeight: 100,
			statusText: '已出库',
			destWarehouseNameList: ['GLK仓库'],
			transshipmentFlagText: '否',
			transWarehouseName: null,
			startCountryText: '美国',
			destCountryText: '格鲁吉亚',
			startPortText: '宁波港',
			destPortText: '纽约港',
			shippingMethodText: 'null',
			transportMethodText: '海运-OA船',
			domesticForwarderName: '货代测试',
			mainForwarderName: '有点东西',
			customsForwarderName: '堡森',
			deliveryForwarderName: 'test货代',
			containerTypeText: '40GP',
			deliveryVOList: [
				{
					id: 21,
					firstMileNo: 'FL202511100008',
					deliveryNo: 'SP202511100001',
					destWarehouseCode: '17',
					thirdWarehouseFlag: true,
					skuCode: 'han-test',
					shipmentId: null,
					deliveryCartonQuantity: 10,
					singleCartonQuantity: 10,
					availableCarton: null,
					shipmentQuantity: 100,
					allowIntoQuantity: 100,
					skuCartonCode: 'han-test',
					availableQty: null,
					takeFirstContainerQuantity: 0,
					outCartonLength: 10,
					outCartonWidth: 10,
					outCartonHeight: 10,
					productNetWeight: 9.2,
					outCartonGrossWeight: 10,
					totalVolume: 0.01,
					totalNetWeight: 920,
					totalGrossWeight: 100,
					countryCode: 'GE',
					platformChannelCode: 'Amazon',
					mskuCode: 'han-msku-test',
					shippingMethod: 'dropshipping',
					storeId: null,
					channelShipmentInfo: null,
					barcode: null,
					referenceId: null,
					deptId: 36,
					operationUserId: 1,
					shippingMarkAttachment: null,
					barcodeAttachment: '653680411d77480694c23ed22ac22d08.pdf',
					transparencyAttachment: null,
					skuName: 'han-test',
					storeName: null,
					deptName: '亚马逊A组',
					operationUserName: '管理员',
					destWarehouseName: 'GLK仓库',
					platformChannelCodeText: 'Amazon',
					shippingMethodText: '一件代发',
					intoTotalQuantity: 0,
					intoTotalCartonQuantity: 0,
					transshipmentWarehouseCode: null,
					transWarehouseName: null,
					shippingMarkAttachmentOrigin: null,
					barcodeAttachmentOrigin: 'han-test.pdf',
					transparencyAttachmentOrigin: null,
				},
			],
			needPredictionFlag: 0,
		};
		deliveryList.value = currentRow.value.deliveryVOList;
	} catch (error: any) {
		useMessage().error(error?.msg || t('获取发货明细失败'));
	}
};

// 选择变更
const handleSelectionChange = (selection: any[]) => {
	selectedDeliveryList.value = selection;
};

// 处理单行勾选
const handleSelect = (selection: any[], row: any) => {
	// 判断是否勾选（如果 selection 中包含 row，说明是勾选操作）
	const isChecked = selection.indexOf(row) !== -1;

	if (isChecked) {
		// 校验逻辑
		// 1. 如果是中转拆柜 ，允许
		if (currentRow.value?.transshipmentFlag) {
			return;
		}

		// 2. 如果非中转拆柜，必须是三方仓
		if (!row.thirdWarehouseFlag) {
			useMessageBox().error(t('勾选的目的仓必须为三方仓,请重新勾选！'));

			// 取消勾选
			tableRef.value?.toggleRowSelection(row, false);
		}
	}
};

// 取消
const handleCancel = () => {
	isNavigating.value = false; // 真正关闭
	hide();
};

// 确认（下一步）
const handleConfirm = () => {
	// 验证是否至少选中一条发货明细
	if (selectedDeliveryList.value.length === 0) {
		useMessage().warning(t('请至少选择一条发货明细'));
		return;
	}

	// 设置导航标志位为 true，表示是步骤间导航，不清空数据
	isNavigating.value = true;

	// 根据当前选中的发货明细，更新缓存数据
	// 保留仍然被选中的明细的缓存数据，移除被取消勾选的数据
	let mergedCachedData = null;
	if (cachedDetailData.value && cachedDetailData.value.length > 0) {
		// 将缓存数据转换为 Map，以 deliveryNo + skuCode 作为 key
		const cachedMap = new Map();
		cachedDetailData.value.forEach((item: any) => {
			const key = `${item.originData?.deliveryNo}_${item.originData?.skuCode}`;
			cachedMap.set(key, item);
		});

		// 根据当前选中的列表，构建合并后的缓存数据
		mergedCachedData = selectedDeliveryList.value.map((delivery: any) => {
			const key = `${delivery.deliveryNo}_${delivery.skuCode}`;
			const cachedItem = cachedMap.get(key);

			// 如果存在缓存数据，返回缓存数据（保留用户编辑的内容）
			if (cachedItem) {
				return cachedItem;
			}

			// 如果不存在缓存数据，返回 null，让第二步弹窗初始化该明细
			return null;
		});
	}

	// 打开下一步弹窗，传递基础信息、选中的发货明细和合并后的缓存数据
	detailDialogRef.value?.show(
		currentRow.value,
		selectedDeliveryList.value,
		mergedCachedData
	);
	// 隐藏第一步弹窗（但不清空数据）
	hide();
};

// 处理从第二步返回
const handlePreviousFromDetail = (data: any) => {
	// 从第二步返回时，重新显示第一步弹窗
	// 缓存第二步的编辑数据
	cachedDetailData.value = data?.detailList || null;

	// 设置导航标志位为 true，表示是从第二步返回，保持数据
	isNavigating.value = true;

	// 重新显示第一步弹窗
	dialogRef.value?.show();

	// 恢复之前的选中状态
	setTimeout(() => {
		if (tableRef.value && selectedDeliveryList.value.length > 0) {
			selectedDeliveryList.value.forEach((row: any) => {
				tableRef.value.toggleRowSelection(row, true);
			});
		}
	}, 100);
};

// 确认提交
const handleDetailConfirm = async () => {
	// data: any
	// 构建提交数据
	// const submitList = data.map((group: any) => {
	// 	const row = group.newRows[0];
	// 	const origin = group.originList[0];
	// 	return {
	// 		oldDTO: {
	// 			...origin,
	// 		},
	// 		newDTO: {
	// 			...row,
	// 		},
	// 	};
	// });
	// try {
	// const res = await transferInventoryReview({
	// 	deliveryList: submitList, //TODO: 这里是当前全部新需求单的提交数据
	// 	stockTransferType: 1, //1、采购在途转换，2，海外仓在途转换，3、头程在途转换
	// 	firstMileId: currentRow.value.id, //头程id
	// });
	// if (res.code !== 0) {
	// 	throw new Error(res.msg || '提交失败');
	// }
	// 	useMessage().success('提交成功');
	// } catch (error: any) {
	// 	useMessage().error(error.msg || error.message || '提交失败');
	// }
};
// 弹窗关闭
const handleClosed = () => {
	// 只有在非导航状态下（真正关闭弹窗）才清空数据
	if (!isNavigating.value) {
		currentRow.value = {};
		deliveryList.value = [];
		selectedDeliveryList.value = [];
		cachedDetailData.value = null;
		tableRef.value?.clearSelection();
	}
	// 重置导航标志位
	isNavigating.value = false;
};

// 弹窗打开
const handleOpened = () => {
	// 弹窗打开后的操作
};

// 暴露方法
defineExpose({
	show,
	hide,
});
</script>

<style scoped lang="scss">
.form-content {
	background-color: #f5f7fa;
	padding: 16px;
	border-radius: 4px;
	margin-bottom: 16px;
}
.section-title {
	display: flex;
	align-items: center;
	margin-bottom: 16px;
	font-size: 14px;
	font-weight: bold;
	color: #303133;

	.section-bar {
		display: inline-block;
		width: 3px;
		height: 14px;
		margin-right: 8px;
		background-color: #409eff;
	}
}

.mb18 {
	margin-bottom: 18px;
}

:deep(.el-form-item) {
	margin-bottom: 0;
}

:deep(.el-form-item__label) {
	font-weight: normal;
	color: #606266;
}
</style>
