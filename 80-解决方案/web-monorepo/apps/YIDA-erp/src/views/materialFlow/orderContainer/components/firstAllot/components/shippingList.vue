<template>
	<el-form ref="formRef">
		<el-row class="mb18" align="middle">
			<el-col :span="8">
				<span><span style="color: red">*</span>实际装柜时间</span>
				<el-form-item>
					<el-date-picker
						v-model="actualLoadingTime"
						type="datetime"
						value-format="YYYY-MM-DD HH:mm:ss"
						placeholder="年/月/日"
						disabled
					/>
				</el-form-item>
			</el-col>
		</el-row>
	</el-form>
	<el-table
		:data="state.dataList"
		v-loading="state.loading"
		border
		max-height="500"
		ref="tableRef"
		row-key="id"
		show-summary
		:summary-method="getSummaries"
		sum-text="合计"
		:cell-style="tableStyle.cellStyle"
		:header-cell-style="tableStyle.headerCellStyle"
		class="custom-table"
		native-scrollbar
	>
		<el-table-column
			prop="deliveryNo"
			:label="t('发货单号')"
			fixed
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }"> {{ row.deliveryNo || '---' }} </template>
		</el-table-column>
		<el-table-column
			prop="shippingMethod"
			:label="t('发货方式')"
			fixed
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.shippingMethodText || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="destWarehouseCode"
			:label="t('目的仓')"
			fixed
			show-overflow-tooltip
			width="180"
		>
			<!-- <template #header>
				<div class="header-with-batch">
					<span class="required-star">*</span>
					<span>目的仓</span>
					<BatchPopover
						ref="forwarderBatchPopover"
						type="select"
						v-if="
							state.dataList?.some(
								(item) => item.shippingMethod === 'dropshipping'
							)
						"
						:options="props.dictMap.thirdWarehouseList.map((item:any
            ) => ({
							...item,
							name: `${item.spName}-${item.warehouseName}`,
						}))"
						label-key="name"
						value-key="warehouseCode"
						placeholder="请选择目的仓"
						@confirm="handleBatchDestWarehouse"
					/>
				</div>
			</template> -->
			<!-- 发货方式为一件代发的，默认为空，必填，下拉单选三方仓 -->
			<template #default="{ row }">
				<div
					v-if="row.shippingMethod === 'dropshipping'"
					class="unit-item"
					:style="{
						display: 'flex',
						'flex-direction': 'column',
						'align-items': 'center',
						width: '100%',
					}"
				>
					<el-select
						v-model="row.destWarehouseCode"
						filterable
						placeholder="请选择"
						clearable
						:disabled="true"
					>
						<!-- disabled -->
						<el-option
							v-for="item in props.dictMap.thirdWarehouseList"
							:key="item.warehouseCode"
							:label="`${item.spName}-${item.warehouseName}`"
							:value="item.warehouseCode"
						/>
					</el-select>
				</div>
				<div v-else>{{ row.destWarehouseName || '---' }}</div>
			</template>
		</el-table-column>
		<el-table-column
			prop="skuCode"
			:label="t('SKU/产品名称')"
			show-overflow-tooltip
			sortable="custom"
			width="160"
		>
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
		</el-table-column>
		<el-table-column
			prop="shipmentQuantity"
			:label="t('发货数量')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row, $index }">
				<el-form-item class="spec-item">
					<el-input
						v-model="row.shipmentQuantity"
						:placeholder="$t('请输入')"
						size="default"
						@blur="validateRowField($index, 'shipmentQuantity')"
						:class="{
							'is-error': fieldErrors[`${$index}-shipmentQuantity`],
						}"
						:disabled="true"
					/>
					<div
						v-if="fieldErrors[`${$index}-shipmentQuantity`]"
						class="error-message"
					>
						{{ fieldErrors[`${$index}-shipmentQuantity`] }}
					</div>
				</el-form-item>
			</template>
		</el-table-column>
		<el-table-column
			prop="outCartonLength"
			:label="t('外箱长宽高')"
			width="380"
		>
			<template #default="{ row, $index }">
				<div class="spec-input-group">
					<el-form-item class="spec-item">
						<el-input
							v-model="row.outCartonLength"
							:placeholder="$t('长')"
							size="default"
							@blur="validateRowField($index, 'outCartonLength')"
							:class="{ 'is-error': fieldErrors[`${$index}-outCartonLength`] }"
							:disabled="true"
						/>
						<div
							v-if="fieldErrors[`${$index}-outCartonLength`]"
							class="error-message"
						>
							{{ fieldErrors[`${$index}-outCartonLength`] }}
						</div>
					</el-form-item>
					<el-form-item class="spec-item">
						<el-input
							v-model="row.outCartonWidth"
							:placeholder="$t('宽')"
							size="default"
							@blur="validateRowField($index, 'outCartonWidth')"
							:class="{ 'is-error': fieldErrors[`${$index}-outCartonWidth`] }"
							:disabled="true"
						/>
						<div
							v-if="fieldErrors[`${$index}-outCartonWidth`]"
							class="error-message"
						>
							{{ fieldErrors[`${$index}-outCartonWidth`] }}
						</div>
					</el-form-item>
					<el-form-item class="spec-item">
						<el-input
							v-model="row.outCartonHeight"
							:placeholder="$t('高')"
							size="default"
							@blur="validateRowField($index, 'outCartonHeight')"
							:class="{ 'is-error': fieldErrors[`${$index}-outCartonHeight`] }"
							:disabled="true"
						/>
						<div
							v-if="fieldErrors[`${$index}-outCartonHeight`]"
							class="error-message"
						>
							{{ fieldErrors[`${$index}-outCartonHeight`] }}
						</div>
					</el-form-item>
				</div>
			</template>
		</el-table-column>
		<el-table-column
			prop="skuCartonCode"
			:label="t('箱规编码')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.skuCartonCode || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="productNetWeight"
			:label="t('产品净重(KG)')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row, $index }">
				<el-form-item class="spec-item">
					<el-input
						v-model="row.productNetWeight"
						:placeholder="$t('请输入')"
						size="default"
						@blur="validateRowField($index, 'productNetWeight')"
						:class="{ 'is-error': fieldErrors[`${$index}-productNetWeight`] }"
						:disabled="true"
					/>
					<div
						v-if="fieldErrors[`${$index}-productNetWeight`]"
						class="error-message"
					>
						{{ fieldErrors[`${$index}-productNetWeight`] }}
					</div>
				</el-form-item>
			</template>
		</el-table-column>
		<el-table-column
			prop="outCartonGrossWeight"
			:label="t('外箱毛重(KG)')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row, $index }">
				<el-form-item class="spec-item">
					<el-input
						v-model="row.outCartonGrossWeight"
						:placeholder="$t('请输入')"
						size="default"
						@blur="validateRowField($index, 'outCartonGrossWeight')"
						:class="{
							'is-error': fieldErrors[`${$index}-outCartonGrossWeight`],
						}"
						:disabled="true"
					/>
					<div
						v-if="fieldErrors[`${$index}-outCartonGrossWeight`]"
						class="error-message"
					>
						{{ fieldErrors[`${$index}-outCartonGrossWeight`] }}
					</div>
				</el-form-item>
				<!-- <el-input v-model="row.outCartonGrossWeight" /> -->
				<!-- {{ row.outCartonGrossWeight || '---' }} -->
			</template>
		</el-table-column>
		<el-table-column
			prop="singleCartonQuantity"
			:label="t('单箱数量')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.singleCartonQuantity || '---' }}
			</template>
		</el-table-column>
		<!-- <el-table-column
			prop="shipmentQuantity"
			:label="t('发货数量')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.shipmentQuantity || '---' }}
			</template>
		</el-table-column> -->
		<el-table-column
			prop="totalVolume"
			:label="t('总体积(m³)')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.totalVolume.toFixed(2) || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="totalNetWeight"
			:label="t('总净重(KG)')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.totalNetWeight.toFixed(2) || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="totalGrossWeight"
			:label="t('总毛重(KG)')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.totalGrossWeight.toFixed(2) || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="countryCode"
			:label="t('国家')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.countryCode || '---' }}-{{ row.countryText || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="startPortCode"
			:label="t('起始港')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.startPortCode || '---' }}-{{ row.startPortName || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="destPortCode"
			:label="t('目的港')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.destPortCode || '---' }}-{{ row.destPortName || '---' }}
			</template>
		</el-table-column>

		<el-table-column
			prop="mskuCode"
			:label="t('MSKU')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }"> {{ row.mskuCode || '---' }} </template>
		</el-table-column>
		<el-table-column
			prop="orderTypeText"
			:label="t('订单类型')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.orderTypeText || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="platformChannelCode"
			:label="t('渠道')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.platformChannelCodeText || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="storeName"
			:label="t('平台店铺')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.storeName || '---' }}:{{ row.countryCode || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="shipmentId"
			:label="t('平台入库单')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }"> {{ row.shipmentId || '---' }} </template>
		</el-table-column>
		<el-table-column
			prop="barcode"
			:label="t('条码')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }"> {{ row.barcode || '---' }} </template>
		</el-table-column>
		<el-table-column
			prop="referenceId"
			:label="t('送仓码')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }"> {{ row.referenceId || '---' }} </template>
		</el-table-column>
		<el-table-column
			prop="remark"
			:label="t('运营/物控备注')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }"> {{ row.remark || '---' }} </template>
		</el-table-column>

		<el-table-column
			prop="factoryId"
			:label="t('工厂名称')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }"> {{ row.factoryName || '---' }} </template>
		</el-table-column>
		<el-table-column
			prop="purchaseUserId"
			:label="t('采购员')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.purchaseUserName || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="factoryDeliveryDate"
			:label="t('工厂回复交期')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.factoryDeliveryDate || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="planShipmentDate"
			:label="t('计划发货时间')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.planShipmentDate || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="purchaseNo"
			:label="t('采购单号')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }"> {{ row.purchaseNo || '---' }} </template>
		</el-table-column>
		<el-table-column
			prop="deptName"
			:label="t('部门&小组')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }"> {{ row.deptName || '---' }} </template>
		</el-table-column>
		<el-table-column
			prop="operationUserId"
			:label="t('运营')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }">
				{{ row.operationUserName || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="createId"
			:label="t('物控')"
			show-overflow-tooltip
			width="180"
		>
			<template #default="{ row }"> {{ row.createName || '---' }} </template>
		</el-table-column>
	</el-table>
	<div class="section-title">
		<span class="section-bar"></span><span style="color: red">*</span>装柜顺序
	</div>
	<el-form ref="formRef" label-width="120px">
		<mr-table-vxe
			ref="sortTableRef"
			:data="loadingSort"
			:row-config="{ keyField: 'factoryName', drag: true }"
			max-height="300"
		>
			<mr-table-column-vxe type="seq" title="序号" width="60" />
			<mr-table-column-vxe field="factoryName" title="工厂" min-width="200">
				<template #default="{ row }">
					{{ row?.countryName }}
				</template>
			</mr-table-column-vxe>
			<mr-table-column-vxe field="countryName1" title="地址" min-width="250">
				<template #default="{ row }">
					<span v-if="row.id">
						{{ row?.countryName }}
						{{ row?.provinceName }}
						{{ row?.cityName }}
						{{ row?.districtName }}
						{{ row?.streetName }}
					</span>
					<span v-else>---</span>
				</template>
			</mr-table-column-vxe>
			<mr-table-column-vxe
				field="detailAddress"
				title="详细地址"
				min-width="180"
			>
				<template #default="{ row }">{{ row?.address || '---' }}</template>
			</mr-table-column-vxe>
			<mr-table-column-vxe field="contact" title="联系人" width="120">
				<template #default="{ row }">{{ row?.contact || '---' }}</template>
			</mr-table-column-vxe>
			<mr-table-column-vxe field="phone" title="联系电话" width="150">
				<template #default="{ row }">{{ row?.phone || '---' }}</template>
			</mr-table-column-vxe>
		</mr-table-vxe>
	</el-form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { Rule } from '@form-create/element-ui';
import { rule } from '/@/utils/validate';

const { t } = useI18n();
const props = defineProps({
	dictMap: { type: Object, default: () => ({}) },
	visiableType: {
		type: String,
		default: '',
	},
});

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
});

//  table hook
const { tableStyle, setTableData } = useTable(state, null);
// tableRef
const tableRef = ref<any>(null);

const actualLoadingTime = ref('');
// 装柜顺序
const loadingSort = ref<
	Array<{
		factoryId: any;
		id: any;
		factoryName: string;
		factoryAddress?: string;
	}>
>([]);
// 工厂下拉选项
const factoryOptions = ref<
	Array<
		| { id: any; factoryId: any; factoryName: string; factoryAddress?: string }
		| any
	>
>([]);

// 工厂辅助查找
// const getFactory = (id: any) =>
// 	factoryOptions.value.find((item: any) => item.id === id);

// // 选择工厂联动地址，并做去重校验
// const onFactoryChange = (index: number, val: any) => {
// 	const pickedIds = loadingSort.value.map((i) => i.id);
// 	const dupIndex = pickedIds.findIndex((id, i) => i !== index && id === val);
// 	if (dupIndex !== -1) {
// 		useMessage().warning('不可重复选择同一工厂');
// 		return;
// 	}
// 	const opt = factoryOptions.value.find((o) => o.id === val);
// 	if (opt) {
// 		loadingSort.value[index].id = opt.id;
// 		loadingSort.value[index].factoryId = opt.factoryId;
// 		loadingSort.value[index].factoryName = opt.factoryName;
// 		loadingSort.value[index].factoryAddress = opt.factoryAddress || '';
// 	}
// };
// 新增工厂，初始值为空
// const addFactoryOrder = () => {
// 	if (loadingSort.value.length < factoryOptions.value.length) {
// 		loadingSort.value.push({
// 			factoryId: '',
// 			id: '',
// 			factoryName: '',
// 			factoryAddress: '',
// 		});
// 	} else {
// 		useMessage().warning('可添加工厂数已达上限');
// 	}
// };
// 删除工厂
// const removeFactoryOrder = (idx: number) => {
// 	loadingSort.value.splice(idx, 1);
// };

const getDataList = () => state.dataList;
const setData = (data: any) => {
	setTableData(data);
};
const setTime = (time: any) => {
	actualLoadingTime.value = time;
};

// 设置工厂下拉列表
const setLoadContainerSort = (
	list: Array<{
		id: any;
		factoryId: any;
		factoryName: string;
		factoryAddress?: string;
	}> = []
) => {
	loadingSort.value = Array.isArray(list) ? [...list] : [];
};
// 获取已设置的工厂顺序
const getLoadContainerSort = () => loadingSort.value.map((i) => i.id);

// 设置工厂下拉列表
const setFactoryOptions = (
	list: Array<{
		id: any;
		factoryId: any;
		factoryName: string;
		factoryAddress?: string;
	}>
) => {
	factoryOptions.value = Array.isArray(list) ? list : [];
};

// 求和
const getSummaries = ({ columns, data }: { columns: any[]; data: any[] }) => {
	const sums: (string | number)[] = [];
	columns.forEach((column, index) => {
		if (index === 0) {
			sums[index] = '合计';
			return;
		}
		if (column.property === 'shipmentQuantity') {
			// 发货箱数求和
			const total = data.reduce(
				(sum, item) => sum + (Number(item.shipmentQuantity) || 0),
				0
			);
			sums[index] = total.toFixed();
		} else if (column.property === 'totalVolume') {
			// 退货数量求和
			const total = data.reduce(
				(sum, item) => sum + (Number(item.totalVolume) || 0),
				0
			);
			sums[index] = total.toFixed(2);
		} else if (column.property === 'totalNetWeight') {
			// 退货数量求和
			const total = data.reduce(
				(sum, item) => sum + (Number(item.totalNetWeight) || 0),
				0
			);
			sums[index] = total.toFixed(2);
		} else if (column.property === 'totalGrossWeight') {
			// 退货数量求和
			const total = data.reduce(
				(sum, item) => sum + (Number(item.totalGrossWeight) || 0),
				0
			);
			sums[index] = total.toFixed(2);
		} else {
			sums[index] = '';
		}
	});
	return sums;
};

// 当前验证的行索引
// let currentValidatingRowIndex = -1;

// 获取当前验证的行索引
// const getCurrentRowIndex = () => {
// 	return currentValidatingRowIndex;
// };
/**
 * 校验数字最多允许2位小数的验证规则
 */
const maxTwoDecimalPlaces = (rule: Rule, value: string, callback: Function) => {
	if (value && !/^\d+(\.\d{1,2})?$/.test(value)) {
		callback(new Error('最多允许2位小数'));
	} else {
		callback();
	}
};

/**
 * 校验数字最多允许4位小数的验证规则
 */
const maxFourDecimalPlaces = (
	rule: Rule,
	value: string,
	callback: Function
) => {
	if (value && !/^\d+(\.\d{1,4})?$/.test(value)) {
		callback(new Error('最多允许4位小数'));
	} else {
		callback();
	}
};

// 错误信息存储
const fieldErrors = ref<Record<string, string>>({});
// 获取字段验证规则
const getFieldRules = (fieldName: string) => {
	const rulesMap: Record<string, any[]> = {
		// deliveryCartonQuantity: [
		// 	{ required: true, message: '请输入发货箱数', trigger: 'blur' },
		// 	{ validator: rule.number },
		// 	{
		// 		// 只允许整数
		// 		validator(rule: any, value: string | null, callback: Function) {
		// 			if (value == null || value === '') {
		// 				return callback(); // 交给 required 去校验
		// 			}
		// 			if (!Number.isInteger(Number(value))) {
		// 				return callback(new Error('只能输入整数'));
		// 			}
		// 			// 直接添加正整数
		// 			if (Number(value) <= 0) {
		// 				return callback(new Error('只能输入正整数'));
		// 			}
		// 			callback();
		// 		},
		// 		trigger: 'blur',
		// 	},
		// ],
		outCartonLength: [
			{ required: true, message: '请输入长度', trigger: 'blur' },
			{ validator: maxTwoDecimalPlaces, trigger: 'blur' },
		],
		outCartonWidth: [
			{ required: true, message: '请输入宽度', trigger: 'blur' },
			{ validator: maxTwoDecimalPlaces, trigger: 'blur' },
			// {
			// 	// 宽不能大于长度的验证规则
			// 	validator: (rule: Rule, value: string, callback: Function) => {
			// 		const rowIndex = getCurrentRowIndex();
			// 		if (rowIndex === -1) return callback();

			// 		const outCartonLength = Number(state.dataList[rowIndex].outCartonLength); // 使用当前长度的值进行比较
			// 		const outCartonWidth = Number(value); // 使用当前宽度的值进行比较
			// 		if (!outCartonLength) {
			// 			return callback(); // 如果长度未填写，则不进行校验
			// 		}
			// 		if (value && outCartonWidth > outCartonLength) {
			// 			callback(new Error('不能大于长'));
			// 		} else {
			// 			callback();
			// 		}
			// 	},
			// 	trigger: 'blur',
			// },
		],
		outCartonHeight: [
			{ required: true, message: '请输入高度', trigger: 'blur' },
			{ validator: maxTwoDecimalPlaces, trigger: 'blur' },
			// {
			// 	// 高度不能大于宽度的验证规则
			// 	validator: (rule: Rule, value: string, callback: Function) => {
			// 		const rowIndex = getCurrentRowIndex();
			// 		if (rowIndex === -1) return callback();

			// 		const outCartonHeight = Number(value); // 使用当前高度的值进行比较
			// 		const outCartonWidth = Number(state.dataList[rowIndex].outCartonWidth);
			// 		if (!outCartonWidth) {
			// 			return callback(); // 如果宽度未填写，则不进行校验
			// 		}

			// 		if (value && outCartonHeight > outCartonWidth) {
			// 			callback(new Error('不能大于宽'));
			// 		} else {
			// 			callback();
			// 		}
			// 	},
			// 	trigger: 'blur',
			// },
		],
		productNetWeight: [
			{ required: true, message: '请输入产品净重', trigger: 'blur' },
			{ validator: rule.number },
			{ validator: maxFourDecimalPlaces, trigger: 'blur' },
		],
		outCartonGrossWeight: [
			{ required: true, message: '请输入外箱净重', trigger: 'blur' },
			{ validator: rule.number },
			{ validator: maxFourDecimalPlaces, trigger: 'blur' },
		],
	};

	return rulesMap[fieldName] || [];
};
// 手动验证字段
const validateRowField = async (rowIndex: number, fieldName: string) => {
	const fieldKey = `${rowIndex}-${fieldName}`;
	const value = state.dataList?.[rowIndex]?.[fieldName];

	try {
		// 设置当前验证的行索引
		// currentValidatingRowIndex = rowIndex;

		// 根据字段名获取验证规则
		const rules = getFieldRules(fieldName);

		for (const rule of rules) {
			if (rule.required && (!value || value === '')) {
				fieldErrors.value[fieldKey] = rule.message || '此字段为必填项';
				return;
			}

			if (rule.validator && value) {
				await new Promise((resolve, reject) => {
					rule.validator(rule, value, (error?: Error) => {
						if (error) {
							reject(error);
						} else {
							resolve(undefined);
						}
					});
				});
			}
		}

		// 如果没有错误，清除错误信息
		delete fieldErrors.value[fieldKey];
	} catch (error: any) {
		fieldErrors.value[fieldKey] = error.message || '验证失败';
	} finally {
		// 重置当前验证的行索引
		// currentValidatingRowIndex = -1;
	}
};

// const handleBatchDestWarehouse = (value: any) => {
// 	const dataList = state.dataList?.map((item: any) => {
// 		if (item.shippingMethod === 'dropshipping') {
// 			item.destWarehouseCode = value;
// 		}
// 		return item;
// 	});
// 	setData(dataList);
// };

defineExpose({
	setData,
	setTime,
	actualLoadingTime,
	getDataList,
	setLoadContainerSort,
	getLoadContainerSort,
	setFactoryOptions,
});
</script>

<style lang="scss" scoped>
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
.operate {
	display: flex;
	gap: 8px;
	margin-left: 20px;
}

/* 自定义表格样式 - 确保行对齐 */
.custom-table {
	:deep(.el-table__row) {
		height: 60px; /* 增大行高以容纳错误信息 */
	}
	:deep(.el-table__cell) {
		padding: 4px; /* 适中的内边距 */
		vertical-align: middle; /* 垂直居中对齐 */
	}

	:deep(.cell) {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 60px;
	}
	:deep(.el-table__footer) {
		height: 50px;
	}
}
.unit-item {
	width: 140px;
	margin-bottom: 0;
}
/* 输入组件样式 */
.spec-input-group,
.quantity-input-group,
.weight-input-group,
.container-input-group {
	display: flex;
	align-items: flex-start;
	justify-content: center;
	width: 100%;
}

.spec-item {
	margin-bottom: 0;
}

/* 错误样式 */
.is-error {
	:deep(.el-input__wrapper) {
		border-color: #f56c6c !important;
		box-shadow: 0 0 0 1px #f56c6c inset !important;
	}
}

.error-message {
	color: #f56c6c;
	font-size: 12px;
	line-height: 1;
	padding-top: 2px;
	position: absolute;
	top: 100%;
	left: -20px;
	width: 100%;
	z-index: 1;
}
.header-with-batch {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;

	.required-star {
		color: #f56c6c;
		margin-right: 4px;
	}
}
</style>
