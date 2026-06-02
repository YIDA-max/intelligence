<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view box-padding">
			<div class="title-box">
				<span>
					{{ title }}
				</span>
				<div class="action-box">
					<el-button
						type="primary"
						v-if="
							activeTab === 'estimate' &&
							auth('secondMileLogistics_showInfo_addFeeEstimated')
						"
						@click="openFeeDialog('estimate')"
						>录入预估费用</el-button
					>
					<el-button
						type="primary"
						v-if="
							activeTab === 'actual' &&
							auth('secondMileLogistics_showInfo_addFeeActual')
						"
						@click="openFeeDialog('actual')"
						>录入实际费用</el-button
					>
				</div>
			</div>
			<el-form ref="formRef" :inline="false" label-position="left">
				<div class="section-title">
					<span class="section-bar"></span>基本信息
				</div>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="调出仓">
							<span>{{ currentRow?.basicInfo.takeOutWarehouse || '--' }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="调入仓">
							<span>{{ currentRow?.basicInfo.takeInWarehouse || '--' }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="24">
						<el-form-item label="运输方式">
							<span>{{
								currentRow?.basicInfo.transportMethodText || '--'
							}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="24"
						><el-form-item label="预计发货日期">
							<span>{{ currentRow?.basicInfo.planShipmentDate || '--' }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="12"
						><el-form-item label="调拨备注">
							<span>{{ currentRow?.basicInfo.remark || '--' }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<div class="section-title">
					<span class="section-bar"></span>调拨明细
				</div>
				<div style="margin-top: 12px">
					<el-tabs v-model="activeTab">
						<el-tab-pane label="发货明细" name="delivery" />
						<el-tab-pane label="预估费用" name="estimate" />
						<el-tab-pane label="实际费用" name="actual" />
						<el-tab-pane label="预估费用分摊" name="estimateAllocation" />
						<el-tab-pane label="实际费用分摊" name="actualAllocation" />
					</el-tabs>
					<div style="margin-top: 12px">
						<!-- 发货明细表格（默认） -->
						<template v-if="activeTab === 'delivery'">
							<MrTable
								:data="currentRow?.detailList || []"
								border
								height="400"
								style="width: 100%"
								native-scrollbar
							>
								<MrTableColumn
									label="发货单号"
									prop="deliveryNo"
									width="160"
									show-overflow-tooltip
								>
									<template #default="{ row }">
										{{ row.deliveryNo || '-' }}
									</template>
								</MrTableColumn>
								<MrTableColumn prop="skuCode" label="SKU/产品名称" width="250">
									<template #default="{ row }">
										<div
											style="
												display: flex;
												flex-direction: column;
												justify-content: center;
												align-items: flex-start;
												width: 100%;
											"
										>
											<div
												style="
													max-width: 100%;
													overflow: hidden;
													white-space: nowrap;
													text-overflow: ellipsis;
												"
											>
												{{ row.skuCode }}
											</div>
											<div
												style="
													max-width: 100%;
													overflow: hidden;
													white-space: nowrap;
													text-overflow: ellipsis;
												"
											>
												{{ row.productName }}
											</div>
										</div>
									</template>
								</MrTableColumn>
								<MrTableColumn label="调拨数量" width="120">
									<template #default="{ row }">
										{{ row.takeSecondContainerQuantity || '-' }}
									</template>
								</MrTableColumn>
								<MrTableColumn label="本次调拨箱数" width="120">
									<template #default="{ row }">
										{{ row.takeSecondCartonQuantity || '-' }}
									</template>
								</MrTableColumn>
								<MrTableColumn
									prop="platformChannelCode"
									:label="t('渠道')"
									show-overflow-tooltip
									width="180"
								>
									<template #default="{ row }">
										{{ row?.platformChannelText || '---' }}
									</template>
								</MrTableColumn>
								<MrTableColumn
									prop="platformStore"
									:label="t('平台店铺')"
									show-overflow-tooltip
									width="180"
								>
									<template #default="{ row }">
										{{ row?.platformStore || '---' }}:{{
											row?.storeName || '---'
										}}:{{ row?.storeSite || '---' }}
									</template>
								</MrTableColumn>
								<MrTableColumn
									prop="mskuCode"
									:label="t('MSKU')"
									show-overflow-tooltip
									width="180"
								>
									<template #default="{ row }">
										{{ row.mskuCode || '---' }}
									</template>
								</MrTableColumn>
								<MrTableColumn
									prop=""
									:label="t('平台入库单')"
									show-overflow-tooltip
									width="180"
								>
									<template #default="{ row }">
										{{ row?.shipmentId || '---' }}
									</template>
								</MrTableColumn>
								<MrTableColumn
									prop=""
									:label="t('条码')"
									show-overflow-tooltip
									width="180"
								>
									<template #default="{ row }">
										{{ row?.barcode || '---' }}
									</template>
								</MrTableColumn>
								<MrTableColumn
									prop=""
									:label="t('送仓码/关联单号')"
									show-overflow-tooltip
									width="180"
								>
									<template #default="{ row }">
										{{ row?.referenceId || '---' }}
									</template>
								</MrTableColumn>
								<MrTableColumn
									prop=""
									:label="t('附件')"
									width="250"
									:showOverflowTooltip="false"
								>
									<template #default="{ row }">
										箱唛：<el-tooltip
											:content="row.shippingMarkAttachmentName || '---'"
											placement="top"
											:disabled="
												!row.shippingMarkAttachmentName ||
												row.shippingMarkAttachmentName.length <= 20
											"
										>
											<el-link
												target="_blank"
												:href="row.shippingMarkAttachmentUrl"
												type="primary"
												class="attachment-link"
												>{{
													truncateFileName(row.shippingMarkAttachmentName) ||
													'---'
												}}</el-link
											>
										</el-tooltip>
										<br />
										条码：<el-tooltip
											:content="row.barcodeAttachmentName || '---'"
											placement="top"
											:disabled="
												!row.barcodeAttachmentName ||
												row.barcodeAttachmentName.length <= 20
											"
										>
											<el-link
												target="_blank"
												:href="row.barcodeAttachmentUrl"
												type="primary"
												class="attachment-link"
												>{{
													truncateFileName(row.barcodeAttachmentName) || '---'
												}}</el-link
											>
										</el-tooltip>
										<br />
										透明计划标签：<el-tooltip
											:content="row.transparencyAttachmentName || '---'"
											placement="top"
											:disabled="
												!row.transparencyAttachmentName ||
												row.transparencyAttachmentName.length <= 20
											"
										>
											<el-link
												target="_blank"
												:href="row.transparencyAttachmentUrl"
												type="primary"
												class="attachment-link"
												>{{
													truncateFileName(row.transparencyAttachmentName) ||
													'---'
												}}</el-link
											>
										</el-tooltip>
										<br />
										其他：<el-tooltip
											:content="row.otherAttachmentName || '---'"
											placement="top"
											:disabled="
												!row.otherAttachmentName ||
												row.otherAttachmentName.length <= 20
											"
										>
											<el-link
												target="_blank"
												:href="row.otherAttachmentUrl"
												type="primary"
												class="attachment-link"
												>{{
													truncateFileName(row.otherAttachmentName) || '---'
												}}</el-link
											>
										</el-tooltip>
										<br />
									</template>
								</MrTableColumn>
								<MrTableColumn
									prop="skuCartonCode"
									:label="t('箱规编码')"
									show-overflow-tooltip
									width="180"
								>
									<template #default="{ row }">
										{{ row.skuCartonCode || '---' }}
									</template>
								</MrTableColumn>
								<MrTableColumn
									prop="singleCartonQuantity"
									:label="t('单箱数量')"
									show-overflow-tooltip
									width="180"
								>
									<template #default="{ row }">
										{{ row.singleCartonQuantity || '---' }}
									</template>
								</MrTableColumn>
								<MrTableColumn
									prop="outCartonSize"
									:label="t('外箱长宽高(CM)')"
									show-overflow-tooltip
									width="200"
								>
									<template #default="{ row }">
										{{ row.outCartonSize || '---' }}
									</template>
								</MrTableColumn>
								<MrTableColumn
									prop="outCartonGrossWeight"
									:label="t('外箱毛重(KG)')"
									show-overflow-tooltip
									width="180"
								>
									<template #default="{ row }">
										{{ formatNumber(row.outCartonGrossWeight) }}
										<!-- {{ row.outCartonGrossWeight?.toFixed(2) || '---' }} -->
									</template>
								</MrTableColumn>

								<MrTableColumn
									prop="deptName"
									:label="t('部门&小组')"
									show-overflow-tooltip
									width="180"
								>
									<template #default="{ row }">
										{{ row.departmentName || '---' }} &
										{{ row.deptName || '---' }}
									</template>
								</MrTableColumn>
								<MrTableColumn
									prop="operationName"
									:label="t('运营人')"
									show-overflow-tooltip
									width="180"
								/>
							</MrTable>
						</template>
						<!-- 预估费用和实际费用表格 -->
						<template
							v-else-if="activeTab === 'estimate' || activeTab === 'actual'"
						>
							<MrTable
								:data="otherList"
								style="width: 100%"
								v-loading="loading"
								border
								row-key="id"
								ref="tableRef"
								height="400"
							>
								<MrTableColumn
									v-for="item in tableFeeColumn"
									v-bind="item"
									:title="t(item.label)"
									:prop="item.field"
									:key="item.field"
								>
									<template #default="{ row }">
										<span v-if="item.field === 'forwarderCode'"
											>{{ row[item.field] || '-' }} -
											{{ row.forwarderName || '-' }}</span
										>
										<span v-else-if="item.field === 'fee'"
											>{{
												row[item.field] || row[item.field] == 0
													? row[item.field]
													: '-'
											}}
											{{ row.currency || '-' }}</span
										>
										<span v-else>{{ row[item.field] || '-' }}</span>
									</template>
								</MrTableColumn>
							</MrTable>
						</template>
						<!-- 预估费用分摊和实际费用分摊表格 -->
						<template
							v-else-if="
								activeTab === 'estimateAllocation' ||
								activeTab === 'actualAllocation'
							"
						>
							<MrTable
								:data="otherList"
								style="width: 100%"
								v-loading="loading"
								border
								:row-key="getAllocationRowKey"
								height="400"
								ref="tableRef"
								:summary-method="getAllocationSummaries"
								show-summary
							>
								<MrTableColumn
									prop="deliveryNo"
									:label="t('发货单号')"
									min-width="140"
									show-overflow-tooltip
								/>
								<MrTableColumn prop="skuCode" label="SKU/产品名称" width="250">
									<template #default="{ row }">
										<div
											style="
												display: flex;
												flex-direction: column;
												justify-content: center;
												align-items: flex-start;
												width: 100%;
											"
										>
											<div
												style="
													max-width: 100%;
													overflow: hidden;
													white-space: nowrap;
													text-overflow: ellipsis;
												"
											>
												{{ row.skuCode }}
											</div>
											<div
												style="
													max-width: 100%;
													overflow: hidden;
													white-space: nowrap;
													text-overflow: ellipsis;
												"
											>
												{{ row.skuName }}
											</div>
										</div>
									</template>
								</MrTableColumn>

								<!-- 先不展示 -->
								<!-- <MrTableColumn
									:label="t('货代')"
									min-width="120"
									show-overflow-tooltip
								>
									<template #default="{ row }">
										{{
											row.fafowarderName ||
											row.forwarderName ||
											row.forwarderCode ||
											'-'
										}}
									</template>
								</MrTableColumn> -->
								<!-- <MrTableColumn
									prop="legalPersonName"
									:label="t('费用承担主体')"
									min-width="140"
									show-overflow-tooltip
								/> -->
								<!-- <MrTableColumn
									prop="accountsReceiptTypeDesc"
									:label="t('入账方式')"
									width="120"
									show-overflow-tooltip
								/>
								<MrTableColumn
									prop="quantity"
									:label="t('数量')"
									width="90"
									align="right"
								/> -->
								<!-- 发货数量 -> 调拨数量 产品说改的 -->
								<MrTableColumn
									label="调拨数量"
									prop="deliveryQuantity"
									width="100"
								/>
								<MrTableColumn
									prop="skuCartonCode"
									:label="t('箱规编码')"
									min-width="120"
									show-overflow-tooltip
								/>
								<MrTableColumn
									prop="size"
									:label="t('外箱长宽高(CM)')"
									min-width="140"
									show-overflow-tooltip
								/>
								<MrTableColumn
									prop="volumeSum"
									:label="t('总体积(m³)')"
									width="100"
								/>
								<MrTableColumn
									prop="grossWeight"
									:label="t('外箱毛重(KG)')"
									width="120"
								/>
								<MrTableColumn
									prop="grossWeightSum"
									:label="t('总毛重(KG)')"
									width="100"
								/>
								<MrTableColumn
									label="申报单价"
									prop="declareUnitPrice"
									width="110"
								>
									<template #default="{ row }">
										{{
											row.declareUnitPrice
												? getCurrencySymbol(row.declareCurrency)
												: ''
										}}
										{{ row.declareUnitPrice ? row.declareUnitPrice : '---' }}
									</template>
								</MrTableColumn>
								<MrTableColumn
									label="申报总价"
									prop="declareTotalPrice"
									width="110"
								>
									<template #default="{ row }">
										{{
											row.declareTotalPrice
												? getCurrencySymbol(row.declareCurrency)
												: ''
										}}
										{{ row.declareTotalPrice ? row.declareTotalPrice : '---' }}
									</template>
								</MrTableColumn>
								<!-- 费用1…费用N：每列组含分摊方式/分摊单价/分摊总价 -->
								<el-table-column
									v-for="feeCol in previewFeeColumns"
									:key="feeCol.transferFeeId"
									:label="feeCol.transferFeeName"
									align="center"
								>
									<el-table-column
										label="分摊方式"
										:prop="feeCol.shareTypeProp"
										min-width="120"
										show-overflow-tooltip
									/>
									<el-table-column
										label="入账方式"
										:prop="feeCol.accountsReceiptTypeDesc"
										min-width="120"
										show-overflow-tooltip
									/>
									<el-table-column
										label="分摊单价"
										:prop="feeCol.shareUnitPriceProp"
										min-width="120"
										show-overflow-tooltip
									>
										<template #default="{ row }">
											{{ getCurrencySymbol(row[feeCol.currencyProp]) }}
											{{ row[feeCol.shareUnitPriceProp] }}
										</template>
									</el-table-column>
									<el-table-column
										label="分摊总价"
										:prop="feeCol.shareTotalPriceProp"
										min-width="120"
										show-overflow-tooltip
									>
										<template #default="{ row }">
											{{ getCurrencySymbol(row[feeCol.currencyProp]) }}
											{{ row[feeCol.shareTotalPriceProp] }}
										</template>
									</el-table-column>
									<el-table-column
										label="汇率"
										:prop="feeCol.exchangeRateProp"
										min-width="100"
										show-overflow-tooltip
									/>
								</el-table-column>
								<!-- 费用分摊总价 -->
								<MrTableColumn
									label="费用分摊总价"
									prop="transferTotalFee"
									width="160"
									fixed="right"
									show-overflow-tooltip
								>
									<template #default="{ row }">
										{{ getCurrencySymbol(row.currency) }}
										{{ row.transferTotalFee }}
									</template>
								</MrTableColumn>
							</MrTable>
						</template>
					</div>
				</div>
			</el-form>
		</div>

		<!-- 费用录入弹窗 -->
		<FeeDialog ref="feeDialogRef" @refresh="handleRefresh" />
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useMessage } from '/@/hooks/message';
import { getSecondMileDetail } from '/@/api/materialFlow/secondMileLogistics/index';
import { auth } from '/@/utils/authFunction';
import {
	transferFeeList,
	getTransferFeeList,
} from '/@/api/materialFlow/secondMileLogistics';
import { getCurrencySymbol } from '/@/utils/rateUtils';
const FeeDialog = defineAsyncComponent(
	() => import('./components/FeeDialog.vue')
);

const { t } = useI18n();
const route = useRoute();
const msg = useMessage();

const id = ref<string | number | string[]>((route.query.id ?? '') as string);
const transferNo = ref<string | number | string[]>(
	(route.query.transferNo ?? '') as string
);
const title = ref('二程调拨详情');
const currentRow = reactive<any>({});
const activeTab = ref<string>('delivery');
const feeDialogRef = ref<any>(null);

watch(
	() => activeTab.value,
	(newVal) => {
		if (newVal === 'estimate') {
			fetchFeeDetail(1);
		} else if (newVal === 'actual') {
			fetchFeeDetail(2);
		} else if (newVal === 'estimateAllocation') {
			fetchFeeDetail(3);
		} else if (newVal === 'actualAllocation') {
			fetchFeeDetail(4);
		}
	}
);
// 费用列表数据
const otherList = ref<any[]>([]);
const loading = ref<boolean>(false);

// 费用列表表头
const tableFeeColumn = [
	{
		field: 'forwarderCode',
		label: '货代',
		showOverflowTooltip: true,
	},
	{
		field: 'legalPersonName',
		label: '费用承担主体',
		showOverflowTooltip: true,
	},
	{
		field: 'feeItem',
		label: '费用项',
		showOverflowTooltip: true,
	},
	{
		field: 'shareTypeDesc',
		label: '费用分摊方式',
		showOverflowTooltip: true,
	},
	{
		field: 'accountsReceiptTypeDesc',
		label: '入账方式',
		showOverflowTooltip: true,
	},
	{
		field: 'fee',
		label: '费用金额',
		showOverflowTooltip: true,
	},
	{
		field: 'remark',
		label: '备注',
		showOverflowTooltip: true,
	},
	{
		field: 'updateName',
		label: '操作人',
		showOverflowTooltip: true,
	},
	{
		field: 'updateTime',
		label: '操作时间',
		showOverflowTooltip: true,
	},
];
/**
 * 预览动态列（新增）：
 * 不使用 computed，改为点击“预览分摊结果”时一次性计算并写入
 */
const previewFeeColumns = ref<
	Array<{
		transferFeeId: number;
		transferFeeName: string;
		shareTypeProp: string;
		shareUnitPriceProp: string;
		shareTotalPriceProp: string;
		exchangeRateProp: string;
		currencyProp: string;
		accountsReceiptTypeDesc: string;
	}>
>([]);
/** 分摊列表无稳定 id，用业务字段 + 分摊项拼唯一 key（接口字段 fafowarderName 为后端拼写） */
const getAllocationRowKey = (row: Record<string, unknown>) => {
	const items = (row?.transferFeeShareItemList as unknown[]) || [];
	const feePart = items
		.map((it: any) => `${it?.transferFeeId ?? ''}:${it?.shareTotalPrice ?? ''}`)
		.join('|');
	return [
		row?.deliveryNo,
		row?.skuCartonCode,
		(row as any)?.fafowarderName || (row as any)?.forwarderName,
		row?.legalPersonName,
		feePart,
	].join('__');
};

// 获取头程调拨详情
const fetchDetail = async (fetchTransferNo: string | number) => {
	if (!fetchTransferNo) return;
	try {
		const res = await getSecondMileDetail(fetchTransferNo);
		Object.assign(currentRow, res.data || {});
		title.value =
			'二程调拨详情' +
			(currentRow.secondMileNo
				? ` - ${currentRow.secondMileNo}`
				: ` - ${transferNo.value}` || '');
	} catch (e: any) {
		msg.error('获取详情失败：' + (e.message || e));
	}
};

// 费用列表
const fetchFeeDetail = async (feeType: string | number) => {
	if (!feeType) return;
	loading.value = true;
	if (feeType === 1 || feeType === 2) {
		try {
			const res = await getTransferFeeList({
				feeType,
				transferNo: transferNo.value,
				transferType: 1,
			});
			otherList.value = res.data || [];
		} catch (e: any) {
			msg.error(e.message || '获取费用详情失败');
		} finally {
			loading.value = false;
		}
		return;
	} else if (feeType === 3 || feeType === 4) {
		try {
			const res = await transferFeeList({
				transferNo: transferNo.value,
				feeType: feeType === 3 ? 1 : 2,
			});
			const { rows, columns } = feeDialogRef.value.buildPreviewRowsAndColumns(
				res?.data ?? []
			);
			previewFeeColumns.value = columns;
			otherList.value = rows;
		} catch (e: any) {
			msg.error(e.message || '获取费用详情失败');
		} finally {
			loading.value = false;
		}
	}
};

/** 汇总行部分列在 el-table 里可能拿不到 property，用表头兜底 */
const resolveAllocationColumnProp = (column: {
	property?: string;
	label?: string | (() => unknown);
}): string => {
	if (column.property) return column.property;
	const label = typeof column.label === 'string' ? column.label : '';
	if (label === '费用分摊总价') return 'transferTotalFee';
	return '';
};

/** 分摊汇总行：金额列带币种（与单元格内 getCurrencySymbol 一致） */
const getAllocationSummaryCurrencyCode = (
	prop: string,
	data: Record<string, any>[]
): string | undefined => {
	if (!data.length) return undefined;
	if (prop === 'declareUnitPrice' || prop === 'declareTotalPrice') {
		const row = data.find((r) => r?.declareCurrency) ?? data[0];
		return row?.declareCurrency as string | undefined;
	}
	const mUnit = prop.match(/^fee_(\d+)_shareUnitPrice$/);
	if (mUnit) {
		const currencyProp = `fee_${mUnit[1]}_currency`;
		const row = data.find((r) => r?.[currencyProp]) ?? data[0];
		return row?.[currencyProp] as string | undefined;
	}
	const mTotal = prop.match(/^fee_(\d+)_shareTotalPrice$/);
	if (mTotal) {
		const currencyProp = `fee_${mTotal[1]}_currency`;
		const row = data.find((r) => r?.[currencyProp]) ?? data[0];
		return row?.[currencyProp] as string | undefined;
	}
	return undefined;
};

// 预估/实际费用分摊表格汇总（同 FeeDialog 预览汇总逻辑，金额列带币种）
const getAllocationSummaries = ({
	columns,
	data,
}: {
	columns: Array<{ property?: string; label?: string | (() => unknown) }>;
	data: Record<string, any>[];
}) => {
	const sums: (string | number)[] = [];
	columns.forEach((column, index) => {
		if (index === 0) {
			sums[index] = '合计';
			return;
		}
		const prop = resolveAllocationColumnProp(column);
		if (!prop) {
			sums[index] = '';
			return;
		}

		// 汇率与方式列不统计
		if (prop.includes('_shareType') || prop.includes('_exchangeRate')) {
			sums[index] = '';
			return;
		}

		// 毛重列不统计（但“毛重合计 grossWeightSum”需要统计）
		if (prop === 'grossWeight') {
			sums[index] = '';
			return;
		}

		const total = data.reduce((sum, row) => {
			const val = Number(row?.[prop]);
			return sum + (Number.isFinite(val) ? val : 0);
		}, 0);

		if (total === 0) {
			sums[index] = '';
			return;
		}
		const numStr = Number(total.toFixed(4));
		// 与单元格一致：{{ getCurrencySymbol(row.currency) }}{{ row.transferTotalFee }}
		if (prop === 'transferTotalFee') {
			const row = data.find((r) => r?.currency) ?? data[0];
			sums[index] = `${getCurrencySymbol(row?.currency)}${numStr}`;
			return;
		}
		const currencyCode = getAllocationSummaryCurrencyCode(prop, data);
		sums[index] = currencyCode
			? `${getCurrencySymbol(currencyCode)}${numStr}`
			: numStr;
	});
	return sums;
};

onMounted(() => {
	const fetchTransferNo = (route.query.transferNo ?? '') as string | number;
	fetchDetail(fetchTransferNo);
});

// 截取文件名的函数
const truncateFileName = (fileName: string, maxLength = 20) => {
	if (!fileName) return '';
	if (fileName.length <= maxLength) return fileName;
	// 获取文件扩展名
	const lastDotIndex = fileName.lastIndexOf('.');
	if (lastDotIndex === -1) {
		// 没有扩展名，直接截取
		return fileName.substring(0, maxLength - 3) + '...';
	}

	const nameWithoutExt = fileName.substring(0, lastDotIndex);
	const extension = fileName.substring(lastDotIndex);

	// 如果扩展名太长，直接截取
	if (extension.length > maxLength - 3) {
		return fileName.substring(0, maxLength - 3) + '...';
	}
	// 保留扩展名，截取文件名部分
	const availableLength = maxLength - extension.length - 3;
	if (availableLength <= 0) {
		return extension;
	}

	return nameWithoutExt.substring(0, availableLength) + '...' + extension;
};

type FeeDialogOpenType =
	| 'estimate'
	| 'actual'
	| 'estimateAllocation'
	| 'actualAllocation';

// 打开费用录入弹窗
const openFeeDialog = async (type: FeeDialogOpenType) => {
	if (!feeDialogRef.value) return;
	feeDialogRef.value.open(type, id.value, transferNo.value);
};
// 格式化数字
const formatNumber = (value: any) => {
	if (value === null || value === undefined || value === '') {
		return '-';
	}
	const num = Number(value);
	if (isNaN(num)) {
		return '-';
	}
	return num.toFixed(2);
};

// 刷新数据（与费用相关 Tab 对齐）
const getFeeFetchParamByTab = (tab: string) => {
	if (tab === 'estimate') return 1;
	if (tab === 'actual') return 2;
	if (tab === 'estimateAllocation') return 3;
	if (tab === 'actualAllocation') return 4;
	return 0;
};

// 刷新数据
const handleRefresh = () => {
	const p = getFeeFetchParamByTab(activeTab.value);
	if (p) {
		fetchFeeDetail(p);
	}
};
</script>

<style lang="scss" scoped>
.box-padding {
	padding: 16px 24px;
}
.section-title {
	font-weight: bold;
	margin: 10px 0 10px 0;
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
.mb18 {
	margin-bottom: 18px;
}
.title-box {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 18px;
}
</style>
