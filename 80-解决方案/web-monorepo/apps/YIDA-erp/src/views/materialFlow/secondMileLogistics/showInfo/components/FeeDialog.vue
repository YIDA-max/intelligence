<!--
	[AI / 后续维护导读]

	本文件：二程调拨「费用分摊」弹窗 — 录入多行费用 → postTransferFeeShare 试算 → 下部预览表；
		→ 确认后 postTransferFeeSave 持久化。
	必读父组件：showInfo/index.vue — 使用 ref 调用 open(...) 与 feeDialogRef.value.buildPreviewRowsAndColumns(...)，
		主表里「分摊合计」必须与 buildPreviewRowsAndColumns + getPreviewSummaries 的字段规则一致，
		改摊平字段名（fee_${id}_*）或摘要逻辑时务必同步修改该 index 内汇总代码。

	镜像文件（同 UI、不同接口模块）：materialFlow/firstMileLogistics/showInfo/components/FeeDialog.vue
		改列、校验、预览/合计策略时如无业务差异宜两文件对齐或抽公共模块。

	API 分层（全局搜导入名定位）：
		transferFeeList / getTransferFeeList / postTransferFeeShare / postTransferFeeSave ← secondMileLogistics.js；
		feeConfig（费用项下拉）← firstMileLogistics（与头程共用）。
	多处写死 transferType: 1、feeType estimate→1 / actual→2，换场景先对后端契约。

	defineExpose({ open, buildPreviewRowsAndColumns }) 为对外契约 — 改名/改返回值会破坏父页与类型假设。

	高频改动：
		增删录入列 → 上部 template + validateForm + 预览/保存 payload；
		增删预览固定列 → 下部 MrTable 固定列模板 + resolveAllocationColumnProp / getPreviewSummaries；
		动态费用列通常只动 buildPreviewRowsAndColumns 与各列 prop 前缀约定。
-->

<!--
	二程调拨单 - 费用录入与分摊预览弹窗

	交互分区：
	1) 上部表格：录入/编辑多行费用（货代、承担主体、费用项、分摊方式、入账方式、金额币种、备注）；
		锁定行 paymentRequestStatus=1（已请款）来自后端时不可编辑、不可删。
		paymentRequestStatus：1、已请款；2、未请款。
	2) 「预览分摊结果」：不调保存，仅 postTransferFeeShare 试算并在下部表格展示。
	3) 下部表格：按发货明细分摊结果；左侧固定列为调拨明细，中间为每笔费用的动态多级列，
		汇总行算法见 getPreviewSummaries（须与 showInfo 主列表合计一致）。
	对外：defineExpose.open / buildPreviewRowsAndColumns，父组件 index.vue 会直接调用后者做汇总对齐。
-->
<template>
	<!-- 禁止遮罩关闭与 ESC：避免录入中途误关 -->
	<el-dialog
		v-model="dialogVisible"
		:title="dialogTitle"
		width="90%"
		height="50%"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		@close="handleClose"
	>
		<!-- ========== 区域一：费用录入表格 ========== -->
		<div class="fee-dialog-content mb-2">
			<!-- el-table 可能会“复用”前一行的 DOM 加key使列表强制刷新 -->
			<el-table
				:data="tableData"
				border
				style="width: 100%"
				height="200"
				:key="tableData.length"
			>
				<!-- 货代列 -->
				<MrTableColumn label="货代" fixed width="200">
					<template #header>
						<div class="header-with-batch">
							<span class="required-star">*</span>
							<span>货代</span>
							<BatchPopover
								ref="forwarderBatchPopover"
								type="select"
								:options="dictMap.forwarderList"
								label-key="forwarderName"
								value-key="id"
								placeholder="请选择货代"
								@confirm="handleBatchForwarder"
							/>
						</div>
					</template>
					<template #default="{ row }">
						<el-select
							v-model="row.forwarderId"
							placeholder="请选择"
							clearable
							filterable
							:disabled="!isRowEditable(row)"
							style="width: 100%"
						>
							<el-option
								v-for="item in dictMap.forwarderList"
								:key="item.id"
								:label="item.forwarderName"
								:value="item.id"
							/>
						</el-select>
					</template>
				</MrTableColumn>
				<!-- 费用承担主体列 -->
				<MrTableColumn label="费用承担主体" width="200">
					<template #header>
						<div class="header-with-batch">
							<span class="required-star">*</span>
							<span>费用承担主体</span>
							<BatchPopover
								ref="costBearerBatchPopover"
								type="select"
								:options="dictMap.legalEntityList"
								label-key="name"
								value-key="id"
								placeholder="请选择费用承担主体"
								@confirm="handleBatchCostBearer"
							/>
						</div>
					</template>
					<template #default="{ row }">
						<el-select
							v-model="row.legalPersonId"
							placeholder="请选择"
							clearable
							filterable
							:disabled="!isRowEditable(row)"
							style="width: 100%"
						>
							<el-option
								v-for="item in dictMap.legalEntityList"
								:key="item.id"
								:label="item.name"
								:value="item.id"
							/>
						</el-select>
					</template>
				</MrTableColumn>

				<!-- 费用项列 -->
				<MrTableColumn label="费用项" width="200">
					<template #header>
						<div class="header-with-batch">
							<span class="required-star">*</span>
							<span>费用项</span>
						</div>
					</template>
					<template #default="{ row }">
						<el-select
							v-model="row.feeId"
							placeholder="请选择"
							clearable
							filterable
							:disabled="!isRowEditable(row)"
							style="width: 100%"
						>
							<el-option
								v-for="item in dictMap.feeList"
								:key="item.id"
								:label="item.feeItem"
								:value="item.id"
								:disabled="isFeeOptionDisabled(row, item.id)"
							/>
						</el-select>
					</template>
				</MrTableColumn>
				<!-- 费用分摊方式列（仅费用分摊模式展示） -->
				<MrTableColumn label="费用分摊方式" width="200">
					<template #header>
						<div class="header-with-batch">
							<span class="required-star">*</span>
							<span>费用分摊方式</span>
							<BatchPopover
								ref="allocationMethodBatchPopover"
								type="select"
								:options="allocationMethodList"
								label-key="name"
								value-key="id"
								placeholder="请选择费用分摊方式"
								@confirm="handleBatchAllocationMethod"
							/>
						</div>
					</template>
					<template #default="{ row }">
						<el-select
							v-model="row.shareType"
							placeholder="请选择"
							clearable
							filterable
							:disabled="!isRowEditable(row)"
							style="width: 100%"
						>
							<el-option
								v-for="item in allocationMethodList"
								:key="item.id"
								:label="item.name"
								:value="item.id"
							/>
						</el-select>
					</template>
				</MrTableColumn>
				<!-- 入账方式列（仅费用分摊模式展示） -->
				<MrTableColumn label="入账方式" width="200">
					<template #header>
						<div class="header-with-batch">
							<span class="required-star">*</span>
							<span>入账方式</span>
							<BatchPopover
								ref="accountModeBatchPopover"
								type="select"
								:options="accountModeList"
								label-key="name"
								value-key="id"
								placeholder="请选择入账方式"
								@confirm="handleBatchAccountMode"
							/>
						</div>
					</template>
					<template #default="{ row }">
						<el-select
							v-model="row.accountsReceiptType"
							placeholder="请选择"
							clearable
							filterable
							:disabled="!isRowEditable(row)"
							style="width: 100%"
						>
							<el-option
								v-for="item in accountModeList"
								:key="item.id"
								:label="item.name"
								:value="item.id"
							/>
						</el-select>
					</template>
				</MrTableColumn>

				<!-- 费用金额/币种列 -->
				<MrTableColumn label="费用金额/币种" width="350">
					<template #header>
						<span class="required-star">*</span>
						<span>费用金额/币种</span>
					</template>
					<template #default="{ row }">
						<div class="amount-currency-wrapper">
							<el-select
								v-model="row.currency"
								placeholder="币种"
								filterable
								:disabled="!isRowEditable(row)"
								style="width: 150px"
								@change="changeCurrency(row)"
							>
								<el-option
									v-for="item in dictMap.currencyList"
									:key="item.currencyCode"
									:label="`${item.currencyCode}- ${item.currencyName}`"
									:value="item.currencyCode"
								/>
							</el-select>
							<el-input
								v-model="row.fee"
								placeholder="请输入金额"
								:disabled="!isRowEditable(row)"
								@change="handleAmountInput(row)"
								style="width: 150px"
							/>
						</div>
					</template>
				</MrTableColumn>
				<!-- 结算方式列：现结(1) / 月结(2) / 双月结(3) -->
				<MrTableColumn label="结算方式" width="160">
					<template #header>
						<span class="required-star">*</span>
						<span>结算方式</span>
					</template>
					<template #default="{ row }">
						<el-select
							v-model="row.settlementMethod"
							placeholder="请选择结算方式"
							clearable
							:disabled="!isRowEditable(row)"
							style="width: 100%"
						>
							<el-option
								v-for="item in settlementModeList"
								:key="item.id"
								:label="item.name"
								:value="item.id"
							/>
						</el-select>
					</template>
				</MrTableColumn>

				<!-- 备注列 -->
				<MrTableColumn label="备注" width="200">
					<template #header>
						<div class="header-with-batch">
							<span>备注</span>
							<BatchPopover
								ref="remarkBatchPopover"
								type="input"
								placeholder="请输入备注"
								@confirm="handleBatchRemark"
							/>
						</div>
					</template>
					<template #default="{ row }">
						<el-input
							v-model="row.remark"
							placeholder="请输入备注"
							maxlength="100"
							clearable
							:disabled="!isRowEditable(row)"
						/>
					</template>
				</MrTableColumn>

				<!-- 操作列 -->
				<MrTableColumn label="操作" width="120" fixed="right">
					<template #default="{ $index, row }">
						<el-button link type="primary" size="small" @click="addRow">
							<el-icon><Plus /></el-icon>
						</el-button>
						<el-button
							link
							type="danger"
							size="small"
							:disabled="tableData.length <= 1 || !isRowEditable(row)"
							@click="deleteRow($index)"
						>
							<el-icon><Delete /></el-icon>
						</el-button>
					</template>
				</MrTableColumn>
			</el-table>
		</div>

		<!-- 试算按钮：不写库，只刷新预览区数据 -->
		<div class="flex justify-end">
			<el-button type="primary" @click="handlePreview">预览分摊结果</el-button>
			<!-- <el-button class="ml-2" @click="showPreviewSummary = !showPreviewSummary">
				{{ showPreviewSummary ? '隐藏统计' : '统计' }}
			</el-button> -->
		</div>

		<!-- ========== 区域二：分摊预览（只读）========== -->
		<div class="mt-2">
			<div class="preview-section-title">预览分摊结果</div>
			<!--
				show-summary：底部合计行；
				fee_${transferFeeId}_* 字段由 buildPreviewRowsAndColumns 写入行对象，与子列 prop 对齐。
			-->
			<MrTable
				:data="previewList"
				border
				style="width: 100%"
				max-height="400"
				:show-summary="showPreviewSummary"
				:summary-method="getPreviewSummaries"
			>
				<!-- 来自调拨单 -->
				<MrTableColumn
					label="发货单号"
					prop="deliveryNo"
					width="160"
					fixed="left"
					show-overflow-tooltip
				/>
				<MrTableColumn
					label="SKU/产品名称"
					width="200"
					fixed="left"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						<div>{{ row.skuCode }}</div>
						<div class="preview-sku-sub">{{ row.skuName }}</div>
					</template>
				</MrTableColumn>
				<!-- 发货箱数不展示 后台说的 -->
				<!-- <MrTableColumn
					label="发货箱数"
					prop="deliveryCartonQuantity"
					width="100"
				/> -->
				<MrTableColumn label="发货数量" prop="deliveryQuantity" width="100" />
				<MrTableColumn label="箱规编码" prop="skuCartonCode" width="140" />
				<MrTableColumn label="外箱长宽高(CM)" width="150" show-overflow-tooltip>
					<template #default="{ row }">
						{{ formatPreviewDimensions(row) }}
					</template>
				</MrTableColumn>
				<MrTableColumn label="总体积(m³)" prop="volumeSum" width="120" />
				<MrTableColumn label="外箱毛重(KG)" prop="grossWeight" width="120" />
				<MrTableColumn label="总毛重(KG)" prop="grossWeightSum" width="110" />
				<!-- 关务：清关单价；申报总价=清关单价*发货数量（计算逻辑后续接） -->
				<MrTableColumn label="申报单价" prop="declareUnitPrice" width="110">
					<template #default="{ row }">
						{{
							row.declareUnitPrice ? getCurrencySymbol(row.declareCurrency) : ''
						}}
						{{ row.declareUnitPrice ? row.declareUnitPrice : '---' }}
					</template>
				</MrTableColumn>
				<MrTableColumn label="申报总价" prop="declareTotalPrice" width="110">
					<template #default="{ row }">
						{{
							row.declareTotalPrice
								? getCurrencySymbol(row.declareCurrency)
								: ''
						}}
						{{ row.declareTotalPrice ? row.declareTotalPrice : '---' }}
					</template>
				</MrTableColumn>
				<!-- 按费用项拆分多级表头：每个 feeCol 对应一行录入里的一个费用 -->
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
				<template #empty>
					<el-empty description="点击预览后显示分摊结果" />
				</template>
			</MrTable>
		</div>

		<!-- ========== 区域三：底部操作 ========== -->
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">取消</el-button>
				<el-button type="primary" @click="handleConfirm">确认分摊</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
/**
 * 二程费用分摊 - 脚本总览
 *
 * 数据流简述：
 * - open() 拉取「已保存费用行」+「已有分摊预览」双接口，填充 tableData / previewList。
 * - handlePreview() / handleConfirm 前半段：用当前 tableData 调用 postTransferFeeShare，再 buildPreviewRowsAndColumns 更新预览。
 * - handleConfirm：先校验可编辑行 → 再隐式预览一遍 → 组装 transferFeeDTOList（含每行 transferFeeShareItemDTOList）→ postTransferFeeSave。
 *
 * 暴露给父组件：
 * - open(type, id, transferNo)
 * - buildPreviewRowsAndColumns(data) 摊平行与动态列元数据（勿改返回结构，index 汇总依赖）
 */
// Vue 运行时与 Element Plus 图标
import { ref } from 'vue';
import { Plus, Delete } from '@element-plus/icons-vue';
// 全局消息、多字典加载
import { useMessage } from '/@/hooks/message';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
// 货代 / 法人主体 / 币种 / 费用项配置
import { getForwarderList } from '/@/api/materialFlow/freightForwarder';
import { getLegalEntitySelect } from '/@/api/admin/legalEntity';
import { getCurrencyOption } from '/@/api/product/sku';
import { feeConfig } from '/@/api/materialFlow/firstMileLogistics';
import {
	transferFeeList,
	getTransferFeeList,
	postTransferFeeSave,
	postTransferFeeShare,
} from '/@/api/materialFlow/secondMileLogistics';
// 表头批量选择、申报币种符号展示
import BatchPopover from '/@/components/BatchPopover/index.vue';
import { getCurrencySymbol } from '/@/utils/rateUtils';

/** 保存成功后通知父页刷新列表 */
const emit = defineEmits(['refresh']);
const msg = useMessage();

/* -------------------------------------------------------------------------- */
/* 弹窗 UI 与当前业务上下文                                                     */
/* -------------------------------------------------------------------------- */
const dialogVisible = ref(false);
const dialogTitle = ref('');
const feeType = ref<'estimate' | 'actual'>('estimate');

/** 业务主键（部分场景记录用，接口主要用调拨单号） */
const recordId = ref<string | number>('');
/** 调拨单号：费用列表、试算、保存均依赖 */
const transferNo = ref<string>('');

/* -------------------------------------------------------------------------- */
/* 下拉静态枚举（与后端 shareType / accountsReceiptType 约定一致）              */
/* -------------------------------------------------------------------------- */
/** 分摊方式：1 毛重 2 体积 3 申报单价 */
const allocationMethodList = [
	{ id: 1, name: '毛重(KG)' },
	{ id: 2, name: '体积(CBM)' },
	{ id: 3, name: '申报单价' },
];
/** 入账方式：1~5 枚举，与保存 DTO accountsReceiptType 对应 */
const accountModeList = [
	{ id: 1, name: '仅请付款' },
	{ id: 2, name: '仅计入费用' },
	{ id: 3, name: '仅计入成本' },
	{ id: 4, name: '计入成本并请款' },
	{ id: 5, name: '计入费用并请款' },
];
/** 结算方式：1 现结 2 月结 3 双月结 */
const settlementModeList = [
	{ id: 1, name: '现结' },
	{ id: 2, name: '月结' },
	{ id: 3, name: '双月结' },
];

/** 预览接口里「单个费用项在某行上的分摊明细」 */
interface TransferFeeShareItemVO {
	shareTotalPrice?: number;
	shareType?: number;
	shareTypeDesc?: string;
	shareUnitPrice?: number;
	exchangeRate?: number;
	transferFeeId?: number;
	currency?: string;
	transferFeeName?: string;
	accountsReceiptTypeDesc?: string;
}

/** 预览表格每一行：发货/关务维度 + 该行下多笔费用的分摊子列表 */
interface TransferFeeShareVO {
	declareTotalPrice?: number;
	declareUnitPrice?: number;
	deliveryCartonQuantity?: number;
	deliveryNo?: string;
	deliveryQuantity?: number;
	grossWeight?: number;
	grossWeightSum?: number;
	size?: string;
	skuCartonCode?: string;
	skuCode?: string;
	skuName?: string;
	transferFeeShareItemList?: TransferFeeShareItemVO[];
	transferNo?: string;
	transferTotalFee?: number;
	volumeSum?: number;
	[property: string]: any;
}

/* -------------------------------------------------------------------------- */
/* 预览表格：数据 + 动态列元数据 + 合计行开关                                      */
/* -------------------------------------------------------------------------- */
/** 下部 MrTable 数据源（含摊平后的 fee_${id}_* 动态字段） */
const previewList = ref<TransferFeeShareVO[]>([]);

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
/** 是否显示表尾合计（原设计可切「统计」按钮，现默认常开） */
const showPreviewSummary = ref(true);

/* -------------------------------------------------------------------------- */
/* 预览：分摊方式文案、transferFeeShareItemList → 行摊平 fee_${id}_*、表尾合计       */
/* -------------------------------------------------------------------------- */

/** 分摊方式 ID → 文案（与 allocationMethodList 含义对齐，供预览列展示） */
const shareTypeMap: Record<number, string> = {
	1: '毛重(KG)',
	2: '体积(CBM)',
	3: '申报单价',
};

/** 优先用后端的 shareTypeDesc，否则用本地枚举映射 */
const getShareTypeText = (shareType?: number, shareTypeDesc?: string) => {
	if (shareTypeDesc) return shareTypeDesc;
	if (!shareType) return '--';
	return shareTypeMap[shareType] || '--';
};

/** 预览「汇率」单元格展示（无则占位 --） */
const getExchangeRate = (item: TransferFeeShareItemVO) => {
	return item.exchangeRate ?? '--';
};

/**
 * 核心：接口返回的嵌套 transferFeeShareItemList → 摊平到行上的 prop 字段 + 生成 v-for 用的列配置
 * @returns rows 供 MrTable :data；columns 供多级动态表头
 */
const buildPreviewRowsAndColumns = (data: TransferFeeShareVO[]) => {
	/**
	 * 预览结果加工：
	 * 1) rows：行内挂 __shareItemMap，并摊平成动态单元格字段，便于 table 直接 prop 读取
	 * 2) columns：动态费用列（费用1..N）配置，给 v-for 用
	 */
	const rows = (data || []).map((row) => {
		const shareItemMap: Record<number, TransferFeeShareItemVO> = {};
		const dynamicCellValues: Record<string, string | number> = {};
		for (const item of row.transferFeeShareItemList || []) {
			if (item.transferFeeId != null) {
				// 分摊方式映射
				shareItemMap[item.transferFeeId] = item;
				// 分摊方式
				dynamicCellValues[`fee_${item.transferFeeId}_shareType`] =
					getShareTypeText(item.shareType, item.shareTypeDesc);
				// 分摊单价
				dynamicCellValues[`fee_${item.transferFeeId}_shareUnitPrice`] =
					item.shareUnitPrice ?? '--';
				// 分摊总价
				dynamicCellValues[`fee_${item.transferFeeId}_shareTotalPrice`] =
					item.shareTotalPrice ?? '--';
				// 汇率
				dynamicCellValues[`fee_${item.transferFeeId}_exchangeRate`] =
					getExchangeRate(item);
				// 币种
				dynamicCellValues[`fee_${item.transferFeeId}_currency`] =
					item.currency ?? 'CNY';
				// 入账方式
				dynamicCellValues[`fee_${item.transferFeeId}_accountsReceiptTypeDesc`] =
					item.accountsReceiptTypeDesc ?? '--';
			}
		}
		return {
			...row,
			__shareItemMap: shareItemMap,
			...dynamicCellValues,
		};
	});

	const feeMap = new Map<number, string>();
	for (const row of rows) {
		for (const item of row.transferFeeShareItemList || []) {
			if (
				item.transferFeeId != null &&
				!feeMap.has(item.transferFeeId) &&
				item.transferFeeName
			) {
				feeMap.set(item.transferFeeId, item.transferFeeName);
			}
		}
	}
	const columns = Array.from(feeMap.entries()).map(
		([transferFeeId, transferFeeName]) => ({
			transferFeeId,
			transferFeeName,
			shareTypeProp: `fee_${transferFeeId}_shareType`,
			shareUnitPriceProp: `fee_${transferFeeId}_shareUnitPrice`,
			shareTotalPriceProp: `fee_${transferFeeId}_shareTotalPrice`,
			exchangeRateProp: `fee_${transferFeeId}_exchangeRate`,
			currencyProp: `fee_${transferFeeId}_currency`,
			accountsReceiptTypeDesc: `fee_${transferFeeId}_accountsReceiptTypeDesc`,
		})
	);

	return { rows, columns };
};

/** 合计行：多级表头时若干子列 property 为空，用 label 兜底解析真实字段名 */
const resolveAllocationColumnProp = (column: {
	property?: string;
	label?: string | (() => unknown);
}): string => {
	if (column.property) return column.property;
	const label = typeof column.label === 'string' ? column.label : '';
	if (label === '费用分摊总价') return 'transferTotalFee';
	return '';
};

/** 合计行：按列 prop 推断应使用哪一列的币种（报关价用 declareCurrency，动态费用用 fee_${id}_currency） */
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

/**
 * Element Table summary-method：首列「合计」；跳过方式/汇率/外箱毛重等列；
 * 金额类列在数字前拼接币种符号，与上层单元格展示一致。
 */
const getPreviewSummaries = ({
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

		// 毛重列不统计（总毛重 grossWeightSum 仍统计）
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

/** 外箱尺寸：优先整条 size 字符串；否则用长宽高拼 L*W*H */
const formatPreviewDimensions = (row: Record<string, unknown>) => {
	if (row?.size) {
		return String(row.size);
	}
	const l = row?.outCartonLength;
	const w = row?.outCartonWidth;
	const h = row?.outCartonHeight;
	if (l == null && w == null && h == null) {
		return '--';
	}
	return `${l ?? '-'}*${w ?? '-'}*${h ?? '-'}`;
};

/* -------------------------------------------------------------------------- */
/* 录入表：字典下拉（货代 / 法人 / 币种 / 费用项）                                */
/* -------------------------------------------------------------------------- */
const { dictMap } = useMultipleDicts(
	[
		{
			key: 'forwarderList',
			fetchFn: getForwarderList,
			params: {
				status: '1', // 只获取启用的货代
			},
		},
		{
			key: 'legalEntityList',
			fetchFn: getLegalEntitySelect,
		},
		{
			key: 'currencyList',
			fetchFn: getCurrencyOption,
		},
		{
			key: 'feeList',
			fetchFn: feeConfig,
		},
	],
	{
		isAuto: true,
	}
);

/** 上部录入表格行集合（含后端回显与本地新增空行） */
const tableData = ref<any[]>([]);

/** paymentRequestStatus === 1：后端锁定行（已请款），禁止编辑/删除，且 confirm 时会被 getEditableRows 过滤 */
const isRowEditable = (row: any) => {
	return Number(row?.paymentRequestStatus) !== 1;
};

/** 校验与保存 payload 仅包含可编辑行 */
const getEditableRows = () => {
	return tableData.value.filter((row) => isRowEditable(row));
};

/* -------------------------------------------------------------------------- */
/* 打开弹窗、增删行、金额格式化                                                 */
/* -------------------------------------------------------------------------- */

/**
 * 打开弹窗并拉数
 * @param type estimate=预估( feeType 1 ) / actual=实际( feeType 2 )
 * @param id 业务记录 id（视调用方传入）
 * @param firstNo 调拨单号
 */
const open = async (
	type: 'estimate' | 'actual',
	id: string | number,
	firstNo: string
) => {
	feeType.value = type;
	recordId.value = id;
	transferNo.value = firstNo;
	// 标题与费用类型一致，便于用户区分预估/实际录入
	dialogTitle.value =
		type === 'estimate'
			? '录入预估费用分摊'
			: type === 'actual'
			? '录入实际费用分摊'
			: '';
	transferNo.value = firstNo;

	// ① 费用录入行：无数据时给一行空模板，避免表格空白无法操作
	const resTransferFeeList = await getTransferFeeList({
		transferNo: transferNo.value,
		feeType: type === 'estimate' ? 1 : 2,
		transferType: 1,
	});
	if (resTransferFeeList?.code === 0 && resTransferFeeList?.data?.length > 0) {
		tableData.value = JSON.parse(JSON.stringify(resTransferFeeList?.data));
	} else {
		tableData.value = [createEmptyRow()];
	}

	// ② 若服务端已有分摊快照，同步填充下部预览（与主列表展示一致）
	const resTransferFeeShareList = await transferFeeList({
		transferNo: transferNo.value,
		feeType: type === 'estimate' ? 1 : 2,
		transferType: 1,
	});
	// 仅处理标准返回结构：{ code, data }
	if (resTransferFeeList?.code === 0 && resTransferFeeShareList?.code === 0) {
		const { rows, columns } = buildPreviewRowsAndColumns(
			(resTransferFeeShareList?.data ?? []) as TransferFeeShareVO[]
		);
		previewFeeColumns.value = columns;
		previewList.value = rows;
	}
	dialogVisible.value = true;
};

/**
 * 新建可编辑行的初始模型（字段名与表单、保存 DTO 对齐）
 */
const createEmptyRow = () => {
	return {
		forwarderId: '',
		legalPersonId: '',
		feeId: '',
		shareType: '',
		accountsReceiptType: '',
		fee: '',
		currency: '',
		settlementMethod: '',
		remark: '',
	};
};

/** 在表格末尾追加一行可编辑空行 */
const addRow = () => {
	tableData.value.push(createEmptyRow());
};

/** 删除指定下标行；至少保留一行；锁定行不可删 */
const deleteRow = (index: number) => {
	if (tableData.value.length <= 1) {
		msg.warning('至少保留一条数据');
		return;
	}
	if (!isRowEditable(tableData.value[index])) {
		msg.warning('该行不可删除');
		return;
	}
	tableData.value.splice(index, 1);
};

/**
 * 金额列失焦/变更：清洗非数字字符，四舍五入保留 4 位小数
 */
const handleAmountInput = (row: any) => {
	if (!isRowEditable(row)) return;
	let raw = row.fee ?? '';
	raw = String(raw);

	// 只允许输入数字和小数点
	let value = raw.replace(/[^\d.]/g, '');
	let num = parseFloat(value);
	if (Number.isNaN(num)) {
		row.fee = '';
		return;
	}
	// 字符串截断法，保证四舍五入精度
	const rounded = (Math.round(Number(num + 'e4')) / 1e4).toFixed(4);
	row.fee = rounded;
};

/**
 * 调用分摊试算接口：入参为当前 tableData 全量映射（含锁定行，锁定行值不变不影响结果）
 */
const handlePreview = async () => {
	// 历史：曾仅对可编辑行试算；现改为全量，与产品/后台约定一致（见下行注释）
	// const editableRows = getEditableRows();
	// if (!validateForm(editableRows)) {
	// 	return;
	// }
	// 直接拿全部的数据进行分摊试算，因为禁用了之后，值是不会变的，再次计算的数据都是一样的
	const res = await postTransferFeeShare(
		tableData.value.map((item) => ({
			...item,
			// transferFeeConfigId: 费用id（后台映射关系）
			transferFeeConfigId: item.feeId,
			// 分摊方式：1、按毛重，2、按体积，3、按申报价格
			shareType: item.shareType,
			// 币种：币种代码
			currency: item.currency,
			// 分摊费用总价（后台映射关系,转换为数字）
			shareTotalPrice: isNaN(Number(item.fee)) ? 0 : Number(item.fee),
			// 费用类型：1、预估费用，2、实际费用
			feeType: feeType.value === 'estimate' ? 1 : 2,
		})),
		transferNo.value
	);
	// 仅处理标准返回结构：{ code, data }
	if (res?.code === 0) {
		const { rows, columns } = buildPreviewRowsAndColumns(
			(res?.data ?? []) as TransferFeeShareVO[]
		);
		previewFeeColumns.value = columns;
		previewList.value = rows;
		return;
	}
};

/** 币种切换后清空金额，避免币种与金额含义不一致 */
const changeCurrency = (row: any) => {
	if (!isRowEditable(row)) return;
	// 如果币种变更，清空金额
	row.fee = '';
};

/** 批量：可编辑行统一赋值货代 */
const handleBatchForwarder = (value: any) => {
	tableData.value.forEach((row) => {
		if (!isRowEditable(row)) return;
		row.forwarderId = value;
	});
};

/** 批量：可编辑行统一赋值费用承担主体 */
const handleBatchCostBearer = (value: any) => {
	tableData.value.forEach((row) => {
		if (!isRowEditable(row)) return;
		row.legalPersonId = value;
	});
};

/** 批量：可编辑行统一赋值备注 */
const handleBatchRemark = (value: any) => {
	tableData.value.forEach((row) => {
		if (!isRowEditable(row)) return;
		row.remark = value;
	});
};

/** 批量：可编辑行统一赋值分摊方式 shareType */
const handleBatchAllocationMethod = (value: number) => {
	tableData.value.forEach((row) => {
		if (!isRowEditable(row)) return;
		row.shareType = value;
	});
};

/** 批量：可编辑行统一赋值入账方式 accountsReceiptType */
const handleBatchAccountMode = (value: string) => {
	tableData.value.forEach((row) => {
		if (!isRowEditable(row)) return;
		row.accountsReceiptType = value;
	});
};

/* -------------------------------------------------------------------------- */
/* 录入约束：费用项互斥                                                        */
/* -------------------------------------------------------------------------- */

/** 下拉：同一 feeId 仅能选一次，避免重复费用项 */
const isFeeOptionDisabled = (currentRow: any, feeId: string) => {
	return tableData.value.some(
		(row) => row !== currentRow && row.feeId && row.feeId === feeId
	);
};

/* -------------------------------------------------------------------------- */
/* 表单校验                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * 提交前校验：仅校验传入 rows（默认可编辑行）；空 table 直接失败
 */
const validateForm = (rows: any[] = getEditableRows()) => {
	// 兼容：若原始 tableData 为空，禁止提交
	if (!tableData.value.length) {
		msg.warning('暂无费用数据，无法提交');
		return false;
	}
	// 兼容：rows 为空可能是“唯一一行 paymentRequestStatus=1 被过滤”，此场景不在此处拦截
	// 即：有原始行但都不可修改时，允许走后续逻辑（最终提交空的费用明细）
	for (let i = 0; i < rows.length; i++) {
		const row = rows[i];

		if (!row.forwarderId) {
			msg.error(`第 ${i + 1} 行：请选择货代`);
			return false;
		}

		if (!row.legalPersonId) {
			msg.error(`第 ${i + 1} 行：请选择费用承担主体`);
			return false;
		}

		if (!row.feeId) {
			msg.error(`第 ${i + 1} 行：请选择费用项`);
			return false;
		}
		// 仅费用分摊模式校验分摊方式和入账方式
		if (!row.shareType) {
			msg.error(`第 ${i + 1} 行：请选择费用分摊方式`);
			return false;
		}
		if (!row.accountsReceiptType) {
			msg.error(`第 ${i + 1} 行：请选择入账方式`);
			return false;
		}
		if (isNaN(Number(row.fee)) || Number(row.fee) <= 0) {
			msg.error(`第 ${i + 1} 行：请输入大于0的金额`);
			return false;
		}

		if (!row.currency) {
			msg.error(`第 ${i + 1} 行：请选择币种`);
			return false;
		}
		if (!row.settlementMethod) {
			msg.error(`第 ${i + 1} 行：请选择结算方式`);
			return false;
		}
	}

	return true;
};

/* -------------------------------------------------------------------------- */
/* 保存：从预览表按 feeId 抽取 transferFeeShareItemDTOList、回填汇率              */
/* -------------------------------------------------------------------------- */

/**
 * 根据费用项 ID 组装保存所需的分摊明细列表
 * transferFeeShareItemDTOList 不能为空，因此这里从“预览结果”中按 feeId 提取对应明细
 */
const buildTransferFeeShareItemDTOList = (feeId: number) => {
	const rows = previewList.value || [];

	return rows
		.map((row: any) => {
			const shareItem =
				row?.__shareItemMap?.[feeId] ||
				(row?.transferFeeShareItemList || []).find((item: any) => {
					// transferFeeId是后端的返回值，只要关注这个
					return Number(item?.transferFeeConfigId) === Number(feeId);
				});

			if (!shareItem) return null;

			return {
				...row,
				// 后端要求“申报单价不能为空”，这里做数值兜底避免传 null
				declareTotalPrice: Number(row?.declareTotalPrice ?? 0),
				declareUnitPrice: Number(row?.declareUnitPrice ?? 0),
				deliveryNo: row?.deliveryNo,
				grossWeight: Number(row?.grossWeight ?? 0),
				grossWeightSum: Number(row?.grossWeightSum ?? 0),
				quantity: Number(row?.deliveryQuantity ?? 0),
				shareTotalPrice: Number(shareItem?.shareTotalPrice ?? 0),
				shareUnitPrice: Number(shareItem?.shareUnitPrice ?? 0),
				size: row?.size,
				skuCartonCode: row?.skuCartonCode,
				skuCode: row?.skuCode,
				skuName: row?.skuName,
				volumeSum: Number(row?.volumeSum ?? 0),
			};
		})
		.filter(Boolean);
};

/**
 * 根据费用项 ID 从“预览结果”里反查汇率
 * 说明：exchangeRate 不一定在录入行(tableData)上，可能只在预览返回的分摊明细里
 */
const getExchangeRateFromPreview = (feeId: number): number | undefined => {
	for (const row of previewList.value || []) {
		const shareItem =
			row?.__shareItemMap?.[feeId] ||
			(row?.transferFeeShareItemList || []).find(
				// transferFeeConfigId 是为映射值
				(item: any) => {
					return Number(item?.transferFeeConfigId) === Number(feeId);
				}
			);

		const rate = Number(shareItem?.exchangeRate);
		if (Number.isFinite(rate)) {
			return rate;
		}
	}
	return undefined;
};

/* -------------------------------------------------------------------------- */
/* 保存主流程                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * 确认分摊并保存：先校验 → 隐式再预览保证 previewList 最新 → 组装 DTO → 保存
 */
const handleConfirm = async () => {
	// 锁定行不会进入 transferFeeDTOList
	const editableRows = getEditableRows();
	// 校验表单
	if (!validateForm(editableRows)) {
		return;
	}
	try {
		// 与后台约定：保存前需以最新 tableData 再跑一遍试算，确保 transferFeeShareItemDTOList 与 preview 对齐
		await handlePreview();
		// 费用分摊模式：transferFeeShareItemDTOList 依赖预览结果
		if (!previewList.value?.length) {
			msg.warning('请先预览分摊结果');
			return;
		}
		// tableData 是上面录入的数据，进行反查，然后拼装
		const transferFeeDTOList = editableRows.map((item) => {
			const feeId = Number(item.feeId);
			const transferFeeShareItemDTOList =
				buildTransferFeeShareItemDTOList(feeId);
			const exchangeRateFromRow = Number(item.exchangeRate);
			const exchangeRate =
				Number.isFinite(exchangeRateFromRow) && exchangeRateFromRow > 0
					? exchangeRateFromRow
					: getExchangeRateFromPreview(feeId);
			return {
				forwarderId: Number(item.forwarderId),
				legalPersonId: Number(item.legalPersonId),
				feeId,
				transferFeeConfigId: feeId,
				shareType: Number(item.shareType),
				accountsReceiptType: item.accountsReceiptType,
				fee: isNaN(Number(item.fee)) ? 0 : Number(item.fee),
				currency: item.currency,
				settlementMethod: Number(item.settlementMethod),
				remark: item.remark,
				// 汇率优先取录入行，其次从预览结果中按 feeId 回填
				exchangeRate,
				// 新增：保存接口要求该字段不能为空
				transferFeeShareItemDTOList,
			};
		});
		// 兜底校验：任一费用项没有匹配到分摊明细时，阻断提交
		if (
			transferFeeDTOList.some(
				(item) =>
					!item.transferFeeShareItemDTOList ||
					item.transferFeeShareItemDTOList.length === 0
			)
		) {
			msg.warning('分摊明细不能为空，请先预览并检查费用项');
			return;
		}
		const res = await postTransferFeeSave({
			feeType: feeType.value === 'estimate' ? 1 : 2,
			transferNo: transferNo.value,
			transferType: 1,
			transferFeeDTOList,
		});
		if (res.code === 0) {
			msg.success('保存成功');
			dialogVisible.value = false;
			emit('refresh');
		}
	} catch (error: any) {
		msg.error(error?.msg || error?.message || '保存失败');
	}
};

/**
 * 关闭并清空状态，避免下次打开残留预览列与缓存数据
 */
const handleClose = () => {
	dialogVisible.value = false;
	tableData.value = [];

	previewFeeColumns.value = [];
	previewList.value = [];
};

/** 供父组件 index：打开弹窗 + 与列表页共用的预览摊平（勿删、勿改返回结构） */
defineExpose({
	open,
	buildPreviewRowsAndColumns,
});
</script>

<style lang="scss" scoped>
/* 弹窗内录入/预览区局部样式（表头必填星号、SKU 灰色副文案等） */
.fee-dialog-content {
	padding: 0;
}

.header-with-batch {
	display: flex;
	align-items: center;
	width: 100%;

	.required-star {
		color: #f56c6c;
	}
}

.amount-currency-wrapper {
	display: flex;
	align-items: center;
}

.preview-section-title {
	font-weight: bold;
	font-size: 14px;
	margin: 12px 0 8px;
	color: #303133;
}

.preview-sku-sub {
	color: #909399;
	font-size: 12px;
	margin-top: 2px;
}

:deep(.el-table) {
	.required-star {
		color: #f56c6c;
		margin-right: 4px;
	}
}
</style>
